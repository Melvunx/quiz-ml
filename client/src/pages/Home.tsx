import ShowupCode from "@/components/ShowupCode";
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
      <div className="grid grid-cols-3">
        <div className="">
          <h1>Bienvenue sur Quiz Créator !</h1>
        </div>
        <div className="">
          <p>
            Cette petite plaforme conçu pour un pc, vous permet de tester et
            créer des quiz afin des les enregistrer en format JSON.
          </p>
        </div>
        <div className="">
          
        </div>
      </div>
      <div className="flex"></div>
      <div className="flex"></div>
      <div className="flex">
        <ShowupCode />
      </div>
    </div>
  );
}
