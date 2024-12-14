import { PresignedPost } from "@aws-sdk/s3-presigned-post";
import type { HttpRequest, HttpResponse } from "@architect/functions/http";
import { WrappedDatastore } from "@calatrava/datawrapper";

export interface TypedHttpResponse<T> extends HttpResponse {
  json?: T | undefined;
}

export interface BaseUser extends Object {
  userId: string;
}

export interface BaseTeam extends Object {
  teamId: string;
}

export interface BaseTeammate extends Object {
  teamId: string;
}

export interface HttpRequestWithTables extends HttpRequest {
  tables: {
    get: <T extends {}>(tableName?: string) => WrappedDatastore<T>;
  };
}

export interface HttpRequestWithUser<User extends BaseUser>
  extends HttpRequestWithTables {
  user: User;
}

export interface HttpRequestWithTeams<
  Team extends BaseTeam,
  User extends BaseUser
> extends HttpRequestWithUser<User> {
  ownedTeams: Team[];
  joinedTeams: Team[];
}

export interface HttpRequestWithSignableEntity<
  T,
  Team extends BaseTeam,
  User extends BaseUser
> extends HttpRequestWithTeams<Team, User> {
  entity: T;
}

export interface HttpRequestWithPresignedPost<
  T,
  Team extends BaseTeam,
  User extends BaseUser
> extends HttpRequestWithSignableEntity<T, Team, User> {
  presignedPost: PresignedPost;
}
