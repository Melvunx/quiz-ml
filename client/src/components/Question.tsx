import { Question as QuestionType } from "@/schema/quiz";
import Answer from "./Answer";

type QuestionProps = {
  question: QuestionType;
};

const Question: React.FC<QuestionProps> = ({ question }) => {
  return (
    <div>
      <h1>{question.content}</h1>
      {question.answers
        ? question.answers.map((answer) => (
            <Answer key={answer.id} answer={answer} />
          ))
        : "Pas d'option pour cette question"}
    </div>
  );
};

export default Question;
