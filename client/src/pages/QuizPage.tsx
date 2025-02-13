import Quiz from "@/components/Quiz";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

export default function QuizPage() {
  const { allQuizzes } = useQuiz();

  const {
    data: quizzes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => await allQuizzes(),
  });

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  return (
    <div>
      <h1>Quiz Page</h1>
      {quizzes
        ? quizzes.map((quiz) => (
            <Quiz key={quiz.id} quiz={quiz} withQuestion={false} />
          ))
        : "Aucun quiz n'a été trouvé"}
    </div>
  );
}
