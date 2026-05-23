import { Router, Request, Response, NextFunction } from "express";
import authRouter from "./auth.js";
import sessionsRouter from "./sessions.js";
import matchingRouter from "./matching.js";
import shiftsRouter from "./shifts.js";
import studentsRouter from "./students.js";

const router = Router();

/**
 * 🛡️ برمجية وسيطة للتحقق من المشرفين (Admin Middleware)
 * قمنا بدمجها هنا مباشرة لتوفير الوقت وتجنب أخطاء الاستيراد
 */
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // ملاحظة: هذا مجرد مثال للتحقق من الـ Role.
  // يمكنك تعديله ليتوافق مع طريقة تخزين بيانات المستخدم لديك (مثل req.user.role)
  const userRole = req.headers["x-user-role"];

  if (userRole === "admin") {
    next(); // المستخدم أدمن، اسمح له بالمرور
  } else {
    res.status(403).json({
      error: "Forbidden",
      message: "Access Denied: You do not have admin privileges.",
    });
  }
};

/**
 * 🔹 ربط مسارات الهوية (Authentication)
 * المسار النهائي سيكون: /api/auth/...
 */
router.use("/auth", authRouter);

/**
 * 🔹 ربط مسارات الجلسات (Sessions)
 * المسار النهائي سيكون: /api/sessions/...
 */
router.use("/sessions", sessionsRouter);

/**
 * 🔹 ربط مسارات المطابقة الذكية (Smart Matching)
 * المسار النهائي سيكون: /api/matching/...
 */
router.use("/matching", matchingRouter);

/**
 * 🔹 ربط مسارات الورديات (Shifts)
 * المسار النهائي سيكون: /api/shifts/...
 */
router.use("/shifts", shiftsRouter);

/**
 * 🔹 ربط مسارات الطلاب (Students)
 * المسار النهائي سيكون: /api/students/...
 */
router.use("/students", studentsRouter);

/**
 * 🛡️ مسارات الإدارة (Admin Routes)
 * المسار النهائي سيكون: /api/admin/...
 * محمية بواسطة وظيفة isAdmin
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
