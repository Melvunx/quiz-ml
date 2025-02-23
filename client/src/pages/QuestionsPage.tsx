import PaginationControls from "@/components/layout/PaginationControls";
import Question from "@/components/Question";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function QuestionsPage({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  const { questionsWithAnswers } = useQuiz();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => await questionsWithAnswers(),
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  if (!questions) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <div className="mx-auto w-full max-w-3xl">
      {currentQuestions.length ? (
        <>
          <div className="flex flex-col gap-3 py-2">
            {currentQuestions.map((question) => (
              <Question key={question.id} question={question} />
            ))}
          </div>
          {questions.length >= itemsPerPage && (
            <PaginationControls totalItems={questions.length} />
          )}
        </>
      ) : (
        "Aucune question n'a été trouvée"
      )}
    </div>
  );
}
