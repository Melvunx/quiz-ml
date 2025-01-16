import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@compenents": path.resolve(__dirname, "./src/components"),
      "@layout": path.resolve(__dirname, "./src/components/layout"),
      "@pages": path.resolve(__dirname, "./src/Pages"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@schema": path.resolve(__dirname, "../server/src/schema"),
    },
  },
});
