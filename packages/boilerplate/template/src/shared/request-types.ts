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

👉#hasTeams👈
export interface PostTeamRequest {
  /*
   * @minLength 1
   * @maxLength 20
   */
  name: string;
}

export type UpdateTeamRequest = Partial<PostTeamRequest>;


export interface PostTeammateRequest {
  /*
   * @format email
   */
  email: string;
}

export interface PostTeammateAcceptRequest {
  inviteToken: string;
}

export interface ReportInviteRequest {
  // eventually make enum
  reportType: string;
  inviteToken: string;
  teamId: string;
  inviterUserId: string;
  reporterUserId: string;
}

👉/hasTeams👈
export interface ReportUserRequest {
  // eventually make enum
  reason: string;
  detail?: string;
}

👉#hasS3👈

export interface UploadImageRequest {
  fileSize: number;
}
👉/hasS3👈
