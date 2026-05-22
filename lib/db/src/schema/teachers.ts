import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";

export const teachers = pgTable("teachers", {
  // 1. الهوية الأساسية (Firebase UID)
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  // ✅ تم التعديل: أصبح رقم الهاتف إجبارياً الآن
  phone: text("phone").notNull(),
  gender: text("gender").notNull(),

  // 2. دور الموظف
  role: text("role")
    .$type<"teacher" | "interviewer">()
    .default("teacher")
    .notNull(),

  // 3. نظام الأمان والتحقق
  // ✅ تم التعديل: أصبح كود التحقق إجبارياً لضمان توثيق عملية التسجيل
  verificationCode: text("verification_code").notNull(),
  isVerified: boolean("is_verified").default(false),

  // 4. نظام الجدولة
  workingDays: jsonb("working_days").default([]).notNull(),
  workingSections: jsonb("working_sections").default([]).notNull(),

  // 5. إعدادات السعة الاستيعابية
  maxSessionsPerShift: integer("max_sessions_per_shift").default(4),
  studentsPerSession: integer("students_per_session").default(5),
  currentTotalStudents: integer("current_total_students").default(0),

  // 6. نظام الأداء والحضور
  attendanceStats: jsonb("attendance_stats").default({
    totalWorkMinutes: 0,
    presentDays: 0,
    absentDays: 0,
    lateCount: 0,
    lastLogin: null,
    averageRating: 5.0,
  }),

  // 7. إعدادات خاصة بالمحاور
  interviewerSettings: jsonb("interviewer_settings").default({
    maxStudentsInTest: 5,
    currentStudentsInTest: 0,
    isRoomOpen: false,
    approvedCertificates: 0,
  }),
  interviewCount: integer("interview_count").default(0),

  // 8. المهارات واللغات
  languages: jsonb("languages").default(["ar"]),
  levelsToTeach: jsonb("levels_to_teach").default([]),

  // 🆕 9. نظام التخصصات المتقدم (Teacher Specializations)
  teacherType: text("teacher_type", {
    enum: ["beginner", "intermediate", "meton", "ijaza"],
  }),
  juzRange: integer("juz_range"), // للمعلمين المتوسطين: 5, 10, 15, 20, 25, 30
  qiraatSpecialization: text("qiraat_specialization"), // للإجازة: واحدة من القراءات العشر
  metonTextsCompleted: jsonb("meton_texts_completed").default({
    tuhfatAlAtfal: false,
    jazariyyah: false,
    shatibiyyah: false,
    durrah: false,
    tayyibatAlNashr: false,
    salsabil: false,
  }),

  // 🆕 10. نظام تخصصات المحاورين (Interviewer Specializations)
  interviewerType: text("interviewer_type", {
    enum: ["placement", "hifz", "ijaza"],
  }),
  maxStudentsInQueue: integer("max_students_in_queue").default(20), // للـ placement
  shiftsAvailable: jsonb("shifts_available").default([]), // ["shift_1", "shift_2"] or both

  // 🆕 11. نظام الورديات المتعددة (Multi-Shift Support)
  registeredShifts: jsonb("registered_shifts").default([]), // ["shift_1", "shift_2"] - الورديات المسجلة
  currentActiveShift: text("current_active_shift"), // "shift_1" or "shift_2" - الوردية النشطة حالياً

  // 12. الحالة والماليات
  isOnline: boolean("is_online").default(false),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).default(
    "0.00",
  ),

  // 13. طوابع زمنية
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
