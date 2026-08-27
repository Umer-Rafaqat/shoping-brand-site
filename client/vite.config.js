import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  build: {
    outDir: "build", // Yahan dist ki jagah build kar dein
  },

  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/assets": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
