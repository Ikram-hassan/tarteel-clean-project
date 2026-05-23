// @ts-nocheck
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index";
import { logger } from "./lib/logger";

const app: Express = express();

// 🔹 Middlewares
// استخدام pino-http لتسجيل الطلبات بشكل احترافي
app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ method: req.method, url: req.url?.split("?")[0] }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);

// CORS configuration for production frontend
app.use(
  cors({
    origin: "https://tarteel-4.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 🔹 Root Route
 * نقطة فحص سريعة للتأكد من أن السيرفر يعمل
 */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Tarteel E-Maqraa API is running smoothly",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
});

/**
 * 🔥 API Routes
 * ربط جميع المسارات (Auth & Admin) القادمة من مجلد routes ببادئة /api
 */
app.use("/api", router);

/**
 * 🔥 404 Error Handler
 * معالجة الطلبات للمسارات غير المعرفة
 */
app.use((req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    suggestion:
      "Check if the route is defined in your routes directory and starts with /api",
  });
});

/**
 * 🔥 Global Error Handler
 * معالج الأخطاء الشامل: يقوم بالتقاط أخطاء الـ Admin Validation (مثل 403)
 * وأي أخطاء داخلية أخرى في النظام (500).
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);

  // استخراج كود الحالة (الافتراضي 500 إذا لم يتم تحديده)
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    error:
      statusCode === 500
        ? "Internal Server Error"
        : "Authorization/Validation Error",
    message: message,
    // إظهار تفاصيل الخطأ فقط في بيئة التطوير (اختياري)
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
