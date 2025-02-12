import fetchApi from "@/api/fetch";
import {
  Answer,
  Question,
  QuestionSchema,
  QuestionsSchema,
  QuestionType,
  Quiz,
  QuizzesSchema,
} from "@/schema/quiz";
import userAuthStore from "@/store/auth";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useQuiz() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = userAuthStore();

  const BASE_URL = {
    QUIZ: "/quiz",
    RESULTS_ENDPOINT: "/quiz/results",
    QUESTION: "/questions",
    ANSWERS_ENDPOINT: "/questions/answers",
  } as const;

  const searchedQuestions = useCallback(
    async (search: string) => {
      const response = await fetchApi<Question[]>(
        `${BASE_URL.QUESTION}?search=${search}`,
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
    [BASE_URL.QUESTION, accessToken, navigate, setAccessToken]
  );

  const searchedQuiz = useCallback(
    async (search: string) => {
      const response = await fetchApi<Question[]>(
        `${BASE_URL.QUIZ}?search=${search}`,
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
    [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const questionsWithAnswers = useCallback(async () => {
    try {
      const response = await fetchApi<Question[]>(BASE_URL.ANSWERS_ENDPOINT, {
        requiresToken: true,
        navigate,
        accessToken,
        setAccessToken,
      });

      const questions = QuestionsSchema.parse(response);

      return questions;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [BASE_URL.ANSWERS_ENDPOINT, accessToken, navigate, setAccessToken]);

  const allQuizzes = useCallback(async () => {
    try {
      const response = await fetchApi<Quiz[]>(`${BASE_URL.QUIZ}/all`, {
        requiresToken: true,
        navigate,
        accessToken,
        setAccessToken,
      });
      const quizzes = QuizzesSchema.parse(response);

      return quizzes;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]);

  const questionWithAnswers = useCallback(
    async (questionId: string) => {
      try {
        const response = await fetchApi<Question>(
          `${BASE_URL.QUESTION}/${questionId}/answers`,
          {
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        const question = QuestionSchema.parse(response);

        return question;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [BASE_URL.QUESTION, accessToken, navigate, setAccessToken]
  );

  const allResults = useCallback(async () => {
    try {
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, []);

  const quizDetail = useCallback(async () => {}, []);

  const resultDetail = useCallback(async () => {}, []);

  const createQuestion = useCallback(
    async (content: string, type: QuestionType) => {
      try {
        const response = await fetchApi<Question>(BASE_URL.QUESTION, {
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
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const createQuiz = useCallback(async () => {}, []);

  const saveQuizResults = useCallback(async () => {}, []);

  const addAnswers = useCallback(
    async (questionsId: string, answers: Answer[]) => {
      try {
        const newAnswers = await fetchApi<Answer[]>(
          `${BASE_URL.QUESTION}/${questionsId}/answers`,
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
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const addQuestionsToQuiz = useCallback(async () => {}, []);

  const updateQuestion = useCallback(
    async (questionId: string, content: string, type: QuestionType) => {
      try {
        const response = await fetchApi<Question>(
          `${BASE_URL.QUESTION}/${questionId}`,
          {
            payload: { content, type },
            method: "PUT",
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        const updatedQuestion = QuestionSchema.parse(response);

        return updatedQuestion;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const modifyQuiz = useCallback(async () => {}, []);

  const updateAnswers = useCallback(
    async (answers: Answer[]) => {
      try {
        const updatedAnswers = await fetchApi<Answer[]>(
          BASE_URL.ANSWERS_ENDPOINT,
          {
            payload: { answers },
            method: "PUT",
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        return updatedAnswers;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [BASE_URL.ANSWERS_ENDPOINT, navigate, accessToken, setAccessToken]
  );

  const deleteQuestion = useCallback(
    async (questionId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.QUESTION}/${questionId}`,
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
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const removeQuestionsToQuiz = useCallback(async () => {}, []);

  const deleteQuiz = useCallback(async () => {}, []);

  const deleteQuizResults = useCallback(async () => {}, []);

  const removeAnswer = useCallback(
    async (answerId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.QUESTION}/answer/${answerId}`,
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
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const deleteMultipleQuestions = useCallback(
    async (questionIds: string[]) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.QUESTION}/many`,
          {
            payload: { questionIds },
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
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const removeMultipleAnswers = useCallback(
    async (answerIds: string[]) => {
      try {
        const successMessage = await fetchApi<string>(
          BASE_URL.ANSWERS_ENDPOINT,
          {
            payload: { answerIds },
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
    [BASE_URL.ANSWERS_ENDPOINT, accessToken, navigate, setAccessToken]
  );

  return {
    searchedQuestions,
    searchedQuiz,
    questionsWithAnswers,
    allQuizzes,
    allResults,
    questionWithAnswers,
    quizDetail,
    resultDetail,
    createQuestion,
    createQuiz,
    saveQuizResults,
    addQuestionsToQuiz,
    addAnswers,
    updateQuestion,
    modifyQuiz,
    updateAnswers,
    deleteQuestion,
    removeQuestionsToQuiz,
    removeAnswer,
    deleteMultipleQuestions,
    deleteQuiz,
    deleteQuizResults,
    removeMultipleAnswers,
  };
}
