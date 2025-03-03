import { Answer as AnswerType } from "@/schema/quiz";

const Answer = ({ answer }: { answer: AnswerType }) => {
  return (
    <div className="container flex items-center justify-center">
      <h3>{answer.content}</h3>
    </div>
  );
};

export default Answer;
