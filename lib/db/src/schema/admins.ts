import { pgTable, text, boolean, timestamp, jsonb, uuid, integer } from "drizzle-orm/pg-core";

// 1. جدول المديرين (Admins)
export const admins = pgTable("admins", {
  id: text("id").primaryKey(), 
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"), // إضافة رقم الهاتف للمدير للتواصل السريع
  language: text("language").default("ar"), // اللغة المفضلة للوحة التحكم

  // --- حقول كود التحقق (Validation/Verification Code) ---
  verificationCode: text("verification_code"), // لتخزين كود التحقق (مثل 123456)
  verificationExpiry: timestamp("verification_expiry"), // وقت انتهاء صلاحية الكود
  isVerified: boolean("is_verified").default(false), // هل تم التحقق من الحساب بنجاح؟
  // --------------------------------------------------

  // الرتبة والصلاحيات
  role: text("role").default("admin").notNull(), 

  // مركز التنبيهات الذكي
  notifications: jsonb("notifications").default([]),

  // لوحة مراقبة الأداء
  performanceMetrics: jsonb("performance_metrics").default({
    weeklyEvaluations: [], 
    monthlyReports: [],      
    pendingVerificationCodes: 0,
    teacherAttendanceRate: 0,
    interviewerEfficiency: 0 // تتبع أداء المحاورين في قبول الطلاب
  }),

  // نظام المالية والمدفوعات المطور
  financeTracking: jsonb("finance_tracking").default({
    pendingStudentPayments: [], 
    teacherPayoutsSchedule: [], 
    totalRevenue: 0,
    expectedRevenue: 0 // إجمالي المبالغ المتوقعة بناءً على حقل monthlyFee للطلاب
  }),

  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. جدول الحضور والغياب (Attendance Tracking)
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  studentId: text("student_id").notNull(), 
  teacherId: text("teacher_id").notNull(), 
  
  date: timestamp("date").defaultNow().notNull(),
  
  // الحالة: 'present', 'absent', 'late'
  status: text("status").notNull(), 
  
  // لتحديد الوردية التي حدث فيها الحضور (sec_1, sec_2, إلخ)
  sectionId: text("section_id"), 

  notes: text("notes"),
  sessionType: text("session_type").default("regular"), // regular, trial, test
});

// 3. جدول سجلات المعلمين والمحاورين (Staff Logs)
export const teacherLogs = pgTable("teacher_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  teacherId: text("teacher_id").notNull(),
  role: text("role"), // للتمييز بين دخول المعلم أو المحاور
  loginTime: timestamp("login_time").defaultNow(),
  logoutTime: timestamp("logout_time"),
  durationMinutes: integer("duration_minutes"), // تغيير النوع لـ integer لسهولة الحساب
  status: text("status"), // online, offline
});

// 4. جدول الشهادات (Certificates)
export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(), 
  courseName: text("course_name").notNull(), 
  level: text("level"), 
  
  // 'pending', 'issued', 'rejected'
  status: text("status").default("pending").notNull(),
  
  teacherId: text("teacher_id").notNull(), 
  adminId: text("admin_id"), 
  
  issueDate: timestamp("issue_date"),
  serialNumber: text("serial_number").unique(), 
  certificateUrl: text("certificate_url"), 
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});