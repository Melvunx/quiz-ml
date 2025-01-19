import { prisma } from "@config/prisma";
import { Quiz } from "@prisma/client";
import {
  HandleResponseError,
  HandleResponseSuccess,
} from "@services/handleResponse";
import { RequestHandler } from "express";

export const getAllQuiz: RequestHandler = async (req, res) => {
  try {
    const quizs = await prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(quizs));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const getSearchedQuiz: RequestHandler<
  {},
  {},
  {},
  { search: string }
> = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Query parameter is required")));
      return;
    }

    const quizs = await prisma.quiz.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(quizs));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const getQuiz: RequestHandler<{ quizId: string }> = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const quiz = await prisma.quiz.findUniqueOrThrow({
      where: {
        id: quizId,
      },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
        questions: {
          include: {
            _count: {
              select: {
                answers: true,
              },
            },
            answers: true,
          },
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(quiz));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const createQuiz: RequestHandler<{}, {}, Quiz> = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const EditQuiz: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const deleteQuiz: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
