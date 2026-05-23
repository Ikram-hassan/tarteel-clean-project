import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// إعداد المسارات المطلقة للوصول للملفات في بيئة الـ Monorepo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🔒 تأمين التحميل المبكر للمتغيرات البيئية
 */
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// 🚀 استيراد التطبيق
import app from "./app";
import { logger } from "./lib/logger";

/**
 * إعدادات المنفذ (Port)
 */
const rawPort = process.env["PORT"];
const port = Number(rawPort) || 3000;

/**
 * ✅ تشغيل السيرفر
 */
const server = app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening and environment initialized");

  // التحقق من صحة تحميل المتغيرات
  if (process.env["DATABASE_URL"]) {
    console.log("✅ Database URL securely loaded.");
  } else {
    console.error("❌ Critical Error: DATABASE_URL not found.");
  }

  // تم تعديل هذه الرسالة لتعكس الحالة الحقيقية (سيرفر يعمل على الإنترنت)
  console.log(`
  🚀 Tarteel E-Maqraa Server Started Successfully!
  🌍 Environment: Production/Cloud
  📡 Port: ${port}
  `);
});

/**
 * معالجة أخطاء المنفذ
 */
server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ فشل التشغيل: المنفذ ${port} محجوز.`);
  } else {
    logger.error({ err }, "Error starting server");
  }
  process.exit(1);
});

/**
 * الإغلاق الآمن
 */
const shutdown = (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    logger.info("HTTP server closed cleanly.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
