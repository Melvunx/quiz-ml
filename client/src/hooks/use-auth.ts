import fetchApi, { ApiError } from "@/api/fetch";
import { User, UserSchema } from "@/schema/user";
import userAuthStore from "@/store/auth";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const {
    setAuthError,
    setUser,
    setIsAuthenticated,
    clearAuth,
    accessToken,
    setAccessToken,
  } = userAuthStore();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetchApi<User>("/auth/check-auth", {
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });
      const user = UserSchema.parse(response);

      setUser(user);
      setIsAuthenticated(true);

      console.log("Check successfull");
    } catch (error) {
      console.error("Check auth failed : ", error);
      setIsAuthenticated(false);
    }
  }, [setUser, setIsAuthenticated, navigate, accessToken, setAccessToken]);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const r = await fetchApi<User>("/auth/register", {
          payload: { username, email, password },
        });
        const user = UserSchema.parse(r);
        setUser(user);
      } catch (error) {
        setUser(null);
        console.error("Check auth failed : ", error);
      }
    },
    [setUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetchApi<User>("/auth/login", {
          payload: { email, password },
          navigate,
        });

        const user = UserSchema.parse(response);

        setUser(user);
        setIsAuthenticated(true);
        setAuthError(null);

        console.log("Login successful");
      } catch (error) {
        if (error instanceof ApiError) {
          setAuthError(error.data.error as string);
        }

        console.error(error);
        setIsAuthenticated(false);
        setUser(null);
      }
    },
    [navigate, setUser, setIsAuthenticated, setAuthError]
  );

  const logout = useCallback(async () => {
    try {
      await fetchApi<string>("/auth/logout", {
        method: "POST",
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });

      clearAuth();

      console.log("Logout successful");
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, clearAuth, navigate, setAccessToken]);

  return {
    register,
    login,
    logout,
    checkAuth,
  };
}
