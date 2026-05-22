import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// إعداد المسارات المطلقة للوصول للملفات في بيئة الـ Monorepo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🔒 تأمين التحميل المبكر للمتغيرات البيئية:
 * يتم استدعاء dotenv هنا كطبقة حماية إضافية لضمان أن المتغيرات (مثل DATABASE_URL و JWT_SECRET)
 * متوفرة في الذاكرة قبل استيراد موديول 'app'.
 */

// 1. التحميل من مجلد السيرفر المحلي (إن وجد)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// 2. التحميل من جذر المشروع (حيث يوجد الملف الرئيسي .env في الـ Monorepo)
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

// 3. التحميل عند التشغيل من داخل مجلد التوزيع dist
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// 🚀 الآن استيراد باقي التطبيق بأمان بعد شحن المتغيرات
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
  
  // التحقق من صحة تحميل متغير قاعدة البيانات
  if (process.env["DATABASE_URL"]) {
    console.log("✅ Database URL securely loaded from .env file.");
  } else {
    console.error("❌ Critical Error: DATABASE_URL not found. Database connections will fail.");
  }

  // التحقق من وجود مفتاح التشفير الضروري لنظام الـ Admin Validation
  if (!process.env["JWT_SECRET"]) {
    logger.warn("⚠️ Warning: JWT_SECRET is missing. Admin authentication might fail.");
  }

  console.log(`
  🚀 Tarteel E-Maqraa Server Started Successfully!
  🔗 Base URL:      http://localhost:${port}
  📂 Auth Endpoint:  http://localhost:${port}/api/auth/login
  🛡️ Admin Dashboard: http://localhost:${port}/api/admin/dashboard
  `);
});

/**
 * معالجة أخطاء المنفذ (Port Errors)
 */
server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ فشل التشغيل: المنفذ ${port} محجوز حالياً من قبل تطبيق آخر.`);
  } else {
    logger.error({ err }, "Error starting server");
  }
  process.exit(1);
});

/**
 * الإغلاق الآمن (Graceful Shutdown)
 * يضمن إغلاق السيرفر ونظام الإدارة بشكل نظيف عند استلام إشارات الإنهاء
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

export default server;