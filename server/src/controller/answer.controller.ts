import { prisma } from "@/config/prisma";
import apiResponse from "@/services/api.response";
import { handleError } from "@/utils/handleResponse";
import isArrayOrIsEmpty from "@/utils/isArrayOrEmpty";

import { Answer } from "@prisma/client";
import { RequestHandler } from "express";

export const addAnswers: RequestHandler<{}, {}, { answers: Answer[] }> = async (
  req,
  res
) => {
  try {
    const { answers } = req.body;

    if (!isArrayOrIsEmpty(answers))
      return handleError(res, "NOT_FOUND", "Invalid or not found answers");

    const answer = await prisma.answer.createMany({
      data: answers,
      skipDuplicates: true,
    });

    return apiResponse.success(res, "CREATED", { answer_number: answer.count });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const editAnswers: RequestHandler<
  {},
  {},
  { answers: Answer[] }
> = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!isArrayOrIsEmpty(answers))
      return handleError(res, "NOT_FOUND", "Invalid or not found answer");

    const updatedAnswers = await Promise.all(
      answers.map(
        async (answer) =>
          await prisma.answer.update({
            where: { id: answer.id },
            data: answer,
          })
      )
    );

    return apiResponse.success(res, "OK", updatedAnswers);
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const removeAnswer: RequestHandler = async (req, res) => {
  try {
    const { answerId } = req.params;

    if (!answerId) return handleError(res, "NOT_FOUND", "Id not found");

    await prisma.answer.delete({ where: { id: answerId } });

    return apiResponse.success(res, "OK", null, "Answer deleted successfullt");
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

    const answers = await prisma.answer.deleteMany({
      where: { id: { in: ids } },
    });

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
