import QuestionForm from "@/components/form/QuestionForm";
import QuizForm from "@/components/form/QuizForm";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-10 py-5">
        <QuizForm />
        <QuestionForm />
      </div>
      <Footer />
    </div>
  );
}
