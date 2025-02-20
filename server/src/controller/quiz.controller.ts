import colors from "@/schema/colors.schema";
import apiResponse from "@/services/api.response";
import { handleError } from "@/utils/handleResponse";
import { prisma } from "@config/prisma";
import { Question, Quiz } from "@prisma/client";
import { RequestHandler } from "express";

export const getAllQuiz: RequestHandler = async (req, res) => {
  try {
    console.log(colors.info("Getting all quizzes..."));

    const quizs = await prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    console.log(colors.success("Quizzes retrieved successfully. \n"));

    quizs.map((quiz, index) =>
      console.log(
        colors.success(
          `Quiz n°${index + 1} \nQuestions found : ${quiz._count.questions} \n`
        )
      )
    );

    return apiResponse.success(res, "OK", quizs);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
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

    if (!search)
      return handleError(res, "NOT_FOUND", "Query element not found");

    console.log(colors.info(`Searching ${search} in quizzes...`));

    const quizzes = await prisma.quiz.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    console.log(colors.success("Quizzes found : ", quizzes.length));

    return apiResponse.success(res, "OK", quizzes);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getQuiz: RequestHandler = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Getting quiz..."));

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
            question: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });

    console.log(
      colors.success(`Quiz found with ${quiz._count.questions} questions`)
    );

    return apiResponse.success(res, "OK", quiz);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getExistQuestionToQuiz: RequestHandler = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log("Check if question exists in quiz...");

    const questions = await prisma.quizQuestion.findMany({
      where: {
        quizId,
      },
      include: {
        question: {
          include: {
            answers: true,
          },
        },
      },
    });

    console.log(`Questions found : ${questions.length}`);

    return apiResponse.success(res, "OK", questions);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const createQuiz: RequestHandler<{}, {}, Quiz> = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) return handleError(res, "NOT_FOUND", "Missing credentials");

    console.log(colors.info("Creating quiz..."));

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description ?? null,
      },
    });
    console.log(colors.success(`Quiz created successfully`));

    return apiResponse.success(res, "CREATED", quiz);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
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

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!Array.isArray(questions) || questions.length === 0)
      return handleError(res, "NOT_FOUND", "Invalid or not found ids");

    console.log("Verify existing question in the quiz...");

    const questionIds = questions.map((q) => q.id);

    const existingQuestion = await prisma.quizQuestion.findMany({
      where: {
        questionId: { in: questionIds },
        quizId: quizId,
      },
    });

    // Set pour améliorer les performances
    const existingIds = new Set(existingQuestion.map((q) => q.questionId));

    // Array de questions qui ne sont pas dans le quiz
    const filteredQuestions = questions.filter((q) => !existingIds.has(q.id));

    console.log(colors.info("Adding questions to quiz..."));

    const addingQuestions = await prisma.quizQuestion.createMany({
      data: [
        ...filteredQuestions.map((q) => ({
          questionId: q.id,
          quizId,
        })),
      ],
    });

    console.log(
      colors.success(
        `${addingQuestions.count} questions added to quiz successfully`
      )
    );

    return apiResponse.success(res, "OK", {
      addedQuestions: addingQuestions.count,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
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

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!Array.isArray(questions) || questions.length === 0)
      return handleError(res, "NOT_FOUND", "Invalid or not found ids");

    console.log(colors.info("Removing questions to quiz..."));

    const questionIds = questions.map((q) => q.id);

    const removingQuestions = await prisma.quizQuestion.deleteMany({
      where: {
        quizId,
        questionId: { in: questionIds },
      },
    });

    console.log(
      colors.success(
        `${removingQuestions.count} questions removed to quiz successfully`
      )
    );

    return apiResponse.success(res, "OK", {
      removedQuestions: removingQuestions.count,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const editQuiz: RequestHandler<{ quizId: string }, {}, Quiz> = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;
    const { title, description } = req.body;

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!title || !description)
      return handleError(res, "NOT_FOUND", "Missing credentials");

    console.log(colors.info("Editing quiz..."));

    const quiz = await prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        title,
        description,
      },
    });

    console.log(colors.success("Quiz updated successfully"));

    return apiResponse.success(res, "OK", quiz);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const deleteQuiz: RequestHandler<{ quizId: string }> = async (
  req,
  res
) => {
  try {
    const { quizId } = req.params;

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Deleting quiz..."));

    await prisma.quiz.delete({ where: { id: quizId } });

    console.log(colors.info("Quiz deleted successfully"));

    return apiResponse.success(res, "OK", null, "Quiz deleted successfully");
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
