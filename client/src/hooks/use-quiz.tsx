import fetchApi from "@/api/fetch";
import {
  Question,
  QuestionSchema,
  QuestionsSchema,
  QuestionType,
} from "@/schema/quiz";
import userAuthStore from "@/store/auth";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useQuiz() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = userAuthStore();

  const BASE_URL = "/questions";

  // -- Get Questions -- //
  const questionsWithAnswers = useCallback(async () => {
    try {
      const response = await fetchApi<Question[]>(`${BASE_URL}/answers`);

      const questions = QuestionsSchema.parse(response);

      return questions;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, []);

  // -- Get Questions by Id -- //
  const questionWithAnswers = useCallback(async (questionId: string) => {
    try {
      const response = await fetchApi<Question>(
        `${BASE_URL}/${questionId}/answers`
      );

      const question = QuestionSchema.parse(response);

      return question;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, []);

  const createQuestion = useCallback(
    async (content: string, type: QuestionType) => {
      try {
        const response = await fetchApi<Question>(BASE_URL, {
          payload: { content, type },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        const newQuestion = QuestionSchema.parse(response);

        return newQuestion;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, accessToken, setAccessToken]
  );

  const updateQuestion = useCallback(
    async (questionId: string, content: string, type: QuestionType) => {
      try {
        const response = await fetchApi<Question>(`${BASE_URL}/${questionId}`, {
          payload: { content, type },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        const updatedQuestion = QuestionSchema.parse(response);

        return updatedQuestion;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, accessToken, setAccessToken]
  );

  const deleteQuestion = useCallback(
    async (questionId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL}/${questionId}`,
          {
            method: "DELETE",
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        return successMessage;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, accessToken, setAccessToken]
  );

  const deleteMultipleQuestions = useCallback(
    async (questionIds: string[]) => {
      try {
        const successMessage = await fetchApi<string>(`${BASE_URL}/many`, {
          payload: { questionIds },
          method: "DELETE",
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        return successMessage;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, accessToken, setAccessToken]
  );

  return {
    questionsWithAnswers,
    questionWithAnswers,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteMultipleQuestions,
  };
}
