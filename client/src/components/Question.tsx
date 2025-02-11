import useQuiz from "@/hooks/use-quiz";

export default function Question() {
  const { questionsWithAnswers } = useQuiz();

  return (
    <div>
      <h1>Question</h1>
    </div>
  );
}
