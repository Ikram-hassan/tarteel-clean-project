import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,

  define: {
    "process.env": {},
  },

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: __dirname,
  publicDir: path.resolve(__dirname, "public"),

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    copyPublicDir: true,
  },

  server: {
    port,
    host: "0.0.0.0",
    // ✅ الـ proxy يعمل فقط في بيئة التطوير المحلي (vite dev server)
    // في Vercel، الطلبات تذهب مباشرة لـ VITE_API_URL عبر vercel.json rewrites
    proxy: {
      "/api": {
        target:
          process.env.VITE_API_URL ||
          "https://tarteel-monorepo-api-server-v6ry.vercel.app",
        changeOrigin: true,
        secure: true,
        // ✅ لا تحذف /api من المسار لأن الباك إيند يتوقعه
        rewrite: (p) => p,
      },
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
  },
});
