import {
  Answer as AnswerType,
  Question as QuestionDetail,
  QuestionType,
} from "@/schema/quiz";
import Answer from "./Answer";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
    <ToggleGroup disabled type={type.toLowerCase() as "single" | "multiple"}>
      {answers.map((answer, idx) => (
        <ToggleGroupItem
          key={idx}
          value={answer.content}
          aria-label={`Toggle ${answer.content} ${idx + 1} of ${
            answers.length
          } options`}
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
  return (
    <Card className="mx-auto w-4/5">
      <CardHeader>
        <CardTitle>Question {question.type.toLocaleLowerCase()}</CardTitle>
      </CardHeader>
      <CardContent>{question.content}</CardContent>
      <CardFooter>
        <AnswersToggle answers={question.answers} type={question.type} />
      </CardFooter>
    </Card>
  );
};

export default Question;
