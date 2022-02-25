import {
  HttpHandler,
  HttpRequest,
  HttpResponse,
  tables,
} from "@architect/functions";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import {
  BaseUser,
  BaseTeam,
  BaseTeammate,
  HttpRequestWithTables,
  HttpRequestWithTeams,
  HttpRequestWithUser,
  HttpRequestWithSignableEntity,
  HttpRequestWithPresignedPost,
} from "./types";
import {
  createDataWrapper,
  Datastore,
  DBKeys,
  TableKeyManager,
} from "@calatrava/datawrapper";
import { attachCommonHeaders } from "./common";

export const createGetTables = function (tableKeyManager: TableKeyManager) {
  return async function getTables(
    req: HttpRequest,
    _context: any
  ): Promise<HttpResponse | void> {
    const data = await tables();

    (req as unknown as HttpRequestWithTables).tables = {
      get<T>(prop: string, tableName: string = "core") {
        const table = data[tableName] as unknown as Datastore;
        return createDataWrapper<T>(prop, table, data["_doc"], tableKeyManager);
      },
    };
  } as HttpHandler;
};

// requires tables to be fetched first
export const createGetUser = function <User>(
  usersTableKey: string,
  decodeToken: Function
) {
  return async function getUser(
    req: HttpRequestWithTables,
    _context: any
  ): Promise<HttpResponse | void> {
    try {
      if (!req.headers["authorization"]) {
        return attachCommonHeaders({
          statusCode: 401,
          json: {},
        });
      }

      const token = req.headers["authorization"].substring("Bearer ".length);
      const usersTable = req.tables.get<User>(usersTableKey);

      const decodedToken = decodeToken(token);
      const userId = (decodedToken.sub as any).userId;
      const user = await usersTable.getById({ userId });

      if (!user) {
        return attachCommonHeaders({
          statusCode: 401,
          json: {},
        });
      }

      (req as HttpRequestWithUser<User>).user = user;
    } catch (e) {
      console.log("Error decoding token and fetching user");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 401,
        json: {},
      });
    }
  } as HttpHandler;
};

export const createGetUserTeams = function <
  User extends BaseUser,
  Team extends BaseTeam,
  Teammate extends BaseTeammate
>(teamsKey: string, teammatesKey: string) {
  return async function (req: HttpRequestWithUser<User>, _context: any) {
    const teamsTable = req.tables.get<Team>(teamsKey);
    const teammatesTable = req.tables.get<Teammate>(teammatesKey);

    try {
      const ownedTeamsPromise = teamsTable.getAllById(
        { userId: req.user.userId },
        {},
        DBKeys.Sort
      );

      const joinedTeamsPromise = teammatesTable
        .getAllById({ userId: req.user.userId }, {}, DBKeys.Sort)
        .then((teammateRecords: Teammate[]) => {
          const teamIds = teammateRecords.map(
            (teammateRecord) => teammateRecord.teamId
          );
          if (teamIds?.length) {
            // This wont work currently
            return teamsTable.getAllByManyIds(teamIds, "teamId");
          } else {
            return [];
          }
        });

      (req as HttpRequestWithTeams<Team, User>).ownedTeams =
        await ownedTeamsPromise;
      (req as HttpRequestWithTeams<Team, User>).joinedTeams =
        await joinedTeamsPromise;

      return;
    } catch (e) {
      console.log("Error fetching teams");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 500,
        json: {},
      });
    }
    // req.teams =
  } as HttpHandler;
};

export function isValidRequest(schema: any) {
  return async function (
    req: HttpRequestWithTables,
    _context: any
  ): Promise<HttpResponse | void> {
    try {
      schema.strict().parse(req.body);
    } catch (e) {
      console.log("Error validating request body");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 400,
        json: e,
      });
    }
  } as HttpHandler;
}

export const logDatabase = function (tableName: string) {
  return async function (
    _req: HttpRequestWithTables
  ): Promise<HttpResponse | undefined> {
    try {
      const data = await tables();
      const everything = data?.[tableName]?.scan({});

      console.log("EVERYTHING", JSON.stringify(everything, null, 2));

      return;
    } catch (e) {
      console.log("Error logging EVERYTHING");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 500,
        json: e,
      });
    }
  } as HttpHandler;
};

export function createGetPresignedPost<Team, User>(
  STORAGE_ACCESS_KEY: string,
  STORAGE_SECRET_KEY: string,
  STORAGE_BUCKET: string
) {
  return function getPresignedPost<T>(tableName: string) {
    return async function (
      req: HttpRequestWithSignableEntity<T, Team, User>,
      _context: any
    ) {
      const { fileSize } = req.body;

      const documentType = tableName.slice(0, -1);
      const documentId = req.pathParameters[`${documentType}Id`];

      if (isNaN(fileSize) || fileSize > 1024 * 1024) {
        return {
          statusCode: 413,
          json: {},
        };
      }

      const s3 = new S3Client({
        credentials: {
          accessKeyId: STORAGE_ACCESS_KEY,
          secretAccessKey: STORAGE_SECRET_KEY,
        },
        region: "us-west-2",
      });

      const presignedPost = await createPresignedPost(s3, {
        Bucket: STORAGE_BUCKET,
        Key: `${tableName}/${documentId}.jpg`,
        Conditions: [["content-length-range", 0, fileSize + 100000]],
      });

      (req as HttpRequestWithPresignedPost<T, Team, User>).presignedPost =
        presignedPost;

      return;
    } as HttpHandler;
  };
}
