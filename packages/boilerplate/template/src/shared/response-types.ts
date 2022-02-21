// DUPLICATED FROM types.ts
export interface DatastoreRecord {
  createdAt: number;
  modifiedAt: number;
}
// END DUPLICATES

export interface ErrorResponse {
  message?: string;
}

export interface EmptyResponse {}

export interface PostUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    userId: string;
  };
}

{#hasTeams}
export interface PostTeamResponse extends DatastoreRecord {
  teamId: string;
  userId: string;
  name: string;
}

export interface GetTeamsResponse {
  ownedTeams: PostTeamResponse[];
  joinedTeams: PostTeamResponse[];
}

export interface PostTeammateResponse extends DatastoreRecord {
  userId: string;
  name: string;
  email: string;
  accepted: boolean;
}

{/hasTeams}
{#hasS3}
export interface GetImageResponse {
  presignedUrl: string;
}

export interface PresignedPostResponse {
  url: string;
  fields: {
    Policy: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    "X-Amz-Signature": string;
    bucket: string;
    key: string;
  };
}

{/hasS3}
