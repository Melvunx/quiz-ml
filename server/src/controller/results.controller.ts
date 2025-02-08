import { prisma } from "@/config/prisma";
import {
  HandleResponseError,
  HandleResponseSuccess,
} from "@/utils/handleResponse";
import { Result, User } from "@prisma/client";
import { RequestHandler } from "express";

export const getAllQuizRestults: RequestHandler = async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      include: {
        quiz: true,
      },
    });

    res.status(200).json(HandleResponseSuccess(results));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const getQuizResults: RequestHandler<{ quizId: string }> = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const results = await prisma.result.findFirstOrThrow({
      where: {
        quizId,
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(results));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const saveQuizResults: RequestHandler<{}, {}, Result> = async (
  req,
  res
) => {
  try {
    const { score, quizId } = req.body;

    if (!score || !quizId) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Score and quizId are required")));
      return;
    }

    const user: User | null = req.cookies["info"];

    const result = await prisma.result.create({
      data: {
        score,
        quizId,
        userId: user ? user.id : null,
        completedAt: new Date(),
      },
    });

    res.status(201).json(HandleResponseSuccess(result));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const removeQuizResults: RequestHandler<{ resultId: string }> = async (
  req,
  res
) => {
  try {
    const { resultId } = req.params;

    if (!resultId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const result = await prisma.result.delete({
      where: {
        id: resultId,
      },
    });

    res.status(200).json(HandleResponseSuccess(result));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
