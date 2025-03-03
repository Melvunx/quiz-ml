import { Result } from "@prisma/client";
import { RequestHandler } from "express";
import { prisma } from "../config/prisma";
import colors from "../schema/colors.schema";
import { UserCookie } from "../schema/user.schema";
import apiResponse from "../services/api.response";
import { handleError } from "../utils/handleResponse";

export const getAllQuizRestults: RequestHandler = async (req, res) => {
  try {
    console.log(colors.info("Getting all quizzes results..."));

    const quizResults = await prisma.quiz.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
        results: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(colors.success("Quizzes results found : ", quizResults.length));

    quizResults.map((q) => {
      q.results.map((r, index) =>
        console.log(
          colors.success(`\nQuiz n°${index + 1} \nResults : ${r.score} `)
        )
      );
    });

    return apiResponse.success(res, "OK", quizResults);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const getQuizResults: RequestHandler = async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Getting quiz results..."));

    const result = await prisma.result.findFirstOrThrow({
      where: {
        quizId,
      },
      include: {
        quiz: {
          include: {
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
        },
      },
    });

    console.log(
      colors.success(
        "Result found successfully with quiz : ",
        result.quiz.title
      )
    );

    return apiResponse.success(res, "OK", result);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const saveQuizResults: RequestHandler<{}, {}, Result> = async (
  req,
  res
) => {
  try {
    const { score, quizId } = req.body;
    const user: UserCookie | undefined = req.cookies["info"];

    if (score === undefined || !quizId)
      return handleError(res, "NOT_FOUND", "Score or quizId not found");

    console.log(colors.info("Saving result..."));

    const result = await prisma.result.create({
      data: {
        score,
        quizId,
        userId: user ? user.id : null,
        completedAt: new Date(),
      },
    });

    console.log(colors.success("Result saved successfully"));

    return apiResponse.success(res, "CREATED", result);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const removeQuizResults: RequestHandler<{ resultId: string }> = async (
  req,
  res
) => {
  try {
    const { resultId } = req.params;

    if (!resultId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Removing result..."));

    await prisma.result.delete({
      where: {
        id: resultId,
      },
    });

    console.log(colors.success("Result removed successfully"));

    return apiResponse.success(res, "OK", null, "Results removed successfully");
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
