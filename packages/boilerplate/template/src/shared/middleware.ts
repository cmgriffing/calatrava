
import { createGetTables, createGetUser, createGetUserTeams } from "@calatrava/middleware";
import { TableKeyManager, DBKeys } from "@calatrava/datawrapper";
import { Tables, User, Team, Teammate } from "./types";
import { decodeToken } from "./token";

const tableKeysMap = {
  [Tables.Users]: {
    [DBKeys.Partition]: ["userId"],
  },
};

const tableKeyManager = new TableKeyManager(tableKeysMap, Tables);

export const getTables = createGetTables(tableKeyManager);
export const getUser = createGetUser<User>(Tables.Users, decodeToken);
👉#hasTeams👈
export getUserTeams = createGetUserTeams<User, Team, Teammate>(Tables.Teams, Tables.Teammates);
👉/hasTeams👈
