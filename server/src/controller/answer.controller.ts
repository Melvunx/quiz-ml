import { prisma } from "../config/prisma";
import colors from "../schema/colors.schema";
import apiResponse from "../services/api.response";
import { handleError } from "../utils/handleResponse";
import isArrayOrIsEmpty from "../utils/isArrayOrEmpty";

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

    const updateAnswers = answers.filter((a) => a.id);

    const updatedAnswers = await Promise.all(
      updateAnswers.map(async (answer) => {
        await prisma.answer.update({
          where: { id: answer.id, questionId: answer.questionId },
          data: answer,
        });
      })
    );

    const createdAnswers = answers.filter(
      (a) => a.id === undefined || a.id === null
    );

    const createNewAnswers = await prisma.answer.createMany({
      data: createdAnswers.map((a) => {
        return {
          content: a.content,
          isCorrect: a.isCorrect,
          questionId: updateAnswers[0].questionId,
        };
      }),
    });

    console.log(
      colors.success(
        `Answers edited : ${updatedAnswers.length} \n Created Answers : ${createNewAnswers.count}`
      )
    );

    return apiResponse.success(res, "OK", {
      updatedAnswers: updatedAnswers.length,
      createdAnswers: createNewAnswers.count,
    });
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};

export const removeAnswers: RequestHandler<
  {},
  {},
  { answers: Answer[] }
> = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!isArrayOrIsEmpty(answers))
      return handleError(res, "NOT_FOUND", "Invalid or not found ids");

    const answersIds = answers.filter((a) => a.id).map((a) => a.id);

    console.log(colors.info("Deleting answers..."));

    const deletedAnswers = await prisma.answer.deleteMany({
      where: { id: { in: answersIds } },
    });

    console.log(colors.success("Answers deleted : ", deletedAnswers.count));

    return apiResponse.success(
      res,
      "OK",
      null,
      `Deleted answers : ${deletedAnswers.count}`
    );
  } catch (error) {
    return apiResponse.error(res, "INTERNAL_SERVER_ERROR", error);
  }
};
