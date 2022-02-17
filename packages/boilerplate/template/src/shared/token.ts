import * as jwt from "jsonwebtoken";
import { User } from "./types";
const TOKEN_SIGNING_KEY = "TOTALLY SECRET MAAAAAN";

export function decodeToken(token: string) {
  return jwt.verify(token, TOKEN_SIGNING_KEY);
}

function encodeToken(user: User, type: "access" | "refresh") {
  let expiresIn = "24h";
  if (type === "refresh") {
    expiresIn = "7d";
  }

  return jwt.sign(
    {
      sub: { userId: user?.userId },
      type,
    },
    TOKEN_SIGNING_KEY,
    { expiresIn }
  );
}

export function encodeAccessToken(user: any) {
  return encodeToken(user, "access");
}
export function encodeRefreshToken(user: any) {
  return encodeToken(user, "refresh");
}
