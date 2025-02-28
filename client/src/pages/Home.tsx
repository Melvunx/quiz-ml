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
    <div className="flex w-full flex-col gap-2 py-5">
      <div className="flex"></div>
      <div className="flex"></div>
      <div className="flex"></div>
      <div className="flex"></div>
    </div>
  );
}
