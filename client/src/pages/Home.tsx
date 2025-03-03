import ShowupCode from "@/components/ShowupCode";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { toastParams } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast(
        toastParams(
          "⚠️Mise en garde !⚠️",
          "Certaines fonctionnalitées ne sont pas activées car vous n'avez pas tous les droits."
        )
      );
    }
  }, [isAdmin, isAuthenticated, toast]);

  return (
    <div className="flex w-full flex-col gap-2 py-5 font-regular-funnel-display">
      <div className="mx-2 grid grid-cols-3 py-6">
        <div className="flex items-center justify-center">
          <h1 className="rounded border-2 bg-green-200 p-5 text-xl font-medium text-black">
            Bienvenue sur Quiz Creator !
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-center">
          <span>✨</span>
          <p className=" rounded-lg border-2 p-4 leading-8">
            Cette petite plaforme conçu pour pc, vous permet de tester et
            créer des quiz afin des les enregistrer en format JSON.
          </p>
          <span>✨</span>
        </div>
        <div className="flex justify-center">
          <img
            src="/img/explains-quiz-ml-end-quiz.png"
            alt="explain-quiz-exemple"
            className="mb-3 w-3/5 rotate-12 rounded-lg border"
          />
        </div>
      </div>
      <Separator />
      <div className="mx-2 grid grid-cols-2">
        <div className="mx-auto flex w-2/3 items-center justify-end">
          <p className="rounded-lg border-2 p-4 text-center leading-8">
            Ici, vous pouvez créer un quiz ainsi que des questions. <br />
            Avec les racourcis{" "}
            <span className="rounded-full border-2 bg-slate-100 px-1 py-0.5 text-sm font-medium italic text-black">
              ctrol + q
            </span>{" "}
            et{" "}
            <span className="rounded-full border-2 bg-slate-100 px-1 py-0.5 text-sm font-medium italic text-black">
              ctrol + m
            </span>{" "}
            , vous pouvez naviguer entre les questions et les quiz.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src="/img/explains-quiz-ml-create-quiz-question.png"
            alt=""
            className="w-1/2 rounded-lg border"
          />
        </div>
      </div>
      <Separator />
      <div className="ml-5 mr-1 grid grid-cols-3">
        <div className="flex justify-center">
          <img
            src="/img/explains-quiz-ml-quiz-ex.png"
            alt="explain-quiz"
            className="w-full rounded-lg border"
          />
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="mx-auto w-4/5 rounded-lg border-2 p-4 leading-8">
            Les pages{" "}
            <span className="rounded-full border-2 bg-slate-100 px-2 py-1 italic text-black">
              Quiz
            </span>{" "}
            et{" "}
            <span className="rounded-full border-2 bg-slate-100 px-2 py-1 italic text-black">
              Questions
            </span>{" "}
            vous montreront la liste des quiz et questions que vous avez créée.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/img/explains-quiz-questions.png"
            alt="explain-questions"
            className="w-4/5 rounded-lg border"
          />
        </div>
      </div>
      <Separator />
      <div className="mx-2 grid grid-cols-2">
        <div className="flex justify-center">
          <img
            src="/img/explains-quiz-ml-addquestions.png"
            alt="explains-addquestions"
            className="w-4/5 rounded-lg border"
          />
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="mx-auto w-3/5 rounded-lg border-2 p-4 leading-8">
            En sélectionnant votre question, vous pouvez l'ajouter ou la
            supprimer en fonction de si vous l'aviez déjà ajouté ou non.
          </p>
        </div>
      </div>
      <Separator />
      <div className="mx-2 grid grid-cols-2">
        <div className="flex items-center justify-center text-center">
          <p className="rounded-lg border-2 p-4 leading-8">
            Vous pouvez facilement modifier un quiz ou une question.
          </p>
        </div>
        <div className="flex">
          <video
            src="/vid/demonstration-modify-question.mp4"
            className="mx-auto w-4/5 rounded-lg border-2"
            autoPlay
            loop
            muted
          />
        </div>
      </div>
      <Separator />
      <div className="mx-2 grid grid-cols-2">
        <div className="flex">
          <video
            src="/vid/demonstration-quiz.mp4"
            className="mx-auto w-4/5 rounded-lg border-2"
            autoPlay
            loop
            muted
          />
        </div>
        <div className="flex items-center justify-center text-center">
          <p className="rounded-lg border-2 p-4">
            Testez vos quiz facilement pour les enregistrer ! 😊
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2">
        <div className="flex items-center justify-center text-center">
          <p className="mx-auto w-3/5 rounded-lg border-2 p-4 leading-8">
            À la fin du quiz, vous pouvez télécharger tous les éléments de votre
            quiz en format JSON pour vos besoins !
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <ShowupCode />
        </div>
      </div>
    </div>
  );
}
