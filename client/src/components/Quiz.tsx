import { Quiz as QuizType } from "@/schema/quiz";
import Question from "./Question";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type QuizProps = {
  quiz: QuizType;
  withQuestion?: boolean;
};

const Quiz: React.FC<QuizProps> = ({ quiz, withQuestion = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        {quiz.description !== "NULL" && (
          <CardDescription>{quiz.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {withQuestion &&
          quiz.questions &&
          quiz.questions.map((question) => (
            <Question key={question.id} question={question} />
          ))}
      </CardContent>
      <CardFooter>
        
      </CardFooter>
    </Card>
  );
};

export default Quiz;
