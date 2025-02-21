import Question from "@/components/Question";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

export default function QuestionsPage() {
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
    <div className="flex min-h-screen flex-col items-center justify-evenly gap-3 py-2">
      {questions?.length
        ? questions.map((question) => (
            <Question key={question.id} question={question} />
          ))
        : "Aucune question n'a été trouvée"}
    </div>
  );
}
