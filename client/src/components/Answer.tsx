import { Answer as AnswerType } from "@/schema/quiz";

type AnswerProps = {
  answer: AnswerType;
};

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  return (
    <div className="container flex items-center justify-center">
      <h3>{answer.content}</h3>
    </div>
  );
};

export default Answer;
