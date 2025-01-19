import colors from "@/schema/colors.schma";
import jwt from "jsonwebtoken";

const { SECRETKEY, EXPIREDATE } = process.env;

export function generateToken(id: string) {
  return jwt.sign({ id }, SECRETKEY || "MelvunxKey", {
    expiresIn: Number(EXPIREDATE) || 3600,
  });
}

export async function verifyToken(token: string) {
  try {
    const decoded = await jwt.verify(token, SECRETKEY || "MelvunxKey");

    console.log(colors.info("Decoded value : ", decoded));

    return decoded;
  } catch (error) {
    console.log(colors.error(error));
    return null;
  }
}
