import LoadingString from "@/components/ui/loading-string";
import useAuth from "@/hooks/use-auth";
import useAuthStore from "@/store/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthManager() {
  const { isAuthenticated } = useAuthStore();
  const { checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [checkAuth, isAuthenticated]);

  if (isLoading) return <LoadingString />;

  if (!isAuthenticated && location.pathname === "/")
    return <Navigate to="/quiz-dashboard" replace />;

  console.log("isAuthenticated", isAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
