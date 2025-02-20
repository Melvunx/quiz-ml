import QuestionsToQuizForm from "@/components/form/QuestionsToQuizForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

const QuizCount = ({ count }: { count?: number }) => {
  if (!count || count === 0) return <p>Ce quiz ne contient aucune question.</p>;

  return (
    <p>
      Ce quiz contient {count} question{count > 1 ? "s" : ""}.
    </p>
  );
};

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
    <div className="flex min-h-screen flex-col gap-4 ">
      {quizzes
        ? quizzes.map((quiz, idx) => (
            <Card key={quiz.id} className="space-y-4">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                {quiz.description !== "NULL" && (
                  <CardDescription>{quiz.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-2 space-x-0">
                <QuizCount count={quiz._count?.questions} />
                <QuestionsToQuizForm key={idx} quizId={quiz.id} />
              </CardContent>
            </Card>
          ))
        : "Aucun quiz n'a été trouvé"}
    </div>
  );
}
