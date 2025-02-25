import colors from "@/schema/colors.schema";
import { UserCookie } from "@/schema/user.schema";
import apiResponse from "@/services/api.response";
import { handleError } from "@/utils/handleResponse";
import { verifyRefreshToken } from "@config/jsonwebtoken";
import { Role } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(colors.info("Authentification in progress ..."));

    const token: string | undefined = req.cookies.refreshJwt;
    const user: UserCookie | undefined = req.cookies.info;

    if (!user) return handleError(res, "UNAUTHORIZED", "User not found");

    if (!token) return handleError(res, "UNAUTHORIZED", "Token not found");

    const isVerified = await verifyRefreshToken(token);
    if (!isVerified)
      return apiResponse.error(res, "UNAUTHORIZED", "Invalid token");

    if (process.env.NODE_ENV !== "production")
      console.log(colors.success(`User ${user.username} is authenticated`));

    next();
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
}

function roleBasedAuth(allowedRoles: Role[]): RequestHandler {
  return (req, res, next) => {
    const user: UserCookie | undefined = req.cookies.info;

    if (!user) return handleError(res, "NOT_FOUND", "User not found");

    allowedRoles.map((role) =>
      console.log(colors.info(`${role.toLowerCase()} verification...`))
    );

    if (!allowedRoles.includes(user.role))
      return handleError(res, "FORBIDDEN", "You don't have the rights");

    if (process.env.NODE_ENV !== "production")
      console.log(
        colors.info(
          `User ${user.username} is authenticated as ${user.role.toLowerCase()}`
        )
      );

    next();
  };
}

export const amdinAuthenticate = roleBasedAuth([Role.ADMIN]);
