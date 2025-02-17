import QuestionForm from "@/components/form/QuestionForm";
import QuizForm from "@/components/form/QuizForm";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 py-5">
      {/* Page expliquative */}
      <QuizForm />
      <QuestionForm />
    </div>
  );
}
