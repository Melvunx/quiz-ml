import { dateFormater } from "@/lib/utils";
import { Result } from "@/schema/quiz";
import EditOrDeleteDialog from "./EditOrDeleteDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

type ResultsProps = {
  result: Result;
};

const Results: React.FC<ResultsProps> = ({ result }) => {
  const { quiz } = result;

  if (!quiz || !quiz._count) return null;

  return (
    <Card className="h-72 max-w-2xl">
      <CardHeader>
        <div className="flex flex-col items-center gap-2 space-y-1">
          <div className="flex w-full items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            <EditOrDeleteDialog name="RESULT" />
            <CardDescription>
              Compléter le {dateFormater(new Date(result.completedAt))}
            </CardDescription>
          </div>
          <Separator className="ml-2 h-0.5 w-4/5" />
        </div>
      </CardHeader>
      <CardContent>
        <h1>
          Score de {result.score} sur {quiz._count.questions}
        </h1>
      </CardContent>
    </Card>
  );
};

export default Results;
