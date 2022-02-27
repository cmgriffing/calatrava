
import { createGetTables, createGetUser, createGetUserTeams } from "@calatrava/middleware";
import { TableKeyManager } from "@calatrava/datawrapper";
import { Tables, User, Team, Teammate } from "./types";
import { decodeToken } from "./token";

const tableKeyManager = new TableKeyManager();

export const getTables = createGetTables(tableKeyManager);
export const getUser = createGetUser<User>(Tables.Users, decodeToken);
👉#hasTeams👈
export getUserTeams = createGetUserTeams<User, Team, Teammate>(Tables.Teams, Tables.Teammates);
👉/hasTeams👈
