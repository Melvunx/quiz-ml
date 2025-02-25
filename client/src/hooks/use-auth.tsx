import fetchApi from "@/api/fetch";
import { apiErrorHandler } from "@/lib/utils";
import { User, UserSchema } from "@/schema/user";
import userAuthStore from "@/store/auth";
import useErrorStore from "@/store/error";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const {
    setUser,
    setIsAuthenticated,
    setIsAdmin,
    clearAuth,
    accessToken,
    setAccessToken,
  } = userAuthStore();

  const { setError, clearError } = useErrorStore();

  const URL = "/auth";

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetchApi<User>(`${URL}/check-auth`, {
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });
      const user = UserSchema.parse(response);

      setUser(user);

      if (user.role === "ADMIN") setIsAdmin(true);
      else setIsAdmin(false);

      setIsAuthenticated(true);
      if (process.env.NODE_ENV === "development")
        console.log("Check successfull");
    } catch (error) {
      setIsAuthenticated(false);
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [
    navigate,
    accessToken,
    setAccessToken,
    setUser,
    setIsAdmin,
    setIsAuthenticated,
  ]);

  const checkAdminAuth = useCallback(async () => {
    try {
      const response = await fetchApi<User>(`${URL}/check-admin`, {
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });

      const user = UserSchema.parse(response);

      setUser(user);
      setIsAdmin(true);
      if (process.env.NODE_ENV === "development")
        console.log("Admin check successfull");
    } catch (error) {
      setIsAdmin(false);
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [accessToken, navigate, setAccessToken, setIsAdmin, setUser]);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const user = await fetchApi<User>(`${URL}/register`, {
          payload: { username, email, password },
        });
        clearError();
        setUser(user);
      } catch (error) {
        setUser(null);
        const errorResponse = apiErrorHandler(error);
        setError(errorResponse.error);
      }
    },
    [clearError, setError, setUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetchApi<User>(`${URL}/login`, {
          payload: { email, password },
          navigate,
        });

        const user = UserSchema.parse(response);

        setUser(user);
        setIsAuthenticated(true);
        clearError();
        if (process.env.NODE_ENV === "development")
          console.log("Login successful");
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        const errorResponse = apiErrorHandler(error);
        setError(errorResponse.error);
      }
    },
    [navigate, setUser, setIsAuthenticated, clearError, setError]
  );

  const logout = useCallback(async () => {
    try {
      await fetchApi<string>(`${URL}/logout`, {
        method: "POST",
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });

      clearAuth();
      if (process.env.NODE_ENV === "development")
        console.log("Logout successful");
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [accessToken, clearAuth, navigate, setAccessToken]);

  return {
    register,
    login,
    logout,
    checkAuth,
    checkAdminAuth,
  };
}
