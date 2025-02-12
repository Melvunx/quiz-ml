import useQuiz from "@/hooks/use-quiz";
import ErrorPage from "@/pages/ErrorPage";
import { useQuery } from "@tanstack/react-query";
import LoadingString from "./ui/loading-string";

export default function Question() {
  const { questionsWithAnswers } = useQuiz();

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => await questionsWithAnswers(),
  });

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  return (
    <div>
      <h1>Questions</h1>
      {questions &&
        questions.map((question) => (
          <div key={question.id}>
            <h3>{question.content}</h3>
            {question.answers
              ? question.answers.map((answer) => (
                  <div key={answer.id}>
                    <h4>{answer.content}</h4>
                  </div>
                ))
              : "Aucune réponse n'a été trouvée"}
          </div>
        ))}
    </div>
  );
}
