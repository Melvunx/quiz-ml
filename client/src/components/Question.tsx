import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { apiErrorHandler, dateFormater, toastParams } from "@/lib/utils";
import ErrorPage from "@/pages/ErrorPage";
import {
  Answer as AnswerType,
  CreateAnswer,
  Question as QuestionDetail,
  QuestionType,
} from "@/schema/quiz";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import Answer from "./Answer";
import EditOrDeleteDialog from "./EditOrDeleteDialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DialogClose, DialogFooter } from "./ui/dialog";
import ErrorInputMessage from "./ui/error-input-message";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LoadingString from "./ui/loading-string";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const AnswersToggle = ({
  answers,
  type,
}: {
  answers?: AnswerType[];
  type: QuestionType;
}) => {
  if (!answers?.length) return <p>Pas d'option pour cette question</p>;

  return (
    <ToggleGroup
      className="mx-auto flex w-4/5 justify-evenly gap-2"
      disabled
      type={type.toLowerCase() as "single" | "multiple"}
    >
      {answers.map((answer, idx) => (
        <ToggleGroupItem
          key={idx}
          value={answer.content}
          aria-label={`Toggle ${answer.content} ${idx + 1} of ${
            answers.length
          } options`}
          className={`bg-slate-200 font-semibold ${
            answer.isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          <Answer key={answer.id} answer={answer} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

type QuestionProps = {
  question: QuestionDetail;
};

const Question: React.FC<QuestionProps> = ({ question }) => {
  const { updateQuestion, updateAnswers, removeAnswers, deleteQuestion } =
    useQuiz();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [typeState, setTypeState] = useState<QuestionType>(question.type);
  const [answers, setAnswers] = useState<CreateAnswer[]>(
    question.answers || []
  );
  const [answerCount, setAnswerCount] = useState(
    question.answers ? question.answers.length : 0
  );
  const [removedAnswers, setRemovedAnswers] = useState<CreateAnswer[]>([]);

  const maxAnswers = 5;

  const queryClient = useQueryClient();

  const addAnswer = () => {
    if (answerCount >= maxAnswers) return;
    const newAnswers = [...answers, { content: "", isCorrect: false }];
    setAnswers(newAnswers);
    setAnswerCount(newAnswers.length);
  };

  const removeAnswer = (answerIdx: number) => {
    // Vérifier si on supprime la seule réponse correcte
    const isRemovingCorrect = answers[answerIdx].isCorrect;
    const hasOtherCorrect = answers.some(
      (a, idx) => a.isCorrect && idx !== answerIdx
    );

    const newAnswers = answers.filter((_, idx) => idx !== answerIdx);
    const deletedAnswersArray = answers[answerIdx];

    // Si en mode SINGLE et on supprime la seule réponse correcte, définir la première comme correcte
    if (
      isRemovingCorrect &&
      !hasOtherCorrect &&
      newAnswers.length > 0 &&
      typeState === "SINGLE"
    ) {
      newAnswers[0].isCorrect = true;
    }

    setAnswers(newAnswers);
    setRemovedAnswers((prev) => [...prev, deletedAnswersArray]);
    setAnswerCount(newAnswers.length);
  };

  const updateAnswer = (
    answerIdx: number,
    field: keyof CreateAnswer,
    value: string | boolean
  ) => {
    if (field === "isCorrect" && value === true && typeState === "SINGLE") {
      // En mode choix unique, désélectionner les autres réponses
      setAnswers(
        answers.map((answer, idx) => ({
          ...answer,
          isCorrect: idx === answerIdx,
        }))
      );
    } else {
      setAnswers(
        answers.map((answer, idx) =>
          idx === answerIdx ? { ...answer, [field]: value } : answer
        )
      );
    }
  };

  const {
    mutate: updateQuestionAndAnswersMutation,
    isPending: isUpdating,
    isError,
  } = useMutation({
    mutationKey: ["update-question-answers"],
    mutationFn: async (credentials: {
      questionId: string;
      content: string;
      type: QuestionType;
      answers: CreateAnswer[];
    }) => {
      const { questionId, content, type, answers } = credentials;

      try {
        await updateQuestion(questionId, content, type);

        if (removedAnswers.length > 0) {
          await removeAnswers(removedAnswers);
        }

        if (answers.length > 0) {
          await updateAnswers(answers);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour : ", error);
        throw error;
      }
    },
    onSuccess: () => {
      if (error === null) {
        queryClient.invalidateQueries({ queryKey: ["questions"] });

        toast(
          toastParams(
            "Question mise à jour !",
            `${dateFormater(new Date(Date.now()))}`
          )
        );
      }
    },
  });

  const { mutate: deleteQuestionMutation, isPending: isDeleting } = useMutation(
    {
      mutationKey: ["delete-question"],
      mutationFn: async (questionId: string) =>
        await deleteQuestion(questionId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["questions"] });

        setTimeout(() => {
          toast(
            toastParams(
              "Question supprimé avec succès",
              `Question supprimé le ${dateFormater(new Date(Date.now()))}`
            )
          );
        }, 1500);
      },
    }
  );

  const onUpdateQuestionAction = async (data: FormData) => {
    // vérifie qu'au moins une réponse est marquée comme correcte
    if (!answers.some((a) => a.isCorrect)) {
      setError("Au moins une réponse doit être marquée comme correcte");
      return;
    }

    // Vérifie que toutes les réponses ont un contenu
    if (answers.some((a) => !a.content.trim())) {
      setError("Toutes les réponses doivent avoir un contenu");
      return;
    }

    const formData = {
      questionId: question.id,
      content: String(data.get("content")),
      type: typeState,
      answers,
    };

    console.log("FormData : ", formData);

    try {
      setError(null);
      await updateQuestionAndAnswersMutation(formData);
    } catch (error) {
      const errorResponse = apiErrorHandler(error);
      setError(errorResponse.error);
    }
  };

  if (isError || !question || !question.answers) {
    return <ErrorPage />;
  }

  return (
    <Card className="mx-auto w-4/5">
      <CardHeader className="flex gap-2">
        <div className="flex items-center gap-2 space-y-1">
          <CardTitle>Question {question.type.toLocaleLowerCase()}</CardTitle>
          <EditOrDeleteDialog edit name="QUESTION" description="QUESTION">
            <form action={onUpdateQuestionAction}>
              <div className="space-y-1">
                <Label htmlFor="content">Contenu *</Label>
                <Input
                  defaultValue={question.content}
                  id="content"
                  name="content"
                />
                {error && error.includes("contenu") && (
                  <ErrorInputMessage error={error} />
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="desc">Type de Question *</Label>
                <Select
                  name="type"
                  onValueChange={(value: QuestionType) => setTypeState(value)}
                  value={typeState}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="SINGLE">Choix unique</SelectItem>
                      <SelectItem value="MULTIPLE">Choix multiple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {error && error.includes("type") && (
                  <ErrorInputMessage error={error} />
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAnswer}
                    disabled={answerCount >= maxAnswers}
                  >
                    <PlusIcon className="mr-2 size-4" />
                    Ajouter un choix
                  </Button>
                  {answerCount >= maxAnswers ? (
                    <span className="text-red-500">
                      Nombre de choix maximum atteint
                    </span>
                  ) : null}
                </div>
                <ScrollArea className="flex h-56 max-w-2xl rounded-md border p-3">
                  {answers.map((answer, idx) => (
                    <div key={idx} className="flex items-end gap-3">
                      <div className="flex-1 space-y-3">
                        <Label htmlFor={`answer-${idx}`}>
                          Réponse n°{idx + 1}
                        </Label>
                        <Input
                          value={answer.content}
                          onChange={(e) =>
                            updateAnswer(idx, "content", e.target.value)
                          }
                          placeholder="Contenu de la réponse"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        {typeState === "MULTIPLE" ? (
                          <Input
                            id={`isCorrect-${idx}`}
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              updateAnswer(idx, "isCorrect", e.target.checked)
                            }
                          />
                        ) : (
                          <Input
                            id={`isCorrect-${idx}`}
                            type="radio"
                            name="correctAnswer"
                            checked={answer.isCorrect}
                            onChange={() => {
                              updateAnswer(idx, "isCorrect", true);
                            }}
                          />
                        )}

                        <Label htmlFor={`isCorrect-${idx}`}>Correct</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeAnswer(idx);
                          }}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                {error &&
                  !error.includes("contenu") &&
                  !error.includes("type") && (
                    <ErrorInputMessage error={error} />
                  )}
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <div className="mx-auto flex w-4/5 justify-between">
                    <Button type="button" variant="secondary">
                      Fermer
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating || answers.length < 2}
                    >
                      {isUpdating ? (
                        <LoadingString word="Modification en cours" />
                      ) : (
                        "Modifier"
                      )}
                    </Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </form>
          </EditOrDeleteDialog>
          <EditOrDeleteDialog
            name="QUESTION"
            description="QUESTION"
            disabled={isDeleting}
            onClick={async () => await deleteQuestionMutation(question.id)}
          />
        </div>
        <Separator className="ml-2 h-0.5 w-4/5" />
      </CardHeader>
      <CardContent className="ml-6 leading-loose">
        {question.content}
      </CardContent>
      <CardFooter>
        <AnswersToggle answers={question.answers} type={question.type} />
      </CardFooter>
    </Card>
  );
};

export default Question;
