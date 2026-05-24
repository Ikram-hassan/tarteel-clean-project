import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// إعداد المسارات المطلقة للوصول للملفات
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔒 تحميل المتغيرات البيئية (ترتيب الأولوية: .env المحلي أولاً)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import app from "./app.js";
import { logger } from "./lib/logger.js";

/**
 * إعدادات المنفذ
 */
const rawPort = process.env["PORT"];
const port = Number(rawPort) || 3000;

/**
 * ✅ تشغيل السيرفر
 * ملاحظة: CORS يجب أن يُضبط في app.ts وليس هنا
 * لأن app.ts يُعالج الطلبات قبل أي middleware في index.ts
 */
const server = app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening and environment initialized");

  console.log(`
  🚀 Tarteel E-Maqraa Server Started Successfully!
  🌍 Environment: ${process.env.NODE_ENV || "development"}
  📡 Port: ${port}
  🌐 CORS Origin: ${process.env.CORS_ORIGIN || "not set"}
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
