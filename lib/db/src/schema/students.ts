import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { teachers } from "./teachers";

export const students = pgTable("students", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),

  // تم تعديله إلى integer ليتوافق مع كود التسجيل
  age: integer("age").notNull(),

  gender: text("gender", { enum: ["male", "female"] }).notNull(),
  language: text("language").notNull(),

  // --- الجدولة والخيارات المختارة ---
  // تخزين الأيام المختارة كمصفوفة (مثل: ["sat", "mon"])
  selectedDays: jsonb("selected_days").default([]).notNull(),

  // تخزين الورديات المختارة كمصفوفة
  selectedSections: jsonb("selected_sections").default([]).notNull(),

  // --- المسار التعليمي ---
  currentStep: text("current_step").default("placement_test"),
  isTested: boolean("is_tested").default(false),
  level: text("level"),

  // 🆕 نظام الرحلة الأكاديمية المتقدم (Academic Journey)
  studentLevel: text("student_level", {
    enum: ["beginner", "intermediate", "meton", "ijaza"],
  }),
  assignedJuzRange: integer("assigned_juz_range"), // للطلاب المتوسطين
  assignedQiraat: text("assigned_qiraat"), // لطلاب الإجازة
  placementTestResult: jsonb("placement_test_result").default({}), // نتيجة شجرة القرار
  academicLog: jsonb("academic_log").default([]), // سجل كامل للتقييمات والترقيات
  currentRoom: text("current_room", { enum: ["A", "B", "C", "D"] }), // للغرف الصوتية المتوازية

  // 🆕 نظام الورديات المتعددة (Multi-Shift Support)
  registeredShifts: jsonb("registered_shifts").default([]), // ["shift_1", "shift_2"] - الورديات المسجلة
  currentActiveShift: text("current_active_shift"), // "shift_1" or "shift_2" - الوردية النشطة حالياً

  // --- ربط المعلم والحصص ---
  assignedTeacherId: text("assigned_teacher_id").references(() => teachers.id),
  sessionNumber: integer("session_number").default(0),

  // --- نظام الحضور والتقدم العلمي ---
  attendanceStats: jsonb("attendance_stats").default({
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
    lastAttendance: null,
  }),

  academicProgress: jsonb("academic_progress").default({
    currentSurah: "",
    lastPage: 0,
    evaluationGrade: "A",
    teacherNotes: "",
  }),

  // --- النظام المالي ---
  monthlyFee: integer("monthly_fee").default(0),
  paymentStatus: text("payment_status").default("unpaid"), // (paid, unpaid, pending)
  trialEndDate: timestamp("trial_end_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),

  // --- الحالة اللحظية ---
  isOnline: boolean("is_online").default(false),
  lastSeen: timestamp("last_seen"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
