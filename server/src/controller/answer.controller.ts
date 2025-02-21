import { prisma } from "@/config/prisma";
import colors from "@/schema/colors.schema";
import apiResponse from "@/services/api.response";
import { handleError } from "@/utils/handleResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";

import { Answer } from "@prisma/client";
import { RequestHandler } from "express";

export const addAnswers: RequestHandler<
  { questionId: string },
  {},
  { answers: Answer[] }
> = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answers } = req.body;

    if (!questionId) return handleError(res, "NOT_FOUND", "Id not found");

    if (!isArrayOrIsEmpty(answers))
      return handleError(res, "NOT_FOUND", "Invalid or not found answers");

    console.log(colors.info("Creating answers..."));

    const createdAnswers = await Promise.all(
      answers.map(
        async (answer) =>
          await prisma.answer.create({
            data: {
              content: answer.content,
              isCorrect: answer.isCorrect,
              questionId,
            },
          })
      )
    );

    console.log(
      colors.success(`Number of answers created : ${createdAnswers.length}`)
    );

    return apiResponse.success(res, "CREATED", {
      answer_number: createdAnswers.length,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const editAnswers: RequestHandler<
  {},
  {},
  { answers: Answer[] }
> = async (req, res) => {
  console.log("answers : ", req.body.answers);
  try {
    const { answers } = req.body;

    if (!isArrayOrIsEmpty(answers))
      return handleError(res, "NOT_FOUND", "Invalid or not found answer");

    console.log(colors.info("Editing answers..."));

    const updatedAnswers = await Promise.all(
      answers.map(
        async (answer) =>
          await prisma.answer.update({
            where: { id: answer.id, questionId: answer.questionId },
            data: answer,
          })
      )
    );

    console.log(colors.success("Answers created : ", updatedAnswers.length));

    return apiResponse.success(res, "OK", {
      answer_number: updatedAnswers.length,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const removeAnswer: RequestHandler = async (req, res) => {
  try {
    const { answerId } = req.params;

    if (!answerId) return handleError(res, "NOT_FOUND", "Id not found");

    console.log(colors.info("Deleting answer..."));

    await prisma.answer.delete({ where: { id: answerId } });

    console.log(colors.success("Answer deleted"));

    return apiResponse.success(res, "OK", null, "Answer deleted successfully");
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const removeAnswers: RequestHandler<{}, {}, { ids: string[] }> = async (
  req,
  res
) => {
  try {
    const { ids } = req.body;
    if (!isArrayOrIsEmpty(ids))
      return handleError(res, "NOT_FOUND", "Invalid or not found ids");

    console.log(colors.info("Deleting answers..."));

    const answers = await prisma.answer.deleteMany({
      where: { id: { in: ids } },
    });

    console.log(colors.success("Answers deleted : ", answers.count));

    return apiResponse.success(
      res,
      "OK",
      null,
      `Deleted answers : ${answers.count}`
    );
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
