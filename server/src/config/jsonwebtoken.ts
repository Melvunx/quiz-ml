import colors from "@/schema/colors.schma";
import jwt from "jsonwebtoken";

const { SECRETKEY, EXPIREDATE } = process.env;

export function generareToken(username: string) {
  return jwt.sign({ username }, SECRETKEY || "MelvunxKey", {
    expiresIn: Number(EXPIREDATE) || 3600,
  });
}

export async function verifyToken(token: string) {
  try {
    const decoded = await jwt.verify(token, SECRETKEY || "MelvunxKey");
    return decoded;
  } catch (error) {
    console.log(colors.error(error));
    return null;
  }
}
