import { Answer as AnswerType } from "@/schema/quiz";

type AnswerProps = {
  answer: AnswerType;
};

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  return (
    <div className="container flex items-center">
      <div className="flex size-8 justify-center rounded-full bg-gray-400">
        <h3>{answer.content}</h3>
      </div>
      <p>{answer.isCorrect === true ? "Réponse correcte" : "Réponse fausse"}</p>
    </div>
  );
};

export default Answer;
