import { User } from "@/schema/user";
import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean | null;
  authError: string | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAuthError: (error: string | null) => void;
  clearAuth: () => void;
  clearError: () => void;
};

const userAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: null,
  authError: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAuthError: (error) => set({ authError: error }),
  clearAuth: () =>
    set({ accessToken: null, user: null, isAuthenticated: false }),
  clearError: () => set({ authError: null }),
}));

export default userAuthStore;
