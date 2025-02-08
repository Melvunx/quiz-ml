import { HandleResponseError } from "@/utils/handleResponse";
import { verifyRefreshToken } from "@config/jsonwebtoken";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Authentification in progress ...");

    const token: string = req.cookies.refreshJwt;
    const user: User = req.cookies.info;

    if (!user) {
      res.status(401).json(HandleResponseError(new Error("User not found")));
      return;
    } else if (!token) {
      res.status(401).json(HandleResponseError(new Error("Token not found")));
      return;
    }

    const isVerified = await verifyRefreshToken(token);
    if (!isVerified) {
      res.status(401).json(HandleResponseError(new Error("Invalid token")));
      return;
    }

    console.log(`User ${user.username} is authentificated`);

    next();
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
}
