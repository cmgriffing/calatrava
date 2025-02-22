import {
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from "@architect/functions/http";
import { tables } from "@architect/functions";
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
  TypedHttpResponse,
} from "./types";
import { createDataWrapper, Datastore, DBKeys } from "@calatrava/datawrapper";
import { attachCommonHeaders as baseAttachCommonHeaders } from "./common";

export const getTables = async function (req: HttpRequest, _context: any) {
  const data = await tables();

  (req as unknown as HttpRequestWithTables).tables = {
    get<T extends {}>(tableName: string = "core") {
      const table = data[tableName] as unknown as Datastore;
      return createDataWrapper<T>(table, data["_doc"]);
    },
  };
} as HttpHandler;

// requires tables to be fetched first
export const createGetUser = function <User extends BaseUser>(
  getPartitionKey: (keyParts: Record<string, string>) => string,
  decodeToken: Function,
  extraValidation?: (user: User) => Promise<HttpResponse | void>,
  attachCommonHeaders = baseAttachCommonHeaders
) {
  return async function getUser(
    req: HttpRequestWithTables,
    _context: any
  ): Promise<TypedHttpResponse<User> | void> {
    try {
      if (!req.headers["authorization"]) {
        return attachCommonHeaders({
          statusCode: 401,
        });
      }

      const token = req.headers["authorization"].substring("Bearer ".length);
      const usersTable = req.tables.get<User>();

      const decodedToken = decodeToken(token);
      const userId = (decodedToken.sub as any).userId;
      const user = await usersTable.getById(getPartitionKey({ userId }));

      if (!user) {
        return attachCommonHeaders({
          statusCode: 401,
        });
      }

      if (extraValidation) {
        const extraValidationError = await extraValidation(user);
        if (extraValidationError) {
          return extraValidationError;
        }
      }

      (req as HttpRequestWithUser<User>).user = user;
    } catch (e) {
      console.log("Error decoding token and fetching user");
      console.log(e);

      return attachCommonHeaders({
        statusCode: 401,
      });
    }
  } as HttpHandler;
};

export const createGetUserTeams = function <
  User extends BaseUser,
  Team extends BaseTeam,
  Teammate extends BaseTeammate
>(
  getTeamKey: (keyParts: Record<string, string>) => string,
  getTeammateKey: (keyParts: Record<string, string>) => string,
  attachCommonHeaders = baseAttachCommonHeaders
) {
  return async function getUserTeams(
    req: HttpRequestWithUser<User>,
    _context: any
  ) {
    const teamsTable = req.tables.get<Team>();
    const teammatesTable = req.tables.get<Teammate>();

    try {
      const ownedTeamsPromise = teamsTable.getAllById(
        getTeamKey({ userId: req.user.userId }),
        {},
        DBKeys.sortKey
      );

      const joinedTeamsPromise = teammatesTable
        .getAllById(
          getTeammateKey({ userId: req.user.userId }),
          {},
          DBKeys.sortKey
        )
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
      });
    }
    // req.teams =
  } as HttpHandler;
};

export function isValidRequest(
  schema: any,
  attachCommonHeaders = baseAttachCommonHeaders
) {
  return async function (
    req: HttpRequestWithTables,
    _context: any
  ): Promise<TypedHttpResponse<unknown> | void> {
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

export const logDatabase = function (
  tableName: string,
  attachCommonHeaders = baseAttachCommonHeaders
) {
  return async function (
    _req: HttpRequestWithTables
  ): Promise<TypedHttpResponse<unknown> | undefined> {
    try {
      const data = await tables();
      const everything = await data?.[tableName]?.scan({});

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

export function createGetPresignedPost<
  Team extends BaseTeam,
  User extends BaseUser
>(
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
