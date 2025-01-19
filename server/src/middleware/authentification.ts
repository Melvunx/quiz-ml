import { HandleResponseError } from "@/services/handleResponse";
import { verifyToken } from "@config/jsonwebtoken";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Authentification in progress ...");

    const token: string | undefined = req.cookies.jwt;
    const user: User | undefined = req.cookies.info;

    if (!user) {
      res.status(401).json(HandleResponseError(new Error("User not found")));
      return;
    } else if (!token) {
      res.status(401).json(HandleResponseError(new Error("Token not found")));
      return;
    }

    const verification = await verifyToken(token);
    if (!verification) {
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
