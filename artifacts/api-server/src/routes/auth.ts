import { Router } from "express";
import { db } from "@workspace/db";
import {
  teachers,
  verificationCodes,
  students,
  admins,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

/**
 * --- LOGIN ---
 */
router.post("/login", async (req, res): Promise<any> => {
  const rawId = req.body.id;
  const id = typeof rawId === "string" ? rawId.trim() : rawId;

  if (!id) {
    return res.status(400).json({ error: "معرف المستخدم مطلوب" });
  }

  try {
    console.log(`[Auth] Attempting login for UID: "${id}"`);

    // Admin
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);

    if (admin) {
      console.log(`[Auth] Admin found: ${admin.email}`);
      return res.json({ ...admin, role: "admin" });
    }

    // Student
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1);

    if (student) {
      console.log(`[Auth] Student found: ${student.email}`);
      return res.json({ ...student, role: "student" });
    }

    // Teacher
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, id))
      .limit(1);

    if (teacher) {
      console.log(`[Auth] Teacher found: ${teacher.email}`);
      return res.json(teacher);
    }

    console.warn(`[Auth] UID "${id}" not found`);
    return res.status(404).json({
      error: "المستخدم غير موجود في قاعدة البيانات",
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      error: "خطأ داخلي في السيرفر",
    });
  }
});

/**
 * --- REGISTER STUDENT ---
 */
router.post("/register/student", async (req, res): Promise<any> => {
  const {
    id,
    name,
    email,
    phone,
    age,
    gender,
    language,
    selectedDays,
    selectedSections,
    monthlyFee,
  } = req.body;

  const cleanId = String(id).trim();

  if (!cleanId || !email) {
    return res.status(400).json({
      error: "المعرف والبريد الإلكتروني مطلوبان",
    });
  }

  try {
    const [newStudent] = await db
      .insert(students)
      .values({
        id: cleanId,
        name: String(name),
        email: String(email).toLowerCase().trim(),
        phone: phone ? String(phone) : null,
        age: age ? Number(age) : null,
        gender: gender || "male",
        language: language || "ar",
        selectedDays: Array.isArray(selectedDays) ? selectedDays : [],
        selectedSections: Array.isArray(selectedSections)
          ? selectedSections
          : [],
        monthlyFee: monthlyFee ? String(monthlyFee) : "0",
        paymentStatus: "unpaid",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    return res.status(201).json({ ...newStudent, role: "student" });
  } catch (error: any) {
    console.error("Student Registration Error:", error);
    return res.status(500).json({
      error: "فشل حفظ بيانات الطالب",
    });
  }
});

/**
 * --- REGISTER TEACHER / INTERVIEWER ---
 */
router.post("/register/teacher", async (req, res): Promise<any> => {
  console.log(
    "[Auth] Teacher Registration Request Body:",
    JSON.stringify(req.body, null, 2),
  );

  const {
    id,
    name,
    email,
    phone,
    gender,
    verificationCode,
    role,
    selectedDays,
    selectedSections,
    teacherType,
    juzRange,
    qiraatSpecialization,
    interviewerType,
  } = req.body;

  const cleanId = id ? String(id).trim() : "";

  console.log(
    "[Auth] Validation Check - cleanId:",
    cleanId,
    "verificationCode:",
    verificationCode,
  );

  if (!cleanId || !verificationCode) {
    console.error("[Auth] Validation Failed - Missing id or verificationCode");
    return res.status(400).json({
      error: "المعرف وكود التحقق مطلوبان",
    });
  }

  try {
    const [codeRecord] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.code, verificationCode),
          eq(verificationCodes.isUsed, false),
          eq(verificationCodes.targetRole, role),
        ),
      )
      .limit(1);

    if (!codeRecord) {
      return res.status(400).json({
        error: "كود التحقق غير صحيح أو مستخدم",
      });
    }

    const teacherData: any = {
      id: cleanId,
      name: String(name),
      email: String(email).toLowerCase().trim(),
      phone: phone ? String(phone) : null,
      gender: gender || "male",
      role: role,
      verificationCode: String(verificationCode),
      isVerified: true,
      workingDays: Array.isArray(selectedDays) ? selectedDays : [],
      workingSections: Array.isArray(selectedSections) ? selectedSections : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add teacher specialization fields
    if (role === "teacher" && teacherType) {
      teacherData.teacherType = teacherType;
      if (teacherType === "intermediate" && juzRange) {
        teacherData.juzRange = Number(juzRange);
      }
      if (teacherType === "ijaza" && qiraatSpecialization) {
        teacherData.qiraatSpecialization = qiraatSpecialization;
      }
    }

    // Add interviewer specialization fields
    if (role === "interviewer" && interviewerType) {
      teacherData.interviewerType = interviewerType;
      // Set max queue based on interviewer type
      const maxQueueMap: Record<string, number> = {
        placement: 20,
        hifz: 10,
        ijaza: 5,
      };
      teacherData.maxStudentsInQueue = maxQueueMap[interviewerType] || 20;
    }

    const [newTeacher] = await db
      .insert(teachers)
      .values(teacherData)
      .returning();

    await db
      .update(verificationCodes)
      .set({
        isUsed: true,
        usedByEmail: email,
        usedAt: new Date(),
      })
      .where(eq(verificationCodes.id, codeRecord.id));

    return res.status(201).json(newTeacher);
  } catch (error: any) {
    console.error("Teacher Registration Error:", error);
    return res.status(500).json({
      error: "خطأ أثناء تسجيل المعلم",
    });
  }
});

/**
 * --- REGISTER ADMIN ---
 * ✅ IMPORTANT: route = /register/admin (NOT register-admin)
 */
router.post("/register/admin", async (req, res): Promise<any> => {
  const { id, name, email, phone, verificationCode, language } = req.body;

  const cleanId = String(id).trim();

  if (!cleanId || !verificationCode || !email) {
    return res.status(400).json({
      error: "المعرف، البريد، وكود التحقق مطلوبة",
    });
  }

  try {
    const [codeRecord] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.code, verificationCode),
          eq(verificationCodes.isUsed, false),
          eq(verificationCodes.targetRole, "admin"),
        ),
      )
      .limit(1);

    if (!codeRecord) {
      return res.status(400).json({
        error: "كود التحقق غير صحيح أو مستخدم",
      });
    }

    const [newAdmin] = await db
      .insert(admins)
      .values({
        id: cleanId,
        name: String(name),
        email: String(email).toLowerCase().trim(),
        phone: phone ? String(phone) : null,
        language: language || "ar",
        role: "admin",
        verificationCode: String(verificationCode),
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .returning();

    await db
      .update(verificationCodes)
      .set({
        isUsed: true,
        usedByEmail: email,
        usedAt: new Date(),
      })
      .where(eq(verificationCodes.id, codeRecord.id));

    return res.status(201).json({ ...newAdmin, role: "admin" });
  } catch (error: any) {
    console.error("Admin Registration Error:", error);
    return res.status(500).json({
      error: "فشل تسجيل المدير",
    });
  }
});

export default router;
