import { generateToken } from "@/config/jsonwebtoken";
import { prisma } from "@/config/prisma";
import {
  HandleResponseError,
  HandleResponseSuccess,
  LoggedResponseSuccess,
} from "@/services/handleResponse";
import { Role, User } from "@prisma/client";
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

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json(HandleResponseError("User not found"));
      return;
    }

    const isValidePassword = await bcrypt.compare(password, user.password);

    if (!isValidePassword) {
      res.status(400).json(HandleResponseError(new Error("Bad credentials")));
      return;
    }

    const token = generateToken(user.id);

    const session = await prisma.token.create({
      data: {
        token,
        userId: user.id,
      },
    });

    res.cookie("jwt", token, { httpOnly: true, maxAge: Number(EXPIREDATE) });

    res.cookie("connexion", user, {
      httpOnly: true,
      maxAge: Number(EXPIREDATE),
    });

    LoggedResponseSuccess({ user, session }, `user ${user.username} log in !`);

    res.status(200).json(HandleResponseSuccess(user));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
