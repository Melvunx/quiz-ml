import fetchApi from "@/api/fetch";
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

  const url = "/auth";

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetchApi<User>(`${url}/check-auth`, {
        navigate,
        requiresToken: true,
        accessToken,
        setAccessToken,
      });
      const user = UserSchema.parse(response);

      setUser(user);
      setIsAuthenticated(true);
      if (process.env.NODE_ENV === "development")
        console.log("Check successfull");
    } catch (error) {
      setIsAuthenticated(false);
      if (process.env.NODE_ENV === "development") console.error(error);
    }
  }, [setUser, setIsAuthenticated, navigate, accessToken, setAccessToken]);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const r = await fetchApi<User>(`${url}/register`, {
          payload: { username, email, password },
        });
        const user = UserSchema.parse(r);
        setUser(user);
      } catch (error) {
        setUser(null);
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [setUser]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetchApi<User>(`${url}/login`, {
          payload: { email, password },
          navigate,
        });

        const user = UserSchema.parse(response);

        setUser(user);
        setIsAuthenticated(true);
        setAuthError(null);
        if (process.env.NODE_ENV === "development")
          console.log("Login successful");
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        if (process.env.NODE_ENV === "development") console.error(error);
      }
    },
    [navigate, setUser, setIsAuthenticated, setAuthError]
  );

  const logout = useCallback(async () => {
    try {
      await fetchApi<string>(`${url}/logout`, {
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
  };
}
