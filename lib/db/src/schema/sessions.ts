import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { teachers } from "./teachers";

export const sessions = pgTable("sessions", {
  // 1. المعرف الأساسي للجلسة
  id: text("id").primaryKey(), 

  // 2. الربط بالمعلم والوردية (تحديث مهم)
  teacherId: text("teacher_id").references(() => teachers.id).notNull(),
  
  // أضفنا هذا الحقل لربط الجلسة بوردية محددة (مثل: sec_1, sec_2)
  sectionId: text("section_id").notNull(), 
  
  // رقم الحصة التراكمي لهذا المعلم
  sessionNumber: integer("session_number").notNull(), 

  // 3. حالة الجلسة والأمان
  status: text("status").default("scheduled").notNull(), 
  isAudioOnly: boolean("is_audio_only").default(true),
  canShareScreen: boolean("can_share_screen").default(false),
  
  // 4. التوقيت الزمني
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  
  actualStartTime: timestamp("actual_start_time"), 
  actualEndTime: timestamp("actual_end_time"),

  // 5. نظام الحضور والغياب التلقائي
  attendance: jsonb("attendance").default([]),

  // 6. مراقبة الأداء الآلية (تحديث لدعم المحاورين والمديرين)
  adminMetrics: jsonb("admin_metrics").default({
    isTeacherLate: false,
    teacherTotalActiveMinutes: 0,
    systemCalculatedStatus: "pending",
    incidentReports: [],
    // إضافة تتبع إذا كانت الجلسة "مقابلة" مع محاور أو "حصة" مع معلم
    sessionCategory: "regular_class" // 'regular_class' | 'placement_test'
  }),

  // 7. روابط التواصل والوسائط
  audioRoomUrl: text("audio_room_url"), 
  screenShareUrl: text("screen_share_url"), 

  // 8. مخرجات الجلسة التعليمية
  teacherNotes: text("teacher_notes"),
  dailyAssignment: text("daily_assignment"), 
  summary: text("summary"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});