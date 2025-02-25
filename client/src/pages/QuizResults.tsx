import PaginationControls from "@/components/layout/PaginationControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingString from "@/components/ui/loading-string";
import { Separator } from "@/components/ui/separator";
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
    data: quizResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["results"],
    queryFn: async () => await allResults(),
  });

  if (!quizResults) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const currentResults = quizResults.slice(startIndex, endIndex);

  const totalItems = quizResults.length;

  return (
    <div>
      {currentResults.length ? (
        <>
          {currentResults.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                {quiz.description !== "NULL" && (
                  <CardDescription>{quiz.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Separator />
                {quiz.results.map((result, idx) => (
                  <div key={result.id}>
                    <h2>Essais n°{idx + 1}</h2>
                    <p>Score: {result.score}</p>
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
          {quizResults.length > itemsPerPage && (
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
