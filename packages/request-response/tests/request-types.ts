// DUPLICATED FROM types.ts
export enum VoteResult {
  Yes = "yes",
  No = "no",
  Favorite = "favorite",
  Veto = "veto",
}

export enum PollType {
  Home = "home",
  Out = "out",
}
// END DUPLICATES

export interface LoginRequest {
  /*
   * @format email
   */
  email: string;

  /*
   * @maxLength 32
   */
  password: string;
}

export interface RegisterRequest {
  /*
   * @maxLength 20
   */
  name: string;
  /*
   * @format email
   */
  email: string;

  /*
   * @minLength 32
   * @maxLength 32
   * @pattern ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$
   */
  password: string;
  verifyToken?: string;
}

export interface UpdateUserRequest {
  /*
   * @minLength 3
   * @maxLength 20
   */
  name?: string;
}

export interface UserVerificationRequest {
  verificationToken: string;
}

export interface PostPollRequest {
  teamId: string;
  /*
   * @minLength 3
   * @maxLength 20
   */
  name: string;
  pollType: PollType;
}

export type UpdatePollRequest = Omit<PostPollRequest, "teamId">;

export interface PostMealRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
  pollId?: string;
  unsplashImageData?: {
    thumbUrl: string;
    imageUrl: string;
    author: string;
    authorUrl: string;
  };
}

export type UpdateMealRequest = Omit<Partial<PostMealRequest>, "pollId">;

export interface PostRestaurantRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
  pollId?: string;
  yelpId?: string;
}

export type UpdateRestaurantRequest = Omit<
  Partial<PostRestaurantRequest>,
  "pollId"
>;

export interface PostTeamRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
}

export type UpdateTeamRequest = Partial<PostTeamRequest>;

export interface PostVoteRequest {
  voteResult: VoteResult;
}

export interface UploadImageRequest {
  fileSize: number;
}

export interface PostTeammateRequest {
  /*
   * @format email
   */
  email: string;
}

export interface PostTeammateAcceptRequest {
  inviteToken: string;
}

export interface ImageSearchRequest {
  searchQuery: string;
}

export interface RestaurantSearchRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  searchQuery: string;
  /*
   * minimum -180
   * maximum 180
   */
  latitude?: number;
  /*
   * minimum -180
   * maximum 180
   */
  longitude?: number;

  location?: string;
}

export interface GeolocationIpLookupRequest {
  /*
   * IPv4 only for now
   * @minLength 7
   * @maxLength 15
   */
  ipAddress: string;
}

export interface ReportUserRequest {
  // eventually make enum
  reason: string;
  detail?: string;
}

export interface ReportInviteRequest {
  // eventually make enum
  reportType: string;
  inviteToken: string;
  teamId: string;
  inviterUserId: string;
  reporterUserId: string;
}
