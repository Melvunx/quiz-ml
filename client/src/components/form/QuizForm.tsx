import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { apiErrorHandler, dateFormater, toastParams } from "@/lib/utils";
import ErrorPage from "@/pages/ErrorPage";
import { CreateQuizSchema } from "@/schema/quiz";
import { useMutation } from "@tanstack/react-query";
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

export default function QuizForm() {
  const { createQuiz } = useQuiz();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    mutate: createQuizMutation,
    isPending: isCreating,
    isError,
  } = useMutation({
    mutationKey: ["create-quiz"],
    mutationFn: async (credentials: { title: string; description: string }) => {
      const { title, description } = credentials;
      await createQuiz(title, description);
    },
    onSuccess: (_, varibles) => {
      if (error === null) {
        toast(
          toastParams(
            "Quiz created",
            `${varibles.title} ${dateFormater(new Date(Date.now()))}`
          )
        );
      }
    },
  });

  const onCreateQuizAction = async (data: FormData) => {
    const description = String(data.get("description"));
    const title = String(data.get("title"));

    const formData = {
      title,
      description: description === "" ? "NULL" : description,
    };

    try {
      setError(null);

      const validatedData = CreateQuizSchema.parse(formData);

      await createQuizMutation(validatedData);
    } catch (error) {
      const responseError = apiErrorHandler(error);
      setError(responseError.error);
    }
  };

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <Card className="mx-auto my-6 flex w-1/2 flex-col">
      <CardHeader>
        <CardTitle>Créer un nouveau quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <form action={onCreateQuizAction} id="quizForm">
          <div className="space-y-1">
            <Label htmlFor="title">Titre *</Label>
            <Input id="title" name="title" />
            {error ? <ErrorInputMessage error={error} /> : null}
          </div>
          <div className="space-y-1">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" name="description" />
            <CardDescription>Optionnel</CardDescription>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="quizForm">
          {isCreating ? (
            <LoadingString word="Création en cours" />
          ) : (
            "Créer un quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
