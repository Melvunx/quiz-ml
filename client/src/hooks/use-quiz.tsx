import fetchApi from "@/api/fetch";
import {
  Answer,
  CreateAnswer,
  Question,
  QuestionSchema,
  QuestionsSchema,
  QuestionType,
  Quiz,
  QuizQuestion,
  QuizQuestionsSchema,
  QuizSchema,
  QuizzesSchema,
  Result,
  ResultSchema,
  ResultsSchema,
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
      try {
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
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUESTION, accessToken, navigate, setAccessToken]
  );

  const searchedQuiz = useCallback(
    async (search: string) => {
      try {
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
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
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
      throw error;
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
      throw error;
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
        throw error;
      }
    },
    [BASE_URL.QUESTION, accessToken, navigate, setAccessToken]
  );

  const allResults = useCallback(async () => {
    try {
      const response = await fetchApi<Result[]>(BASE_URL.RESULTS_ENDPOINT, {
        requiresToken: true,
        navigate,
        accessToken,
        setAccessToken,
      });

      const results = ResultsSchema.parse(response);

      return results;
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      throw error;
    }
  }, [BASE_URL.RESULTS_ENDPOINT, accessToken, navigate, setAccessToken]);

  const quizDetail = useCallback(
    async (quizId: string) => {
      try {
        const response = await fetchApi<Quiz>(
          `${BASE_URL.QUIZ}/quiz-detail/${quizId}`,
          {
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        const quiz = QuizSchema.parse(response);

        return quiz;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const resultDetail = useCallback(
    async (restultId: string) => {
      try {
        const response = await fetchApi<Result>(
          `${BASE_URL.RESULTS_ENDPOINT}/${restultId}`,
          {
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        const results = ResultSchema.parse(response);

        return results;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.RESULTS_ENDPOINT, accessToken, navigate, setAccessToken]
  );

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
        throw error;
      }
    },
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const createQuiz = useCallback(
    async (title: string, description: string) => {
      try {
        const response = await fetchApi<Result>(BASE_URL.QUIZ, {
          payload: { title, description },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        const quiz = QuizSchema.parse(response);

        return quiz;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const saveQuizResults = useCallback(
    async (score: number, quizId: string) => {
      try {
        const response = await fetchApi<Result>(BASE_URL.RESULTS_ENDPOINT, {
          payload: { score, quizId },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        console.log({ results: response });

        const results = ResultSchema.parse(response);

        return results;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.RESULTS_ENDPOINT, accessToken, navigate, setAccessToken]
  );

  const addAnswers = useCallback(
    async (questionsId: string, answers: CreateAnswer[]) => {
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
        throw error;
      }
    },
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const existingQuestionToQuiz = useCallback(
    async (quizId: string) => {
      try {
        const response = await fetchApi<QuizQuestion[]>(
          `${BASE_URL.QUIZ + BASE_URL.QUESTION}/${quizId}`,
          {
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        const questions = QuizQuestionsSchema.parse(response);

        return questions;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUESTION, BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const addQuestionsToQuiz = useCallback(
    async (quizId: string, questions: Question[]) => {
      try {
        const addedQuestions = await fetchApi<{
          addedQuestions: number;
          existingQuestion: Question[];
        }>(`${BASE_URL.QUIZ}/${quizId}${BASE_URL.QUESTION}/add`, {
          method: "PATCH",
          payload: { questions },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        return addedQuestions;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUESTION, BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const updateQuestion = useCallback(
    async (questionId: string, content: string, type: QuestionType) => {
      try {
        const response = await fetchApi<Question>(
          `${BASE_URL.QUESTION}/question/${questionId}`,
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
        throw error;
      }
    },
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const modifyQuiz = useCallback(
    async (quizId: string, title: string, description: string) => {
      try {
        const response = await fetchApi<Quiz>(`${BASE_URL.QUIZ}/${quizId}`, {
          method: "PUT",
          payload: { title, description },
          requiresToken: true,
          navigate,
          accessToken,
          setAccessToken,
        });

        const quiz = QuizSchema.parse(response);

        return quiz;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const updateAnswers = useCallback(
    async (answers: CreateAnswer[]) => {
      try {
        const updatedAnswers = await fetchApi<{
          updatedAnswers: number;
          createdAnswers: number;
        }>(BASE_URL.ANSWERS_ENDPOINT, {
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
        throw error;
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
        throw error;
      }
    },
    [BASE_URL.QUESTION, navigate, accessToken, setAccessToken]
  );

  const removeQuestionsToQuiz = useCallback(
    async (quizId: string, questions: Question[]) => {
      try {
        const removedQuestions = await fetchApi<{ removedQuestions: number }>(
          `${BASE_URL.QUIZ}/${quizId}${BASE_URL.QUESTION}/remove`,
          {
            method: "PATCH",
            payload: { questions },
            requiresToken: true,
            navigate,
            accessToken,
            setAccessToken,
          }
        );

        return removedQuestions;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.error(error);
        throw error;
      }
    },
    [BASE_URL.QUESTION, BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const deleteQuiz = useCallback(
    async (quizId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.QUIZ}/${quizId}`,
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
        throw error;
      }
    },
    [BASE_URL.QUIZ, accessToken, navigate, setAccessToken]
  );

  const deleteQuizResults = useCallback(
    async (resultId: string) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.RESULTS_ENDPOINT}/${resultId}`,
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
        throw error;
      }
    },
    [BASE_URL.RESULTS_ENDPOINT, accessToken, navigate, setAccessToken]
  );

  const removeAnswers = useCallback(
    async (answers: CreateAnswer[]) => {
      try {
        const successMessage = await fetchApi<string>(
          `${BASE_URL.ANSWERS_ENDPOINT}/many`,
          {
            payload: { answers },
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
        throw error;
      }
    },
    [BASE_URL.ANSWERS_ENDPOINT, navigate, accessToken, setAccessToken]
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
        throw error;
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
        throw error;
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
    existingQuestionToQuiz,
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
    removeAnswers,
    deleteMultipleQuestions,
    deleteQuiz,
    deleteQuizResults,
    removeMultipleAnswers,
  };
}
