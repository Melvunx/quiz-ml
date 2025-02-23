import EditOrDeleteDialog from "@/components/EditOrDeleteDialog";
import QuestionsToQuizForm from "@/components/form/QuestionsToQuizForm";
import PaginationControls from "@/components/layout/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingString from "@/components/ui/loading-string";
import { Separator } from "@/components/ui/separator";
import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { dateFormater, toastParams } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const QuizCount = ({ count }: { count?: number }) => {
  if (!count || count === 0) return <p>Ce quiz ne contient aucune question.</p>;

  return (
    <p>
      Ce quiz contient {count} question{count > 1 ? "s" : ""}.
    </p>
  );
};

export default function QuizPage({ itemsPerPage }: { itemsPerPage: number }) {
  const { allQuizzes, modifyQuiz, deleteQuiz } = useQuiz();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const currentPage = Number(searchParams.get("page")) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const {
    data: quizzes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => await allQuizzes(),
  });

  const { mutate: modifyQuizMutation, isPending: isUpdating } = useMutation({
    mutationKey: ["modify-quiz"],
    mutationFn: async (credentials: {
      quizId: string;
      title: string;
      description: string;
    }) => {
      const { quizId, title, description } = credentials;

      await modifyQuiz(quizId, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });

      setTimeout(() => {
        toast(
          toastParams(
            "Quiz modifié avec succès",
            `Quiz modifié le ${dateFormater(new Date(Date.now()))}`
          )
        );
      }, 1500);
    },
    onError: (error) => {
      throw error;
    },
  });

  const { mutate: deleteQuizMutation, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-quiz"],
    mutationFn: async (quizId: string) => await deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });

      setTimeout(() => {
        toast(
          toastParams(
            "Quiz supprimé avec succès",
            `Quiz supprimé le ${dateFormater(new Date(Date.now()))}`
          )
        );
      }, 1500);
    },
  });

  const onModifyQuizAction = async (quizId: string, data: FormData) => {
    const descrption = String(data.get("description"));
    const title = String(data.get("title"));

    const formData = {
      quizId,
      title,
      description: descrption ? descrption : "NULL",
    };

    try {
      await modifyQuizMutation(formData);
    } catch (error) {
      console.error("Erreur lors de la modification : ", error);
      throw error;
    }
  };

  if (!quizzes) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const currentQuizzes = quizzes.slice(startIndex, endIndex);

  return (
    <div className=" mx-auto w-full max-w-2xl">
      {currentQuizzes.length ? (
        <>
          {currentQuizzes.map((quiz, idx) => (
            <Card key={quiz.id} className="space-y-4">
              <CardHeader>
                <div className="flex items-center gap-2 space-y-1">
                  <CardTitle>{quiz.title}</CardTitle>
                  <EditOrDeleteDialog edit name="QUIZ" description="QUIZ">
                    <form
                      className="space-y-8"
                      action={async (data) =>
                        await onModifyQuizAction(quiz.id, data)
                      }
                    >
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Titre *</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder={quiz.title}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="desc">Description</Label>
                        <Input
                          id="desc"
                          name="description"
                          placeholder={`${
                            quiz.description !== "NULL"
                              ? quiz.description
                              : "Description"
                          }`}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            disabled={isUpdating}
                            type="submit"
                            variant="outline"
                          >
                            Modifier
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </form>
                  </EditOrDeleteDialog>
                  <EditOrDeleteDialog
                    name="QUIZ"
                    description="QUIZ"
                    disabled={isDeleting}
                    onClick={async () => await deleteQuizMutation(quiz.id)}
                  />
                </div>
                <Separator className="ml-2 h-0.5 w-4/5" />
                {quiz.description !== "NULL" && (
                  <CardDescription className="py-2">
                    {quiz.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-2 space-x-0">
                <QuizCount count={quiz._count?.questions} />
                <QuestionsToQuizForm key={idx} quizId={quiz.id} />
              </CardContent>
            </Card>
          ))}
          {quizzes.length >= itemsPerPage && (
            <PaginationControls totalItems={quizzes.length} />
          )}
        </>
      ) : (
        "Aucun quiz n'a été trouvé"
      )}
    </div>
  );
}
