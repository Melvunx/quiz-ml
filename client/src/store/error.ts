import { create } from "zustand";

type ErrorStore = {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
};

const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useErrorStore;
