import { Answer as AnswerType } from "@/schema/quiz";

type AnswerProps = {
  answer: AnswerType;
};

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  return (
    <div className="flex items-center">
      <h3>{answer.content}</h3>
      <p>{answer.isCorrect === true ? "Réponse correcte" : "Réponse fausse"}</p>
    </div>
  );
};

export default Answer;
