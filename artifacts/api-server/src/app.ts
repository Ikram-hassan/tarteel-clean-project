import express from "express";
import cors from "cors";

const app = express();

// ✅ CORS يجب أن يكون أول middleware قبل أي route
// هذا يضمن أن OPTIONS preflight requests تُعالج بشكل صحيح
const allowedOrigins = [
  // Frontend URLs على Vercel — أضف كل الـ URLs المحتملة
  "https://tarteel-monorepo2-q3bp.vercel.app",
  "https://tarteel-monorepo2-git-main-tarteel-s-projects4.vercel.app",
  // للتطوير المحلي
  "http://localhost:5173",
  "http://localhost:3000",
  // قراءة من environment variable (الأعلى أولوية)
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // السماح بالطلبات بدون origin (مثل Postman أو server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`[CORS] Blocked origin: ${origin}`);
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    // ✅ مهم: يضمن أن الـ preflight OPTIONS يحصل على 200 وليس 404
    optionsSuccessStatus: 200,
  }),
);

// ✅ معالجة OPTIONS preflight يدوياً كطبقة أمان إضافية
app.options("*", cors());

// Middleware أساسية
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes تُضاف هنا بعد CORS
// app.use("/api/auth", authRouter);
// app.use("/api/sessions", sessionsRouter);
// ... إلخ

export default app;
