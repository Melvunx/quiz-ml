import Results from "@/components/Results";
import LoadingString from "@/components/ui/loading-string";
import useQuiz from "@/hooks/use-quiz";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";

export default function QuizResults() {
  const { allResults } = useQuiz();

  const {
    data: results,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results"],
    queryFn: async () => await allResults(),
  });

  console.log({ results });

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  return (
    <div>
      {results
        ? results.map((result) => <Results key={result.id} result={result} />)
        : "Aucun résultat de quiz trouvé"}
    </div>
  );
}
