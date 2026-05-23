import { Router, Request, Response, NextFunction } from "express";
import cors from "cors"; // 1. استيراد المكتبة
import authRouter from "./auth.js";
import sessionsRouter from "./sessions.js";
import matchingRouter from "./matching.js";
import shiftsRouter from "./shifts.js";
import studentsRouter from "./students.js";

const router = Router();

// 2. تفعيل CORS لجميع المسارات في هذا الراوتر
router.use(
  cors({
    origin: "https://tateel-5.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-role"], // أضفنا x-user-role هنا لأنك تستخدمها في الـ Middleware
  }),
);

/**
 * 🛡️ برمجية وسيطة للتحقق من المشرفين (Admin Middleware)
 */
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.headers["x-user-role"];

  if (userRole === "admin") {
    next();
  } else {
    res.status(403).json({
      error: "Forbidden",
      message: "Access Denied: You do not have admin privileges.",
    });
  }
};

/**
 * 🔹 ربط مسارات الهوية (Authentication)
 */
router.use("/auth", authRouter);

/**
 * 🔹 ربط مسارات الجلسات (Sessions)
 */
router.use("/sessions", sessionsRouter);

/**
 * 🔹 ربط مسارات المطابقة الذكية (Smart Matching)
 */
router.use("/matching", matchingRouter);

/**
 * 🔹 ربط مسارات الورديات (Shifts)
 */
router.use("/shifts", shiftsRouter);

/**
 * 🔹 ربط مسارات الطلاب (Students)
 */
router.use("/students", studentsRouter);

/**
 * 🛡️ مسارات الإدارة (Admin Routes)
 */
router.get("/admin/dashboard", isAdmin, (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Welcome to the Admin Dashboard",
    data: {
      stats: "Current system statistics go here",
    },
  });
});

export default router;
