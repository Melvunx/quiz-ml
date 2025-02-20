import useQuiz from "@/hooks/use-quiz";
import ErrorPage from "@/pages/ErrorPage";
import { Question } from "@/schema/quiz";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import LoadingString from "../ui/loading-string";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type CheckboxQuestionListProps = {
  questions?: Question[];
  name: string;
  onSelectionChange?: (selectedIds: string[]) => void;
};

const CheckboxQuestionList: React.FC<CheckboxQuestionListProps> = ({
  questions,
  name,
  onSelectionChange,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  if (!questions?.length)
    return (
      <p className="mt-6 text-center text-red-500">
        Aucune question n'a été trouvée
      </p>
    );

  const handleCheckboxChange = (questionId: string) => {
    const newSelection = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter((id) => id !== questionId)
      : [...selectedQuestions, questionId];

    setSelectedQuestions(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = questions.map((q) => q.id);
    setSelectedQuestions(allIds);
    onSelectionChange?.(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedQuestions([]);
    onSelectionChange?.([]);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4  flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          Tout sélectionner
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDeselectAll}
        >
          Tout désélectionner
        </Button>
      </div>
      {questions.map((question, idx) => (
        <div key={question.id}>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`${name}-${question.id}`}
              name={name}
              checked={selectedQuestions.includes(question.id)}
              onCheckedChange={() => handleCheckboxChange(question.id)}
            />
            <Label htmlFor={`${name}-${question.id}`}>{question.content}</Label>
          </div>
          {idx < questions.length - 1 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  );
};

type QuestionToQuizFormProps = {
  quizId: string;
};

const QuestionsToQuizForm: React.FC<QuestionToQuizFormProps> = ({ quizId }) => {
  const {
    questionsWithAnswers,
    addQuestionsToQuiz,
    removeQuestionsToQuiz,
    existingQuestionToQuiz,
  } = useQuiz();

  const queryClient = useQueryClient();

  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);

  const { data: questions, refetch: refetchQuestions } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => await questionsWithAnswers(),
  });

  const { data: existingQuestions, refetch: refetchExistingQuestions } =
    useQuery({
      queryKey: ["existingQuestionToQuiz", quizId],
      queryFn: async () => await existingQuestionToQuiz(quizId),
    });

  const existingIds = new Set(existingQuestions?.map((q) => q.id));

  const filteredQuestions = questions?.filter((q) => !existingIds.has(q.id));

  const resetSelections = () => {
    setSelectedToAdd([]);
    setSelectedToRemove([]);
  };

  const {
    mutate: addQuestionsToQuizMutation,
    isPending: isAdding,
    isError: isAddingError,
  } = useMutation({
    mutationKey: ["add-questions-to-quiz"],
    mutationFn: async (credentials: {
      quizId: string;
      questions: Question[];
    }) => {
      const { quizId, questions } = credentials;

      await addQuestionsToQuiz(quizId, questions);
    },
    onSuccess: () => {
      // Actualisation complète des données coté client
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({
        queryKey: ["existingQuestionToQuiz", quizId],
      });

      // Actualisations des données côté serveur
      refetchQuestions();
      refetchExistingQuestions();
      resetSelections();
    },
    onError: (error) => {
      console.error(error);
      throw error;
    },
  });

  const {
    mutate: removeQuestionsToQuizMutation,
    isPending: isRemoving,
    isError: isRemovingError,
  } = useMutation({
    mutationKey: ["remove-questions-to-quiz"],
    mutationFn: async (credentials: {
      quizId: string;
      questions: Question[];
    }) => {
      const { quizId, questions } = credentials;

      await removeQuestionsToQuiz(quizId, questions);
    },
    onSuccess: () => {
      // Actualisation complète des données coté client
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({
        queryKey: ["existingQuestionToQuiz", quizId],
      });

      // Actualisations des données côté serveur
      refetchQuestions();
      refetchExistingQuestions();
      resetSelections();
    },
    onError: (error) => {
      console.error(error);
      throw error;
    },
  });

  const handleAddOrRemoveQuestions = async (e: React.FormEvent) => {
    e.preventDefault();

    const questionsToAdd =
      filteredQuestions?.filter((q) => selectedToAdd.includes(q.id)) || [];

    const questionsToRemove =
      existingQuestions?.filter((q) => selectedToRemove.includes(q.id)) || [];

    // Tableau de promesses pour toutes les mutations
    const mutations: Promise<unknown>[] = [];

    if (questionsToAdd.length > 0) {
      mutations.push(
        new Promise((resolve, reject) => {
          addQuestionsToQuizMutation(
            {
              quizId,
              questions: questionsToAdd,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        })
      );
    }

    if (questionsToRemove.length > 0) {
      mutations.push(
        new Promise((resolve, reject) => {
          removeQuestionsToQuizMutation(
            {
              quizId,
              questions: questionsToRemove,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        })
      );
    }

    // Attendre la fin de toutes les mutations puis actualiser l'interface
    if (mutations.length > 0) {
      try {
        await Promise.all(mutations);
        // Force refresh après toutes les mutations
        await Promise.all([refetchQuestions(), refetchExistingQuestions()]);
      } catch (error) {
        console.error("Erreur lors des modifications:", error);
      }
    }
  };

  if (isAddingError || isRemovingError) return <ErrorPage />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter ou supprimer des questions</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gérer votre quiz</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => handleAddOrRemoveQuestions(e)}
          className="flex flex-col items-center justify-center gap-5"
        >
          <ScrollArea className="flex h-96 max-w-2xl rounded-md border">
            <div className="p-8">
              <h4 className="mb-2 text-sm font-medium leading-none">
                Question à ajouter
              </h4>
              <Separator />
              <CheckboxQuestionList
                questions={filteredQuestions}
                onSelectionChange={setSelectedToAdd}
                name="added-questions"
              />
            </div>
            <div className="p-8">
              <h4 className="mb-2 text-sm font-medium leading-none">
                Question à supprimer
              </h4>
              <Separator />
              <CheckboxQuestionList
                questions={existingQuestions}
                onSelectionChange={setSelectedToRemove}
                name="removed-questions"
              />
            </div>
          </ScrollArea>
          <DialogFooter className="w-full">
            <div className="mx-auto flex w-1/2 justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Fermer
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="outline"
                disabled={
                  isRemoving ||
                  isAdding ||
                  (selectedToAdd.length === 0 && selectedToRemove.length === 0)
                }
              >
                {isRemoving || isAdding ? (
                  <LoadingString word="Changement en cours" />
                ) : (
                  "Effectuer les modifications"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionsToQuizForm;
