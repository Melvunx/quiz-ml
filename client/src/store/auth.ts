import { User } from "@/schema/user";
import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    }),
}));

export default useAuthStore;
