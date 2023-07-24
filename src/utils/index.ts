export * from "./password";
import * as jwt from "jsonwebtoken";

export function genToken(openID: string, unionID: string) {
  jwt.sign(
    {
      openID,
      unionID,
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
    }
  );
}

export const JWT_SECRET = "SakuraRealm_Wuhen"
