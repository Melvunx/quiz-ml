import apiResponse from "@/services/api.response";
import { handleError } from "@/utils/handleResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";
import { prisma } from "@config/prisma";
import { Question } from "@prisma/client";
import { RequestHandler } from "express";

export const searchQuestion: RequestHandler<
  {},
  {},
  {},
  { search: string }
> = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search)
      return handleError(res, "NOT_FOUND", "Query element not found");

    const questions = await prisma.question.findMany({
      where: {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    return apiResponse.success(res, "OK", questions);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getQuestionsWithAnswers: RequestHandler = async (req, res) => {
  try {
    const questionsWithAnswers = await prisma.question.findMany({
      include: {
        answers: true,
      },
    });

    return apiResponse.success(res, "OK", questionsWithAnswers);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getQuestionWithAnswers: RequestHandler<{
  questionId: string;
}> = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    const questionWithAnswers = await prisma.question.findUniqueOrThrow({
      where: { id: questionId },
      include: {
        answers: true,
      },
    });

    return apiResponse.success(res, "OK", questionWithAnswers);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const createNewQuestion: RequestHandler<{}, {}, Question> = async (
  req,
  res
) => {
  try {
    const { content, type } = req.body;

    if (!content || !type)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    const question = await prisma.question.create({
      data: {
        content,
        type,
      },
    });

    return apiResponse.success(res, "OK", question);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
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

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!content || !type)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        content,
        type,
      },
    });

    return apiResponse.success(res, "OK", question);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
export const deleteQuestion: RequestHandler = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    const question = await prisma.question.delete({
      where: { id: questionId },
    });

    return apiResponse.success(res, "OK", question);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const deleteManyQuestions: RequestHandler<
  {},
  {},
  { ids: string[] }
> = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!isArrayOrIsEmpty(ids))
      return handleError(res, "NOT_FOUND", "Invalid or not found ids");

    const questions = await prisma.question.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return apiResponse.success(res, "OK", questions);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
