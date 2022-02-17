
export enum Tables {
  Users = "users",
{#hasTeams}
  Teams = "teams",
  Teammates = "teammates",
{/hasTeams}
}

export interface DatastoreRecord {
  createdAt: number;
  modifiedAt: number;
}

export interface User extends DatastoreRecord {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  verificationToken: string;
  verified: boolean;
}

{#hasTeams}
export interface Team extends DatastoreRecord {
  teamId: string;
  ownerId: string;
  name: string;
}

export interface Teammate extends DatastoreRecord {
  teamId: string;
  userId: string;
  accepted: boolean;
  inviteToken: string;
}
{/hasTeams}

export interface TableTypes {
  [Tables.Users]: User;
{#hasTeams}
  [Tables.Teams]: Team;
  [Tables.Teammates]: Teammate;
{/hasTeams}
}
