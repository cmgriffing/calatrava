import { HttpRequest } from "@architect/functions";
import { WrappedDatastore } from "@calatrava/datawrapper";
import { PresignedPost } from "@aws-sdk/s3-presigned-post";

export interface BaseUser {
  userId: string;
}

export interface BaseTeam {
  teamId: string;
}

export interface BaseTeammate {
  teamId: string;
}

export interface HttpRequestWithTables extends HttpRequest {
  tables: { get: <T>(prop: string, tableName?: string) => WrappedDatastore<T> };
}

export interface HttpRequestWithUser<User> extends HttpRequestWithTables {
  user: User;
}

export interface HttpRequestWithTeams<Team, User>
  extends HttpRequestWithUser<User> {
  ownedTeams: Team[];
  joinedTeams: Team[];
}

export interface HttpRequestWithSignableEntity<T, Team, User>
  extends HttpRequestWithTeams<Team, User> {
  entity: T;
}

export interface HttpRequestWithPresignedPost<T, Team, User>
  extends HttpRequestWithSignableEntity<T, Team, User> {
  presignedPost: PresignedPost;
}
