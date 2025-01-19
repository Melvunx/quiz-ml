import { prisma } from "@config/prisma";
import { Question, Quiz } from "@prisma/client";
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
    const { title, description } = req.body;

    if (!title) {
      res
        .status(400)
        .json(
          HandleResponseError(new Error("Title and description are required"))
        );
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description ?? null,
      },
    });

    res.status(201).json(HandleResponseSuccess(quiz));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const addQuestions: RequestHandler<
  { quizId: string },
  {},
  { questions: Question[] }
> = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    if (!quizId) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Quiz ID is required")));
      return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Questions are required")));
      return;
    }

    const questionIds = questions.map((q) => q.id);

    const addingQuestions = await prisma.question.updateMany({
      where: {
        id: { in: questionIds },
      },
      data: {
        quizId,
      },
    });

    res
      .status(200)
      .json(HandleResponseSuccess({ addedQuestion: addingQuestions.count }));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const removeQuestions: RequestHandler<
  { quizId: string },
  {},
  { questions: Question[] }
> = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;

    if (!quizId) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Quiz ID is required")));
      return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Questions are required")));
      return;
    }

    const questionIds = questions.map((q) => q.id);

    const removingQuestions = await prisma.question.updateMany({
      where: {
        id: { in: questionIds },
      },
      data: {
        quizId: null,
      },
    });

    res
      .status(200)
      .json(
        HandleResponseSuccess({ removedQuestions: removingQuestions.count })
      );
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const editQuiz: RequestHandler<{ quizId: string }, {}, Quiz> = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;
    const { title, description } = req.body;

    if (!quizId) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Quiz ID is required")));
      return;
    }

    if (!title || !description) {
      res
        .status(400)
        .json(
          HandleResponseError(new Error("Title and description are required"))
        );
      return;
    }

    const quiz = await prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json(HandleResponseSuccess(quiz));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const deleteQuiz: RequestHandler<{ quizId: string }> = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Quiz ID is required")));
      return;
    }

    const quiz = await prisma.quiz.delete({ where: { id: quizId } });

    res.status(200).json(HandleResponseSuccess(quiz));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
