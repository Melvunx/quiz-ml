import useQuiz from "@/hooks/use-quiz";
import { apiErrorHandler } from "@/lib/utils";
import ErrorPage from "@/pages/ErrorPage";
import {
  CreateAnswer,
  CreateQuestionSchema,
  QuestionType,
} from "@/schema/quiz";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ErrorInputMessage from "../ui/error-input-message";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import LoadingString from "../ui/loading-string";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function QuestionForm() {
  const { createQuestion, addAnswers } = useQuiz();
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<CreateAnswer[]>([]);
  const [typeState, setTypeState] = useState<QuestionType>("SINGLE");

  const {
    mutate: createQuestionWithAnswersMutation,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationKey: ["create-question-answer"],
    mutationFn: async (credentials: {
      content: string;
      type: QuestionType;
      answers: CreateAnswer[];
    }) => {
      const { content, type, answers } = credentials;

      const question = await createQuestion(content, type);

      if (question && answers.length > 0)
        await addAnswers(question.id, answers);

      return question;
    },
  });

  function addAnswer() {
    setAnswers([...answers, { content: "", isCorrect: false }]);
  }

  function removeAnswer(answerIdx: number) {
    setAnswers(answers.filter((_, idx) => idx !== answerIdx));
  }

  function updateAnswer(
    answerIdx: number,
    field: keyof CreateAnswer,
    value: string | boolean
  ) {
    setAnswers(
      answers.map((answer, idx) =>
        idx === answerIdx ? { ...answer, [field]: value } : answer
      )
    );
  }

  const onCreateQuestionAction = async (data: FormData) => {
    const formData = {
      content: String(data.get("content")),
      type: String(data.get("type")) as QuestionType,
      answers,
    };

    try {
      setError(null);
      const validatedData = CreateQuestionSchema.parse(formData);
      await createQuestionWithAnswersMutation(validatedData);
      setAnswers([]);
    } catch (error) {
      const errorResponse = apiErrorHandler(error);
      setError(errorResponse.error as string);
    }
  };

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouveau quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action={onCreateQuestionAction} id="questionForm">
          <div className="space-y-1">
            <Label htmlFor="content">Contenu *</Label>
            <Input id="content" name="content" />
            {error && error.includes("contenu") && (
              <ErrorInputMessage error={error} />
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="desc">Type de Question</Label>
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
            <CardDescription>Optionnel</CardDescription>
            {error && error.includes("type") && (
              <ErrorInputMessage error={error} />
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <Label>Réponses</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAnswer}
              >
                <PlusIcon className="mr-2 size-4" />
                Ajouter une réponse
              </Button>
            </div>

            {answers.map((answer, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`answer-${idx}`}>Réponse {idx + 1}</Label>
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
                        setAnswers(
                          answers.map((answer, i) => ({
                            ...answer,
                            isCorrect: i === idx,
                          }))
                        );
                      }}
                    />
                  )}

                  <Label htmlFor={`isCorrect-${idx}`}>Correct</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAnswer(idx)}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="questionForm">
          {isCreating ? (
            <LoadingString word="Création en cours" />
          ) : (
            "Créer une question"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
