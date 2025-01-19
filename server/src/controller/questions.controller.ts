import { prisma } from "@config/prisma";
import { Question } from "@prisma/client";
import {
  HandleResponseError,
  HandleResponseSuccess,
} from "@services/handleResponse";
import { RequestHandler } from "express";
export const searchQuestion: RequestHandler<
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

    const questions = await prisma.question.findMany({
      where: {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(questions));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const getQuestionsWithAnswers: RequestHandler = async (req, res) => {
  try {
    const questionsWithAnswers = await prisma.question.findMany({
      include: {
        answers: true,
      },
    });

    res.status(200).json(HandleResponseSuccess(questionsWithAnswers));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const getQuestionWithAnswers: RequestHandler<{
  questionId: string;
}> = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const questionWithAnswers = await prisma.question.findUniqueOrThrow({
      where: { id: questionId },
      include: {
        answers: true,
      },
    });

    res.status(200).json(HandleResponseSuccess(questionWithAnswers));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const createNewQuestion: RequestHandler<{}, {}, Question> = async (
  req,
  res
) => {
  try {
    const { content, type } = req.body;

    const question = await prisma.question.create({
      data: {
        content,
        type,
      },
    });

    res.status(201).json(HandleResponseSuccess(question));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const editQuestion: RequestHandler<
  { questionId: string },
  {},
  Question
> = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content, type } = req.body;

    if (!questionId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    } else if (!content || !type) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Content and type are required")));
      return;
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        content,
        type,
      },
    });

    res.status(200).json(HandleResponseSuccess(question));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
export const deleteQuestion: RequestHandler<{ questionId: string }> = async (
  req,
  res
) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const question = await prisma.question.delete({
      where: { id: questionId },
    });

    res.status(200).json(HandleResponseSuccess(question));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const deleteManyQuestions: RequestHandler<
  {},
  {},
  { ids: string[] }
> = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json(HandleResponseError(new Error("Ids are required")));
      return;
    }

    const questions = await prisma.question.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    res.status(200).json(HandleResponseSuccess(questions));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
