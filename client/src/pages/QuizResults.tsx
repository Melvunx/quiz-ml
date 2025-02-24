import PaginationControls from "@/components/layout/PaginationControls";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { Quiz } from "@/schema/quiz";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function QuizResults({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  const { allResults } = useQuiz();
  const [searchParams] = useSearchParams();
  const [quizAttempt, setQuizAttempt] = useState<Quiz[]>([]);
  const currentPage = Number(searchParams.get("page")) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results"],
    queryFn: async () => await allResults(),
  });

  useEffect(() => {
    if (!results) return;

    const uniqueQuizzes: Quiz[] = [];

    for (const result of results) {
      if (result.quiz && !uniqueQuizzes.some((q) => q.id === result.quizId)) {
        uniqueQuizzes.push(result.quiz);
      }
    }

    setQuizAttempt(uniqueQuizzes);
  }, [results]);

  if (!results || !results) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const currentQuizResults = quizAttempt.slice(startIndex, endIndex);

  const totalItems = quizAttempt.length;

  return (
    <div>
      {currentQuizResults.length ? (
        <>
          {currentQuizResults.map(
            (quiz, idx) =>  
            // <Results key={result.id} result={result} />
          )}
          {results.length > itemsPerPage && (
            <PaginationControls
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      ) : (
        <p className="text-center">Aucun résultat de quiz trouvé</p>
      )}
    </div>
  );
}
