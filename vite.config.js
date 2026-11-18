import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // amazon-cognito-identity-js expects a Node-style `global`.
  define: { global: "globalThis" },
  build: { sourcemap: false, chunkSizeWarningLimit: 700 },
});
