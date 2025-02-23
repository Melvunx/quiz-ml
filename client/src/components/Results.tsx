import { dateFormater } from "@/lib/utils";
import { Result } from "@/schema/quiz";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import LoadingString from "./ui/loading-string";
import { Separator } from "./ui/separator";

type ResultsProps = {
  result: Result;
};

const Results: React.FC<ResultsProps> = ({ result }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { quiz } = result;

  if (!quiz) return null;

  return (
    <Card className="h-96 max-w-2xl">
      <CardHeader>
        <div className="flex flex-col items-center gap-2 space-y-1">
          <div className="flex w-full items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              Compléter le {dateFormater(new Date(result.completedAt))}
            </CardDescription>
          </div>
          <Separator className="ml-2 h-0.5 w-4/5" />
        </div>
      </CardHeader>
      <CardContent>
        <h1>Score de {result.score}</h1>
      </CardContent>
      <CardFooter className="flex w-4/5 items-center justify-evenly">
        <Link to="/quiz-results">Voir les résultats</Link>
        <Button
          disabled={isLoading}
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => window.location.reload(), 250);
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <LoadingString word="Chargement en cours" />
          ) : (
            <p>Recommencer un nouveau quiz</p>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Results;
