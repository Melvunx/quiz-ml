import PaginationControls from "@/components/layout/PaginationControls";
import Results from "@/components/Results";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function QuizResults({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  const { allResults } = useQuiz();
  const [searchParams] = useSearchParams();
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

  if (!results) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const currentResults = results.slice(startIndex, endIndex);

  return (
    <div>
      {currentResults.length ? (
        <>
          {results.map((result) => (
            <Results key={result.id} result={result} />
          ))}
          {results.length >= itemsPerPage && (
            <PaginationControls
              totalItems={results.length}
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
