import Navbar from "@/components/layout/Navbar";
import Question from "@/components/Question";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

export default function Questions() {
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
      <Navbar />
      {questions
        ? questions.map((question) => (
            <Question key={question.id} question={question} />
          ))
        : "Aucune question n'a été trouvée"}
    </div>
  );
}
