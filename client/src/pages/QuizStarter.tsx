import Answer from "@/components/Answer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import LoadingString from "@/components/ui/loading-string";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useNavigationBlocker } from "@/hooks/use-navigationBlocker";
import useQuiz from "@/hooks/use-quiz";
import { dateFormater } from "@/lib/utils";
import { Quiz } from "@/schema/quiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import ErrorPage from "./ErrorPage";

type QuizSelectorProps = {
  quizzes?: Quiz[];
  onQuizChange: (selectedId: string) => void;
};

const QuizSelector: React.FC<QuizSelectorProps> = ({
  quizzes,
  onQuizChange,
}) => {
  const [selectedQuiz, setSelectedQuiz] = useState("");

  if (!quizzes?.length)
    return (
      <p className="mt-6 text-center text-red-500">Aucun quiz n'a été trouvé</p>
    );

  const handleRadioChange = (quizId: string) => {
    setSelectedQuiz(quizId);
  };

  const handleValidation = () => {
    if (selectedQuiz) {
      onQuizChange(selectedQuiz);
    }
  };

  return (
    <div className="flex min-h-screen items-center">
      <Card className="mx-auto flex w-1/2 flex-col space-y-1">
        <CardHeader>
          <CardTitle>Choisissez un quiz</CardTitle>
          <Separator className="h-0.5 w-4/5" />
          <CardDescription className="py-2">
            Choisissez ici votre quiz pour le tester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            className="space-y-3"
            value={selectedQuiz}
            onValueChange={handleRadioChange}
          >
            {quizzes.map((quiz, idx) => (
              <div key={idx} className="flex flex-col space-x-2 p-2">
                <div className="mx-2 flex items-center justify-between space-y-1">
                  <h3 className="text-lg font-semibold">Quiz n°{idx + 1}</h3>
                  <CardDescription>
                    Créer le {dateFormater(new Date(quiz.createdAt))}
                  </CardDescription>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-4">
                  <RadioGroupItem value={quiz.id} id={`quiz-${quiz.id}`} />
                  <Label htmlFor={`quiz-${quiz.id}`}>{quiz.title}</Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={handleValidation}
            disabled={!selectedQuiz}
            className="mt-4"
          >
            Valider la sélection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

function useCompleteNavigationGuard(shouldBlock: boolean) {
  // Pour la navigation interne
  useNavigationBlocker(shouldBlock);

  // Pour la navigation externe
  useEffect(() => {
    if (!shouldBlock) return;

    window.addEventListener("beforeunload", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("beforeunload", (e) => e.preventDefault());
    };
  }, [shouldBlock]);
}

type LoadedQuizProps = {
  quizId: string;
  onFinish: (score: number, answers: Record<string, string[]>) => void;
};

const LoadedQuiz: React.FC<LoadedQuizProps> = ({ quizId, onFinish }) => {
  const { quizDetail } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  const shouldBlockNavigation = useMemo(() => {
    return Object.keys(userAnswers) && !showResults;
  }, [userAnswers, showResults]);

  useCompleteNavigationGuard(shouldBlockNavigation);

  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => await quizDetail(quizId),
  });

  if (isError) return <ErrorPage />;

  if (!quiz) return <LoadingString word="Chargement du quiz" />;

  if (!quiz || !quiz.questions || quiz.questions.length === 0)
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="p-6">
          <p className="text-center">Sélectionnez un quiz pour commencer</p>
        </CardContent>
      </Card>
    );

  const questions = quiz.questions.map((q) => q.question);
  const currentQuestion = questions[currentQuestionIndex];

  const handleToggleChange = (questionId: string, values: string[]) => {
    const question = questions.find((q) => q.id === questionId);

    if (!question) return;

    const valueArray = typeof values === "string" ? [values] : values;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: valueArray,
    }));
  };

  const proceedToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz(userAnswers);
    }
  };

  const finishQuiz = (finalAnswers: Record<string, string[]>) => {
    let score = 0;
    let totalPossiblePoints = 0;

    questions.forEach((question) => {
      if (!question.answers) return;

      const userSelectedAnswers = finalAnswers[question.id] || [];
      const correctAnswers = question.answers.filter((a) => a.isCorrect);

      if (question.type === "SINGLE") {
        if (
          userSelectedAnswers.length === 1 &&
          correctAnswers.some((a) => a.id === userSelectedAnswers[0])
        )
          score += 1;

        totalPossiblePoints += 1;
      } else {
        const correctlySelected = userSelectedAnswers.filter((id) =>
          correctAnswers.some((a) => a.id === id)
        ).length;

        const incorrectlySelected = userSelectedAnswers.filter(
          (id) => !correctAnswers.some((a) => a.id === id)
        ).length;

        // Score partiel pour les questions à choix multiple
        if (correctlySelected > 0 && incorrectlySelected === 0)
          score += correctlySelected / correctAnswers.length;

        totalPossiblePoints += 1;
      }
    });

    console.log({ score, totalPossiblePoints });

    setShowResults(true);
    onFinish(score, finalAnswers);
  };

  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  // Si l'utilisateur à fini le quiz
  if (showResults) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Résultas du Quiz: {quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question, idx) => {
              if (!question.answers) return null;

              const userSelectedIds = userAnswers[question.id] || [];
              const correctAnswerIds = question.answers
                .filter((a) => a.isCorrect)
                .map((a) => a.id);

              const isQuestionCorrect =
                question.type === "SINGLE"
                  ? userSelectedIds.length === 1 &&
                    correctAnswerIds.includes(userSelectedIds[0])
                  : userSelectedIds.length === correctAnswerIds.length &&
                    userSelectedIds.every((id) =>
                      correctAnswerIds.includes(id)
                    );

              return (
                <div
                  key={question.id}
                  className={`rounded border p-4 ${
                    isQuestionCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p className="mb-2 font-medium">
                    {idx + 1}. {question.content}
                    {isQuestionCorrect ? (
                      <span className="ml-2 text-green-500">✓ Correcte</span>
                    ) : (
                      <span className="ml-2 text-red-500">✗ Incorrecte</span>
                    )}
                  </p>

                  <div className="ml-4 space-y-1">
                    {question.answers.map((answer) => {
                      const isSelected = userSelectedIds.includes(answer.id);
                      const { isCorrect } = answer;

                      let textColorClassName = "";
                      if (isSelected && isCorrect)
                        textColorClassName = "text-green-500";
                      else if (isSelected && !isCorrect)
                        textColorClassName = "text-red-500";
                      else if (!isSelected && isCorrect)
                        textColorClassName = "text-indigo-500";

                      return (
                        <p key={answer.id} className={`${textColorClassName}`}>
                          {isSelected ? "✔ " : "⚬ "}
                          {answer.content}
                          {isCorrect && "(Correcte)"}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si les réponses ne sont pas disponibles
  if (!currentQuestion.answers || currentQuestion.answers.length === 0) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardContent className="p-6">
          <p className="text-center">
            Cette question n'a pas de réponses disponibles.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedValues = userAnswers[currentQuestion.id] || [];

  if (isLoading) return <LoadingString word="Chargement du quiz" />;

  return (
    <Card className="mx-auto w-full max-w-2xl space-y-2">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <Progress value={calculateProgress()} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </h2>

          <p className="text-lg">{currentQuestion.content}</p>

          {/* Indication du type de question */}
          <p className="mt-2 text-sm text-gray-500">
            {currentQuestion.type === "SINGLE"
              ? "Choisissez une seule réponse"
              : "Sélectionnez toutes les réponses correctes"}
          </p>
        </div>

        {currentQuestion.type === "SINGLE" ? (
          <ToggleGroup
            type="single"
            value={userAnswers[currentQuestion.id]?.[0] || ""}
            onValueChange={(values) =>
              handleToggleChange(currentQuestion.id, [values])
            }
            className="space-y-2"
          >
            {currentQuestion.answers.map((answer) => (
              <ToggleGroupItem
                key={answer.id}
                value={answer.id}
                className="h-auto w-full justify-start rounded-md px-4 py-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {answer.content}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            type="multiple"
            value={selectedValues}
            onValueChange={(values) =>
              handleToggleChange(currentQuestion.id, values)
            }
            className="space-y-2"
          >
            {currentQuestion.answers.map((answer) => (
              <ToggleGroupItem
                key={answer.id}
                value={answer.id}
                className="h-auto w-full justify-start rounded-md px-4 py-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Answer answer={answer} />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          {currentQuestionIndex + 1} sur {questions.length} questions
        </p>

        <Button
          onClick={proceedToNext}
          disabled={
            !userAnswers[currentQuestion.id] ||
            userAnswers[currentQuestion.id].length === 0
          }
        >
          {currentQuestionIndex < questions.length - 1
            ? "Question suivante"
            : "Terminer le quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const QuizStarter = () => {
  const { allQuizzes, saveQuizResults } = useQuiz();
  const [quizIdToStart, setQuizIdToStart] = useState("");
  const [isQuizStart, setIsQuizStart] = useState(false);

  const { data: quizzes, isPending: isLoadingQuizzes } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => await allQuizzes(),
  });

  const { mutate: saveQuizResultsMutation } = useMutation({
    mutationKey: ["saveQuizResults"],
    mutationFn: async (credentials: { score: number; quizId: string }) => {
      const { score, quizId } = credentials;

      console.log(credentials);

      await saveQuizResults(score, quizId);
    },
  });

  if (!quizzes?.length) return null;

  const filteredQuizzes = quizzes.filter((quiz) => quiz.questions?.length);

  const hadleFinishQuiz = async (
    score: number,
    answers: Record<string, string[]>
  ) => {
    console.log("Quiz finished with score:", score);
    console.log("Answers:", answers);

    try {
      await saveQuizResultsMutation({
        score,
        quizId: quizIdToStart,
      });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      throw error;
    }
  };

  if (isLoadingQuizzes) {
    return <LoadingString />;
  }

  return (
    <div>
      {isQuizStart ? (
        quizIdToStart ? (
          <LoadedQuiz quizId={quizIdToStart} onFinish={hadleFinishQuiz} />
        ) : (
          <p>Aucun quiz trouvé</p>
        )
      ) : (
        <QuizSelector
          quizzes={filteredQuizzes}
          onQuizChange={(selectedId) => {
            setQuizIdToStart(selectedId);
            setIsQuizStart(true);
          }}
        />
      )}
    </div>
  );
};

export default QuizStarter;
