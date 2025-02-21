import colors from "@/schema/colors.schema";
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

    console.log(colors.info(`Searching questions with ${search} inside...`));

    const questions = await prisma.question.findMany({
      where: {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    console.log(colors.success("Questions found : ", questions.length));

    return apiResponse.success(res, "OK", questions);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getQuestionsWithAnswers: RequestHandler = async (req, res) => {
  try {
    console.log(colors.info("Getting questions with answers..."));

    const questionsWithAnswers = await prisma.question.findMany({
      include: {
        _count: {
          select: {
            answers: true,
          },
        },
        answers: true,
      },
    });

    console.log(
      colors.success(`Questions found : ${questionsWithAnswers.length} \n`)
    );

    questionsWithAnswers.map((question, index) =>
      console.log(
        colors.success(
          `Question n°${index + 1} \nAnswers found : ${
            question._count.answers
          } \n`
        )
      )
    );

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

    console.log(colors.info("Getting question with answers..."));

    const questionWithAnswers = await prisma.question.findUniqueOrThrow({
      where: { id: questionId },
      include: {
        _count: {
          select: {
            answers: true,
          },
        },
        answers: true,
      },
    });

    console.log(
      colors.success(
        `Question found with answers : ${questionWithAnswers._count.answers} answers found.`
      )
    );

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

    if (!content)
      return handleError(res, "NOT_FOUND", "Le contenu ne peut être vide !");

    if (!type) return handleError(res, "NOT_FOUND", "Sélectionnez un type !");

    console.log(colors.info("Creating new question..."));

    const question = await prisma.question.create({
      data: {
        content,
        type,
      },
    });

    console.log(colors.success("Question created successfully."));

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

    console.log({ content, type });

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!content || !type)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    console.log(colors.info("Editing question..."));

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        content,
        type,
      },
    });

    console.log(colors.success("Question edited successfully."));

    return apiResponse.success(res, "OK", question);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
export const deleteQuestion: RequestHandler = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Deleting question..."));

    const question = await prisma.question.delete({
      where: { id: questionId },
    });

    console.log(colors.info("Question deleted successfully."));

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

    console.log(colors.info("Deleting questions..."));

    const questions = await prisma.question.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    console.log(colors.info("Questions deleted successfully."));

    return apiResponse.success(res, "OK", questions);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
