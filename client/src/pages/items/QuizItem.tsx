import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { toastParams } from "@/lib/utils";
import { Question, QuestionType } from "@/schema/quiz";
import userAuthStore from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage";

type QuestionCounterProps = {
  questions?: Question[];
  type: QuestionType;
};

const QuestionCounter = ({ questions, type }: QuestionCounterProps) => {
  const count = questions?.filter((q) => q.type === type).length;
  if (!count) return null;

  return (
    <span>
      {count} question{count !== 1 ? "s" : ""} {type.toLocaleLowerCase()}
    </span>
  );
};

const QuestionList = ({ questions }: { questions?: Question[] }) => {
  if (!questions?.length) return <p>Aucune question n'a été ajoutée</p>;

  return questions.map((question) => (
    <div key={question.id}>
      <h2>{question.content}</h2>
    </div>
  ));
};

export default function QuizItem() {
  const params = useParams();
  const { quizDetail } = useQuiz();
  const { quizId } = params;
  const { toast } = useToast();
  const { user } = userAuthStore();
  const navigate = useNavigate();

  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      if (!quizId) {
        toast(
          toastParams(
            "Quiz non trouvée ⚠️",
            `S'il vous plait, ${user?.username} réessayez encore.`
          )
        );
        setTimeout(() => navigate("/quiz-dashboard"), 2000);
        return null;
      }
      return await quizDetail(quizId);
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <LoadingString />;
  }

  if (isError || !quiz) {
    return <ErrorPage />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        {quiz.description !== "NULL" && <span>{quiz.description}</span>}

        <div className="flex gap-2">
          <QuestionCounter questions={quiz.questions} type="SINGLE" />
          {quiz.questions?.some((q) => q.type === "MULTIPLE") && " et "}
          <QuestionCounter questions={quiz.questions} type="MULTIPLE" />
        </div>

        <QuestionList questions={quiz.questions} />
      </div>
    </div>
  );
}
