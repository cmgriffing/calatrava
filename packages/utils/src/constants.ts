import * as dotenv from "dotenv";
dotenv.config();

export function getEnvVariable(baseEnvVar: string): string {
  const { CIRCLE_BRANCH } = process.env;

  if (CIRCLE_BRANCH === "staging" || CIRCLE_BRANCH === "production") {
    return (
      process.env[`${CIRCLE_BRANCH?.toUpperCase() || ""}_${baseEnvVar}`] || ""
    );
  } else {
    return process.env[baseEnvVar] || "";
  }

  return "";
}
