import QuizForm from "@/components/form/QuizForm";
import LoadingString from "@/components/ui/loading-string";
import useAuth from "@/hooks/use-auth";
import useAuthStore from "@/store/auth";
import { useEffect, useState } from "react";

export default function AddQuizPage() {
  const { checkAdminAuth } = useAuth();
  const { isAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const adminVerification = async () => {
      try {
        await checkAdminAuth();
      } catch (error) {
        console.error(error);
      } finally {
        if (!isMounted) {
          setIsLoading(false);
        }
      }
    };

    adminVerification();
    return () => {
      isMounted = false;
    };
  }, [checkAdminAuth]);

  if (isLoading) return <LoadingString />;

  if (isAdmin) {
    return (
      <div className="mx-auto min-h-screen w-1/2">
        <QuizForm />
      </div>
    );
  }
}
