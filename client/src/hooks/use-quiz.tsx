import fetchApi from "@/api/fetch";
import { Question, QuestionSchema } from "@/schema/quiz";
import { useCallback } from "react";

export default function useQuiz() {
  const questionsWithAnswers = useCallback(async () => {
    try {
      const response = await fetchApi<Question[]>("/questions/answers");

      const questions = QuestionSchema.parse(response);

      return questions;
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    questionsWithAnswers,
  };
}
