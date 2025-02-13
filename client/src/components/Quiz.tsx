import { Quiz as QuizType } from "@/schema/quiz";
import Question from "./Question";

type QuizProps = {
  quiz: QuizType;
  withQuestion: boolean;
};

const Quiz: React.FC<QuizProps> = ({ quiz, withQuestion }) => {
  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.description ? <p>{quiz.description}</p> : null}

      {withQuestion && quiz.questions
        ? quiz.questions.map((question) => (
            <Question key={question.id} question={question} />
          ))
        : null}
    </div>
  );
};

export default Quiz;
