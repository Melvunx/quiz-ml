import EditOrDeleteDialog from "@/components/EditOrDeleteDialog";
import PaginationControls from "@/components/layout/PaginationControls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingString from "@/components/ui/loading-string";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { toastParams } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function QuizResults({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  const { allResults, deleteQuizResults } = useQuiz();
  const { isAdmin } = useAuthStore();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const clientQuery = useQueryClient();
  const { toast } = useToast();

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

  const { mutate: deleteQuizResultsMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: ["delete-results"],
      mutationFn: async (resultId: string) => await deleteQuizResults(resultId),
      onSuccess: () => {
        clientQuery.invalidateQueries({ queryKey: ["results"] });
        setTimeout(
          () =>
            toast(
              toastParams(
                "Résultat supprimé 😁",
                "Résultat supprimé avec succès ☑️"
              )
            ),
          300
        );
      },
      onError: (error) => {
        console.error("Erreur lors de la suppression du résultat : ", error);
        throw error;
      },
    });

  if (!quizResults) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const onlyQuizResults = quizResults.filter((quiz) => quiz.results.length);

  const currentResults = onlyQuizResults.slice(startIndex, endIndex);

  const totalItems = onlyQuizResults.length;

  const currentResultsNumber = currentResults.length;

  const scoreColor = (score: number, countQuestion: number) => {
    if (score === 0) return "text-red-500";

    const rate = Math.ceil((score / countQuestion) * 100);

    if (rate < 35) return "text-red-500";

    if (rate > 70) return "text-green-500";

    return "text-yellow-600";
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 py-4 font-regular-funnel-display">
      {currentResultsNumber ? (
        <>
          {currentResults.map((quiz) =>
            quiz.results.length ? (
              <Card key={quiz.id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  {quiz.description !== "NULL" && (
                    <CardDescription>{quiz.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ScrollArea className="h-72 w-3/5 rounded-lg border">
                    <div className="mx-4">
                      <h2 className="">Résultas</h2>
                      <Separator className="ml-0.5 w-1/3" />
                      {quiz.results.map((result, idx) => (
                        <div key={result.id}>
                          <div className="flex justify-between py-2">
                            <div className="flex items-center gap-3">
                              <p className="font-medium">Essais n°{idx + 1}</p>
                              {isAdmin ? (
                                <EditOrDeleteDialog
                                  name="RESULT"
                                  disabled={isDeleting}
                                  onClick={async () =>
                                    await deleteQuizResultsMutation(result.id)
                                  }
                                />
                              ) : null}
                            </div>
                            <p
                              className={`${scoreColor(
                                result.score,
                                quiz._count.questions
                              )}`}
                            >
                              Score : {result.score} / {quiz._count.questions}
                            </p>
                          </div>
                          {idx < quiz.results.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : null
          )}
          {onlyQuizResults.length > itemsPerPage && (
            <PaginationControls
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              className={`${
                currentResultsNumber <= 2
                  ? "absolute bottom-0 left-0"
                  : "w-full"
              }`}
            />
          )}
        </>
      ) : (
        <p className="text-center font-regular-funnel-display text-yellow-600">
          Aucun résultat de quiz n'a été trouvé
        </p>
      )}
    </div>
  );
}
