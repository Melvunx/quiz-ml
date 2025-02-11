import fetchApi from "@/api/fetch";
import {
  Answer,
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
  const ANSWERS_ENDPOINT = `${BASE_URL}/answers`;

  const searchedQuestions = useCallback(
    async (search: string) => {
      const response = await fetchApi<Question[]>(
        `${BASE_URL}?search=${search}`,
        {
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        }
      );
      const questions = QuestionsSchema.parse(response);

      return questions;
    },
    [accessToken, navigate, setAccessToken]
  );

  const questionsWithAnswers = useCallback(async () => {
    try {
      const response = await fetchApi<Question[]>(ANSWERS_ENDPOINT);

      const questions = QuestionsSchema.parse(response);

      return questions;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [ANSWERS_ENDPOINT]);

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

  const addAnswers = useCallback(
    async (questionsId: string, answers: Answer[]) => {
      try {
        const newAnswers = await fetchApi<Answer[]>(
          `${BASE_URL}/${questionsId}/answers`,
          {
            payload: { answers },
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        return newAnswers;
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
          method: "PUT",
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

  const updateAnswers = useCallback(
    async (answers: Answer[]) => {
      try {
        const updatedAnswers = await fetchApi<Answer[]>(ANSWERS_ENDPOINT, {
          payload: { answers },
          method: "PUT",
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        return updatedAnswers;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, accessToken, setAccessToken, ANSWERS_ENDPOINT]
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

  const removeAnswer = useCallback(
    async (answerId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL}/answer/${answerId}`,
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

  const removeMultipleAnswers = useCallback(
    async (answerIds: string[]) => {
      try {
        const successMessage = await fetchApi<string>(ANSWERS_ENDPOINT, {
          payload: { answerIds },
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
    [ANSWERS_ENDPOINT, accessToken, navigate, setAccessToken]
  );

  return {
    searchedQuestions,
    questionsWithAnswers,
    questionWithAnswers,
    createQuestion,
    addAnswers,
    updateQuestion,
    updateAnswers,
    deleteQuestion,
    removeAnswer,
    deleteMultipleQuestions,
    removeMultipleAnswers,
  };
}
