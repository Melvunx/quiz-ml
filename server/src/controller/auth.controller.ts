import { Role, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../config/jsonwebtoken";
import { prisma } from "../config/prisma";
import colors from "../schema/colors.schema";
import { UserCookie } from "../schema/user.schema";
import apiResponse from "../services/api.response";
import { handleError } from "../utils/handleResponse";

const { USER_ADMIN, SALT_ROUNDS, USER_ADMIN_BACKUP } = process.env;

if (!SALT_ROUNDS || !USER_ADMIN_BACKUP) {
  throw new Error("Id or salt rounds not found");
}

export const regester: RequestHandler<{}, {}, User> = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    let role: Role;

    if (username === USER_ADMIN || username === USER_ADMIN_BACKUP)
      role = "ADMIN";
    else role = "USER";

    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(colors.info("Creating user..."));

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    console.log(colors.info("User created successfully!"));

    return apiResponse.success(res, "OK", { id: user.id, email, username });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const login: RequestHandler<
  {},
  {},
  { email: string; password: string }
> = async (req, res) => {
  try {
    const { email, password } = req.body;
    const now = new Date();

    if (!email || !password)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return handleError(res, "BAD_REQUEST", "Invalid email");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return handleError(res, "BAD_REQUEST", "Invalid password");

    console.log(colors.info("Checking token..."));

    let session = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    const refreshToken = generateRefreshToken(user.id);

    if (session && new Date(session.expireDate) > now) {
      console.log(colors.info("Token expire, deleting session..."));

      await prisma.session.delete({ where: { id: session.id } });

      console.log(colors.info("Session deleted"));

      session = null;
    }

    if (!session) {
      console.log(colors.info("Token not found"));

      session = await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expireDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      console.log(colors.info("New token created"));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastlogin: new Date(),
      },
    });

    res.cookie(
      "info",
      {
        id: user.id,
        username: user.username,
        email,
        role: user.role,
      },
      {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      }
    );

    res.cookie("refreshJwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    if (process.env.NODE_ENV !== "production")
      console.log(colors.success(`User ${user.username} logged in`));

    return apiResponse.success(res, "OK", {
      id: user.id,
      username: user.username,
      email,
      role: user.role,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const token: string | undefined = req.cookies.refreshJwt;

    if (!token) return handleError(res, "UNAUTHORIZED", "Token not found");

    const decoded = await verifyRefreshToken<{ userId: string }>(token);

    if (!decoded) return handleError(res, "UNAUTHORIZED", "Invalid token");

    const newAccessToken = generateAccessToken(decoded.userId);

    return apiResponse.success(res, "CREATED", { accessToken: newAccessToken });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const auth: RequestHandler = async (req, res) => {
  try {
    const user: UserCookie | undefined = req.cookies.info;

    if (!user) return handleError(res, "UNAUTHORIZED", "User not found");

    return apiResponse.success(res, "OK", user, "User is authenticated");
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const adminAuth: RequestHandler = async (req, res) => {
  try {
    const user: UserCookie | undefined = req.cookies.info;
    if (!user) return handleError(res, "UNAUTHORIZED", "User not found");

    if (user.role !== "ADMIN")
      return handleError(res, "FORBIDDEN", "You don't have the rights");

    return apiResponse.success(
      res,
      "OK",
      user,
      "User admin is authentificated"
    );
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const token: string | undefined = req.cookies["refreshJwt"];
    const user: UserCookie | undefined = req.cookies["info"];

    if (!user || !token)
      return handleError(res, "UNAUTHORIZED", "Token or user not found");

    console.log(colors.info("Deconnecting user..."));

    const session = await prisma.session.findFirstOrThrow({
      where: {
        userId: user.id,
      },
    });

    await prisma.session.delete({
      where: {
        id: session.id,
        userId: user.id,
      },
    });

    res.clearCookie("refreshJwt");
    res.clearCookie("info");

    console.log(colors.success("User loggout success"));

    return apiResponse.success(res, "OK", null, "User loggout successfully");
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
