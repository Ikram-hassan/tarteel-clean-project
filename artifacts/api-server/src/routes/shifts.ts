import { Router } from "express";
import { db } from "@workspace/db";
import { students, teachers } from "@workspace/db/schema";
import { eq, and, inArray } from "drizzle-orm";

const router = Router();

/**
 * Toggle Active Shift
 * Updates the currentActiveShift for a user (teacher or student)
 */
router.post("/toggle", async (req, res): Promise<any> => {
  const { userId, userRole, newShift } = req.body;

  if (!userId || !userRole || !newShift) {
    return res.status(400).json({
      error: "Missing required fields: userId, userRole, newShift",
    });
  }

  if (!["shift_1", "shift_2"].includes(newShift)) {
    return res.status(400).json({
      error: "Invalid shift value. Must be 'shift_1' or 'shift_2'",
    });
  }

  try {
    // Update based on user role
    if (userRole === "teacher" || userRole === "interviewer") {
      const [teacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, userId))
        .limit(1);

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      // Check if user is registered for this shift
      const registeredShifts = (teacher.registeredShifts as string[]) || [];
      if (!registeredShifts.includes(newShift)) {
        return res.status(403).json({
          error: "User is not registered for this shift",
          registeredShifts,
        });
      }

      // Update current active shift
      await db
        .update(teachers)
        .set({
          currentActiveShift: newShift,
          updatedAt: new Date(),
        })
        .where(eq(teachers.id, userId));

      return res.status(200).json({
        success: true,
        message: "Shift toggled successfully",
        userId,
        newActiveShift: newShift,
        registeredShifts,
      });
    } else if (userRole === "student") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, userId))
        .limit(1);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // Check if user is registered for this shift
      const registeredShifts = (student.registeredShifts as string[]) || [];
      if (!registeredShifts.includes(newShift)) {
        return res.status(403).json({
          error: "User is not registered for this shift",
          registeredShifts,
        });
      }

      // Update current active shift
      await db
        .update(students)
        .set({
          currentActiveShift: newShift,
          updatedAt: new Date(),
        })
        .where(eq(students.id, userId));

      return res.status(200).json({
        success: true,
        message: "Shift toggled successfully",
        userId,
        newActiveShift: newShift,
        registeredShifts,
      });
    } else {
      return res.status(400).json({
        error:
          "Invalid user role. Must be 'teacher', 'interviewer', or 'student'",
      });
    }
  } catch (error: any) {
    console.error("Shift Toggle Error:", error);
    return res.status(500).json({
      error: "Failed to toggle shift",
      details: error.message,
    });
  }
});

/**
 * Get Shift Data
 * Fetches all relevant data for a specific shift
 */
router.get("/:userId/data", async (req, res): Promise<any> => {
  const { userId } = req.params;
  const { userRole, shift } = req.query;

  if (!userId || !userRole) {
    return res.status(400).json({
      error: "Missing required parameters: userId, userRole",
    });
  }

  try {
    // Determine which shift to fetch data for
    let targetShift = shift as string;

    if (!targetShift) {
      // If no shift specified, get the user's current active shift
      if (userRole === "teacher" || userRole === "interviewer") {
        const [teacher] = await db
          .select()
          .from(teachers)
          .where(eq(teachers.id, userId))
          .limit(1);

        if (!teacher) {
          return res.status(404).json({ error: "Teacher not found" });
        }

        targetShift = teacher.currentActiveShift || "shift_1";
      } else if (userRole === "student") {
        const [student] = await db
          .select()
          .from(students)
          .where(eq(students.id, userId))
          .limit(1);

        if (!student) {
          return res.status(404).json({ error: "Student not found" });
        }

        targetShift = student.currentActiveShift || "shift_1";
      }
    }

    // Map shift to sections
    const shiftSections: Record<string, string[]> = {
      shift_1: ["sec_1", "sec_2"],
      shift_2: ["sec_3", "sec_4", "sec_5"],
    };

    const sections = shiftSections[targetShift] || [];

    // Fetch data based on user role
    if (userRole === "teacher" || userRole === "interviewer") {
      // Get teacher's students for this shift
      const teacherStudents = await db
        .select()
        .from(students)
        .where(
          and(
            eq(students.assignedTeacherId, userId),
            // Filter students whose selectedSections overlap with shift sections
          ),
        );

      // Filter students who have at least one section in common with the shift
      const filteredStudents = teacherStudents.filter((student) => {
        const studentSections = (student.selectedSections as string[]) || [];
        return studentSections.some((sec) => sections.includes(sec));
      });

      return res.status(200).json({
        success: true,
        shift: targetShift,
        sections,
        data: {
          students: filteredStudents,
          totalStudents: filteredStudents.length,
          activeStudents: filteredStudents.filter((s) => s.isOnline).length,
          stats: {
            present: filteredStudents.filter(
              (s) => (s.attendanceStats as any)?.lastAttendance === "present",
            ).length,
            absent: filteredStudents.filter(
              (s) => (s.attendanceStats as any)?.lastAttendance === "absent",
            ).length,
            late: filteredStudents.filter(
              (s) => (s.attendanceStats as any)?.lastAttendance === "late",
            ).length,
          },
        },
      });
    } else if (userRole === "student") {
      // Get student's teacher and class info for this shift
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, userId))
        .limit(1);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      let teacherInfo = null;
      if (student.assignedTeacherId) {
        const [teacher] = await db
          .select()
          .from(teachers)
          .where(eq(teachers.id, student.assignedTeacherId))
          .limit(1);

        teacherInfo = teacher;
      }

      return res.status(200).json({
        success: true,
        shift: targetShift,
        sections,
        data: {
          student,
          teacher: teacherInfo,
          level: student.studentLevel || "beginner",
          progress: student.academicProgress,
          attendance: student.attendanceStats,
        },
      });
    } else {
      return res.status(400).json({
        error: "Invalid user role",
      });
    }
  } catch (error: any) {
    console.error("Fetch Shift Data Error:", error);
    return res.status(500).json({
      error: "Failed to fetch shift data",
      details: error.message,
    });
  }
});

/**
 * Get User's Registered Shifts
 * Returns all shifts a user is registered for
 */
router.get("/:userId/registered", async (req, res): Promise<any> => {
  const { userId } = req.params;
  const { userRole } = req.query;

  if (!userId || !userRole) {
    return res.status(400).json({
      error: "Missing required parameters: userId, userRole",
    });
  }

  try {
    if (userRole === "teacher" || userRole === "interviewer") {
      const [teacher] = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, userId))
        .limit(1);

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      return res.status(200).json({
        success: true,
        userId,
        registeredShifts: (teacher.registeredShifts as string[]) || [],
        currentActiveShift: teacher.currentActiveShift || null,
      });
    } else if (userRole === "student") {
      const [student] = await db
        .select()
        .from(students)
        .where(eq(students.id, userId))
        .limit(1);

      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json({
        success: true,
        userId,
        registeredShifts: (student.registeredShifts as string[]) || [],
        currentActiveShift: student.currentActiveShift || null,
      });
    } else {
      return res.status(400).json({
        error: "Invalid user role",
      });
    }
  } catch (error: any) {
    console.error("Fetch Registered Shifts Error:", error);
    return res.status(500).json({
      error: "Failed to fetch registered shifts",
      details: error.message,
    });
  }
});

export default router;
