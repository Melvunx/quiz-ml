import { generateToken } from "@/config/jsonwebtoken";
import { prisma } from "@/config/prisma";
import {
  HandleResponseError,
  HandleResponseSuccess,
  LoggedResponseSuccess,
} from "@/services/handleResponse";
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

    if (!email || !username || !password) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Please fill the credentials")));
      return;
    }

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

    if (!session) {
      console.log("Token not found");
      const token = generateToken(user.id);

      session = await prisma.session.create({
        data: {
          token,
          userId: user.id,
        },
      });

      console.log("New token created");
    }

    console.log("Token updating...");

    session = await prisma.session.update({
      where: { id: session.id },
      data: {
        token: generateToken(user.id),
      },
    });

    console.log("Update lastlogin");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastlogin: new Date(),
      },
    });

    res.cookie(
      "jwt",
      { id: session.id, token: session.token },
      {
        httpOnly: true,
        maxAge: Number(EXPIREDATE),
      }
    );

    res.cookie(
      "info",
      { id: user.id, username: user.username, email, role: user.role },
      {
        httpOnly: true,
        maxAge: Number(EXPIREDATE),
      }
    );

    LoggedResponseSuccess(user, `user ${user.username} log in !`);

    res.status(200).json(HandleResponseSuccess(user));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const session: Session | undefined = req.cookies["jwt"];
    const user: User | undefined = req.cookies["info"];
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

    res.clearCookie("jwt");
    res.clearCookie("info");

    res
      .status(200)
      .json(HandleResponseSuccess(null, `User ${user.username} loggout`));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
