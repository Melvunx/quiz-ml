import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/config/jsonwebtoken";
import { prisma } from "@/config/prisma";
import { handleError } from "@/utils/handleResponse";

import { Role, Session, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

const { USER_ADMIN, SALT_ROUNDS, EXPIREDATE } = process.env;

export const regesterNewAccount: RequestHandler<{}, {}, User> = async (
  req,
  res
) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) return handleError(res, "NOT_FOUND")

    let role: Role;

    if (username === USER_ADMIN) {
      role = "ADMIN";
    }
    role = "USER";

    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json(HandleResponseSuccess(user, "New account created !"));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const login: RequestHandler<{}, {}, User> = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Please fill the credentials")));
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json(HandleResponseError("User not found"));
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(400).json(HandleResponseError(new Error("Bad credentials")));
      return;
    }

    console.log("Checking token...");

    let session = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    const now = new Date();

    const refreshToken = generateRefreshToken(user.id);

    if (session && new Date(session.expireDate) < now) {
      console.log("Token expire, deleting session...");

      await prisma.session.delete({ where: { id: session.id } });
      console.log("Session deleted");

      session = null;
    }

    if (!session) {
      console.log("Token not found");

      session = await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expireDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      });

      console.log("New token created");
    }

    console.log("Update lastlogin");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastlogin: new Date(),
      },
    });

    res.cookie("refreshJwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.cookie(
      "info",
      { id: user.id, username: user.username, email, role: user.role },
      {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
      }
    );

    const accessToken = generateAccessToken(user.id);

    LoggedResponseSuccess(user, `user ${user.username} log in !`);

    res.status(200).json(HandleResponseSuccess({ accessToken }));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshJwt;

    if (!token) {
      res.status(403).json(HandleResponseError(new Error("Forbidden")));
      return;
    }

    const decoded = await verifyRefreshToken<{ userId: string }>(token);

    if (!decoded) {
      res.status(403).json(HandleResponseError(new Error("Invalid token")));
      return;
    }

    const newAccessToken = generateAccessToken(decoded.userId);

    res
      .status(200)
      .json(HandleResponseSuccess({ accessToken: newAccessToken }));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const session: Session = req.cookies["refreshJwt"];
    const user: User = req.cookies["info"];
    if (!session || !user) {
      res.status(401).json(HandleResponseError(new Error("Unauthorized")));
      return;
    }

    await prisma.session.delete({
      where: {
        id: session.id,
        userId: user.id,
      },
    });

    res.clearCookie("refreshJwt");
    res.clearCookie("info");

    res
      .status(200)
      .json(HandleResponseSuccess(null, `User ${user.username} loggout`));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
