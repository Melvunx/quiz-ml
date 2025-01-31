import { prisma } from "@/config/prisma";
import { Answer } from "@prisma/client";
import {
  HandleResponseError,
  HandleResponseSuccess,
} from "@services/handleResponse";
import { RequestHandler } from "express";

export const addAnswers: RequestHandler<{}, {}, { answers: Answer[] }> = async (
  req,
  res
) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      res
        .status(400)
        .json(HandleResponseError(new Error("Answer is empty or invalid")));
      return;
    }

    const answer = await prisma.answer.createMany({
      data: answers,
      skipDuplicates: true,
    });

    res.status(201).json(HandleResponseSuccess(answer));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const editAnswers: RequestHandler<
  {},
  {},
  { answers: Answer[] }
> = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json(HandleResponseError(new Error("Answers required")));
      return;
    }

    const updatedAnswers = await Promise.all(
      answers.map(
        async (answer) =>
          await prisma.answer.update({
            where: { id: answer.id },
            data: answer,
          })
      )
    );

    res.status(200).json(HandleResponseSuccess(updatedAnswers));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};

export const removeAnswer: RequestHandler<{ answerId: string }> = async (
  req,
  res
) => {
  try {
    const { answerId } = req.params;

    if (!answerId) {
      res.status(400).json(HandleResponseError(new Error("Id is required")));
      return;
    }

    const answer = await prisma.answer.delete({ where: { id: answerId } });

    res.status(200).json(HandleResponseSuccess(answer));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
export const removeAnswers: RequestHandler<{}, {}, { ids: string[] }> = async (
  req,
  res
) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json(HandleResponseError(new Error("Ids required")));
      return;
    }

    const answers = await prisma.answer.deleteMany({
      where: { id: { in: ids } },
    });

    res
      .status(200)
      .json(HandleResponseSuccess(null, `Deleted answers ${answers.count}`));
  } catch (error) {
    res.status(500).json(HandleResponseError(error));
    return;
  }
};
