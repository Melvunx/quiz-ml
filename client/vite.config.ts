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
      "@components": path.resolve(__dirname, "./src/components"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@layout": path.resolve(__dirname, "./src/components/layout"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@schema": path.resolve(__dirname, "../server/src/schema"),
      "@prisma": path.resolve(__dirname, "../server/prisma"),
    },
  },
});
