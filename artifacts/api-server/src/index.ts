import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // 1. استيراد حزمة cors

// إعداد المسارات المطلقة للوصول للملفات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 تحميل المتغيرات البيئية
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import app from "./app.js";
import { logger } from "./lib/logger.js";

/**
 * 2. إعدادات الـ CORS
 * استخدام المتغير البيئي CORS_ORIGIN الذي قمت بإضافته في Vercel
 */
const corsOptions = {
  origin:
    process.env.CORS_ORIGIN || "https://tarteel-monorepo2-q3bp.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // تفعيل الـ CORS في التطبيق

/**
 * إعدادات المنفذ
 */
const rawPort = process.env["PORT"];
const port = Number(rawPort) || 3000;

/**
 * ✅ تشغيل السيرفر
 */
const server = app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening and environment initialized");

  console.log(`
  🚀 Tarteel E-Maqraa Server Started Successfully!
  🌍 Environment: Production/Cloud
  📡 Port: ${port}
  🌐 CORS Origin: ${corsOptions.origin}
  `);
});

server.on("error", (err: any) => {
  logger.error({ err }, "Error starting server");
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    logger.info("HTTP server closed cleanly.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
