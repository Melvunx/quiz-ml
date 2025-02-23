import { confirm } from "@/lib/utils";
import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export function useNavigationBlocker(shouldBlock: boolean) {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return shouldBlock && currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      const handleBlock = async () => {
        try {
          const confirmed = await confirm({
            title: "Quitter la page ?",
            confirmation: "Êtes-vous sûr de vouloir quitter ?",
          });

          if (confirmed) {
            blocker.proceed();
          } else {
            blocker.reset();
          }
        } catch {
          blocker.reset();
        }
      };

      handleBlock();
    }
  }, [blocker]);
  return blocker;
}
