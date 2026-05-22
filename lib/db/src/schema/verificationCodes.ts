import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { admins } from "./admins";

export const verificationCodes = pgTable("verification_codes", {
  // 1. المعرف الفريد للرمز
  id: uuid("id").defaultRandom().primaryKey(),

  // 2. الرمز الفعلي (الذي سيرسله المدير للمعلم)
  // مثال: MU-7721-QX
  code: text("code").notNull().unique(),

  // 3. نوع الحساب المسموح به بهذا الرمز
  // 'teacher' لفتح حساب معلم حصص | 'interviewer' لفتح حساب معلم اختبارات
  targetRole: text("target_role").default("teacher").notNull(),

  // 4. حالة الرمز
  isUsed: boolean("is_used").default(false), // هل تم استخدامه للتسجيل؟
  usedByEmail: text("used_by_email"), // بريد المعلم الذي استخدم الرمز (يملأ بعد التسجيل)

  // 5. تتبع الصلاحية والمنشئ
  createdBy: text("created_by").references(() => admins.id), // أي مدير قام بتوليد هذا الرمز؟
  expiresAt: timestamp("expires_at"), // (اختياري) تاريخ انتهاء صلاحية الرمز

  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at"), // متى تم استخدامه بالضبط؟
});