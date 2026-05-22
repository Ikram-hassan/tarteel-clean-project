import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,

  // ✅ إضافة خاصية define لحل مشكلة ReferenceError: process is not defined جذرياً
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
    // 🚀 تم التعديل هنا ليصبح المخرجات في dist مباشرة ليتوافق مع Vercel
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    // 🚀 إيقاف الـ sourcemap لتخطي تحذيرات البناء وسرعة التجميع
    sourcemap: false,
    // ✅ Ensure public folder files (including _redirects) are copied to dist
    copyPublicDir: true,
  },

  server: {
    port,
    host: "0.0.0.0",
  },

  preview: {
    port,
    host: "0.0.0.0",
  },
});
