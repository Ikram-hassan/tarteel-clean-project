import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { teachers } from "./teachers";

// جدول الغرف الصوتية المتوازية (4 غرف لكل معلم: A, B, C, D)
export const audioRooms = pgTable("audio_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),

  // ربط بالمعلم
  teacherId: text("teacher_id")
    .references(() => teachers.id)
    .notNull(),

  // اسم الغرفة: A, B, C, D
  roomName: text("room_name", { enum: ["A", "B", "C", "D"] }).notNull(),

  // الطلاب الحاليون في الغرفة (max 5)
  currentStudents: jsonb("current_students").default([]).notNull(),
  maxCapacity: integer("max_capacity").default(5).notNull(),

  // حالة تواجد المعلم
  teacherPresent: boolean("teacher_present").default(false),
  lastTeacherVisit: timestamp("last_teacher_visit"),

  // معلومات الجلسة
  sessionId: text("session_id"), // ربط بجلسة LiveKit
  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// جدول طلبات الاختبار (من المعلم إلى المحاور)
export const testRequests = pgTable("test_requests", {
  id: uuid("id").primaryKey().defaultRandom(),

  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  teacherId: text("teacher_id")
    .references(() => teachers.id)
    .notNull(),
  interviewerId: text("interviewer_id").references(() => teachers.id),

  // السجل الأكاديمي الكامل للطالب
  studentAcademicLog: jsonb("student_academic_log").default([]).notNull(),

  // حالة الطلب
  status: text("status", {
    enum: ["pending", "scheduled", "completed", "rejected"],
  })
    .default("pending")
    .notNull(),

  requestDate: timestamp("request_date").defaultNow(),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),

  // ملاحظات
  teacherNotes: text("teacher_notes"),
  interviewerNotes: text("interviewer_notes"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// جدول طلبات الشهادات (من المحاور إلى الإدارة)
export const certificateRequests = pgTable("certificate_requests", {
  id: uuid("id").primaryKey().defaultRandom(),

  studentId: text("student_id").notNull(),
  studentName: text("student_name").notNull(),
  interviewerId: text("interviewer_id")
    .references(() => teachers.id)
    .notNull(),
  adminId: text("admin_id"), // المدير الذي سيعالج الطلب

  // السجل الكامل للطالب
  studentFullLog: jsonb("student_full_log").default([]).notNull(),

  // نوع الشهادة
  certificateType: text("certificate_type", {
    enum: ["beginner", "intermediate", "meton", "ijaza"],
  }).notNull(),

  // تفاصيل إضافية
  juzCompleted: integer("juz_completed"), // للمتوسطين
  qiraatName: text("qiraat_name"), // للإجازة

  // حالة الطلب
  status: text("status", {
    enum: ["pending", "approved", "issued", "rejected"],
  })
    .default("pending")
    .notNull(),

  requestDate: timestamp("request_date").defaultNow(),
  approvedDate: timestamp("approved_date"),
  issuedDate: timestamp("issued_date"),

  // ملاحظات
  interviewerRecommendation: text("interviewer_recommendation"),
  adminNotes: text("admin_notes"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// جدول الرسائل (نظام المراسلة الثنائي)
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  // المرسل
  senderId: text("sender_id").notNull(),
  senderRole: text("sender_role", {
    enum: ["teacher", "interviewer", "admin"],
  }).notNull(),
  senderName: text("sender_name").notNull(),

  // المستقبل
  recipientId: text("recipient_id"),
  recipientName: text("recipient_name").notNull(), // إلزامي للمعلمين والمحاورين
  recipientRole: text("recipient_role", {
    enum: ["teacher", "interviewer", "admin"],
  }).notNull(),

  // نوع الرسالة
  messageType: text("message_type", {
    enum: [
      "teacher_to_admin",
      "teacher_to_interviewer",
      "interviewer_to_teacher",
      "interviewer_to_admin",
    ],
  }).notNull(),

  // المحتوى
  subject: text("subject"),
  content: text("content").notNull(),

  // الحالة
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),

  createdAt: timestamp("created_at").defaultNow(),
});
