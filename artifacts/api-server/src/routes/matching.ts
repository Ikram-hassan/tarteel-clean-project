import { Router } from "express";
import { db } from "@workspace/db";
import { students, teachers } from "@workspace/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

const router = Router();

/**
 * PLACEMENT INTERVIEWER: High-Priority Strategic Routing
 * 5-Point Matching Hierarchy (Override Logic):
 * 1. Level (PRIORITY) - Exact match to interviewer's decision
 * 2. Gender - Same-gender matching
 * 3. Language - Native/Preferred language compatibility
 * 4. Days - Overlapping available days
 * 5. Shift/Hours - Precise time-slot alignment
 */
router.post("/placement-assign", async (req, res): Promise<any> => {
  const {
    studentId,
    studentName,
    level,
    juzRange,
    assignedQiraat,
    interviewerId,
  } = req.body;

  if (!studentId || !level) {
    return res.status(400).json({
      error: "Student ID and level are required",
    });
  }

  try {
    // 1. Get student details
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    // 2. Update student with placement decision (HIGHEST PRIORITY)
    await db
      .update(students)
      .set({
        studentLevel: level,
        assignedJuzRange: juzRange || null,
        assignedQiraat: assignedQiraat || null,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    // 3. Find matching teachers with 5-point hierarchy
    const matchingTeachers = await db
      .select()
      .from(teachers)
      .where(
        and(
          eq(teachers.role, "teacher"),
          eq(teachers.teacherType, level), // PRIORITY 1: Level
          eq(teachers.gender, student.gender), // PRIORITY 2: Gender
          eq(teachers.isVerified, true),
        ),
      );

    if (matchingTeachers.length === 0) {
      return res.status(404).json({
        error: "No matching teachers found for placement criteria",
        criteria: {
          level: level,
          gender: student.gender,
          language: student.language,
          juzRange,
          assignedQiraat,
        },
      });
    }

    // 4. Score teachers based on remaining priorities (3-5)
    const scoredTeachers = matchingTeachers
      .map((teacher) => {
        let score = 100; // Base score for level + gender match

        // PRIORITY 3: Language (40 points)
        const teacherLanguages = (teacher.languages as string[]) || ["ar"];
        if (teacherLanguages.includes(student.language)) {
          score += 40;
        }

        // PRIORITY 4: Days overlap (30 points)
        const studentDays = (student.selectedDays as string[]) || [];
        const teacherDays = (teacher.workingDays as string[]) || [];
        const dayOverlap = studentDays.filter((day) =>
          teacherDays.includes(day),
        ).length;
        if (dayOverlap > 0) {
          score += 30 * (dayOverlap / Math.max(studentDays.length, 1));
        }

        // PRIORITY 5: Shift/Hours alignment (30 points)
        const studentSections = (student.selectedSections as string[]) || [];
        const teacherSections = (teacher.workingSections as string[]) || [];
        const sectionOverlap = studentSections.filter((sec) =>
          teacherSections.includes(sec),
        ).length;
        if (sectionOverlap > 0) {
          score += 30 * (sectionOverlap / Math.max(studentSections.length, 1));
        }

        // Additional validation for intermediate (Juz range)
        if (level === "intermediate" && juzRange) {
          const teacherJuz = teacher.juzRange || 30;
          if (juzRange > teacherJuz) {
            score -= 50; // Penalty if teacher can't handle the Juz range
          }
        }

        // Additional validation for ijaza (Qira'at match)
        if (level === "ijaza" && assignedQiraat) {
          if (teacher.qiraatSpecialization === assignedQiraat) {
            score += 50; // Bonus for exact Qira'at match
          } else {
            score -= 50; // Penalty for mismatch
          }
        }

        // Capacity check
        const currentStudents = teacher.currentTotalStudents || 0;
        const maxCapacity =
          (teacher.maxSessionsPerShift || 4) *
          (teacher.studentsPerSession || 5);
        const capacityRatio = currentStudents / maxCapacity;

        if (capacityRatio >= 1.0) {
          score -= 100; // Teacher is at full capacity
        } else if (capacityRatio < 0.5) {
          score += 20; // Bonus for available capacity
        }

        return {
          teacher,
          score,
          capacityRatio,
        };
      })
      .filter((item) => item.score > 50) // Only keep viable matches
      .sort((a, b) => b.score - a.score);

    if (scoredTeachers.length === 0) {
      return res.status(404).json({
        error: "No suitable teachers found based on 5-point hierarchy",
        availableTeachers: matchingTeachers.length,
      });
    }

    // 5. Assign to best matching teacher
    const bestMatch = scoredTeachers[0];
    const assignedTeacher = bestMatch.teacher;

    // Update student with teacher assignment
    await db
      .update(students)
      .set({
        assignedTeacherId: assignedTeacher.id,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    // Update teacher's student count
    await db
      .update(teachers)
      .set({
        currentTotalStudents: (assignedTeacher.currentTotalStudents || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(teachers.id, assignedTeacher.id));

    return res.status(200).json({
      success: true,
      message: "Student successfully placed via interviewer decision",
      placement: {
        studentId: student.id,
        studentName: student.name,
        assignedLevel: level,
        juzRange,
        assignedQiraat,
        teacherId: assignedTeacher.id,
        teacherName: assignedTeacher.name,
        matchScore: bestMatch.score,
        hierarchyMatch: {
          level: true, // Always true (Priority 1)
          gender: true, // Always true (Priority 2)
          language: ((assignedTeacher.languages as string[]) || []).includes(
            student.language,
          ),
          daysOverlap: (student.selectedDays as string[]).some((day) =>
            (assignedTeacher.workingDays as string[]).includes(day),
          ),
          shiftAlignment: (student.selectedSections as string[]).some((sec) =>
            (assignedTeacher.workingSections as string[]).includes(sec),
          ),
        },
      },
      alternativeTeachers: scoredTeachers.slice(1, 3).map((item) => ({
        teacherId: item.teacher.id,
        teacherName: item.teacher.name,
        score: item.score,
      })),
    });
  } catch (error: any) {
    console.error("Placement Assignment Error:", error);
    return res.status(500).json({
      error: "Failed to assign student via placement",
      details: error.message,
    });
  }
});

/**
 * Smart Matching Algorithm (Legacy - for non-placement assignments)
 * Matches students to teachers based on:
 * 1. Gender (same gender matching)
 * 2. Language (preferred language)
 * 3. Shift/Schedule (overlapping availability)
 * 4. Specialization (student level matches teacher type)
 */
router.post("/assign-student", async (req, res): Promise<any> => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({
      error: "Student ID is required",
    });
  }

  try {
    // 1. Get student details
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return res.status(404).json({
        error: "Student not found",
      });
    }

    // 2. Check if student already has a teacher
    if (student.assignedTeacherId) {
      return res.status(400).json({
        error: "Student already has an assigned teacher",
        teacherId: student.assignedTeacherId,
      });
    }

    // 3. Determine student level (from placement test or default to beginner)
    const studentLevel = student.studentLevel || "beginner";

    // 4. Find matching teachers
    const matchingTeachers = await db
      .select()
      .from(teachers)
      .where(
        and(
          eq(teachers.role, "teacher"),
          eq(teachers.gender, student.gender),
          eq(teachers.isVerified, true),
        ),
      );

    if (matchingTeachers.length === 0) {
      return res.status(404).json({
        error: "No matching teachers found",
        criteria: {
          gender: student.gender,
          language: student.language,
          level: studentLevel,
        },
      });
    }

    // 5. Score and rank teachers
    const scoredTeachers = matchingTeachers
      .map((teacher) => {
        let score = 0;

        // Language match (30 points)
        const teacherLanguages = (teacher.languages as string[]) || ["ar"];
        if (teacherLanguages.includes(student.language)) {
          score += 30;
        }

        // Schedule overlap (40 points)
        const studentDays = (student.selectedDays as string[]) || [];
        const teacherDays = (teacher.workingDays as string[]) || [];
        const studentSections = (student.selectedSections as string[]) || [];
        const teacherSections = (teacher.workingSections as string[]) || [];

        const dayOverlap = studentDays.filter((day) =>
          teacherDays.includes(day),
        ).length;
        const sectionOverlap = studentSections.filter((sec) =>
          teacherSections.includes(sec),
        ).length;

        if (dayOverlap > 0 && sectionOverlap > 0) {
          score += 40;
        }

        // Specialization match (30 points)
        const teacherType = teacher.teacherType;
        if (studentLevel === "beginner" && teacherType === "beginner") {
          score += 30;
        } else if (
          studentLevel === "intermediate" &&
          teacherType === "intermediate"
        ) {
          // Check Juz range compatibility
          const studentJuz = student.assignedJuzRange || 5;
          const teacherJuz = teacher.juzRange || 30;
          if (studentJuz <= teacherJuz) {
            score += 30;
          }
        } else if (studentLevel === "meton" && teacherType === "meton") {
          score += 30;
        } else if (studentLevel === "ijaza" && teacherType === "ijaza") {
          // Check Qira'at compatibility
          if (
            student.assignedQiraat &&
            teacher.qiraatSpecialization === student.assignedQiraat
          ) {
            score += 30;
          }
        }

        // Capacity check (bonus for available capacity)
        const currentStudents = teacher.currentTotalStudents || 0;
        const maxCapacity =
          (teacher.maxSessionsPerShift || 4) *
          (teacher.studentsPerSession || 5);
        const capacityRatio = currentStudents / maxCapacity;

        if (capacityRatio < 0.5) {
          score += 10; // Teacher has plenty of space
        } else if (capacityRatio < 0.8) {
          score += 5; // Teacher has some space
        }

        return {
          teacher,
          score,
          capacityRatio,
        };
      })
      .filter((item) => item.score > 0) // Only keep teachers with some match
      .sort((a, b) => b.score - a.score); // Sort by score descending

    if (scoredTeachers.length === 0) {
      return res.status(404).json({
        error: "No suitable teachers found based on matching criteria",
        availableTeachers: matchingTeachers.length,
      });
    }

    // 6. Assign to best matching teacher
    const bestMatch = scoredTeachers[0];
    const assignedTeacher = bestMatch.teacher;

    // Update student record
    await db
      .update(students)
      .set({
        assignedTeacherId: assignedTeacher.id,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    // Update teacher's student count
    await db
      .update(teachers)
      .set({
        currentTotalStudents: (assignedTeacher.currentTotalStudents || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(teachers.id, assignedTeacher.id));

    return res.status(200).json({
      success: true,
      message: "Student successfully assigned to teacher",
      assignment: {
        studentId: student.id,
        studentName: student.name,
        teacherId: assignedTeacher.id,
        teacherName: assignedTeacher.name,
        matchScore: bestMatch.score,
        matchDetails: {
          gender: student.gender === assignedTeacher.gender,
          language: ((assignedTeacher.languages as string[]) || []).includes(
            student.language,
          ),
          scheduleOverlap: true,
          specialization: assignedTeacher.teacherType,
        },
      },
      alternativeTeachers: scoredTeachers.slice(1, 4).map((item) => ({
        teacherId: item.teacher.id,
        teacherName: item.teacher.name,
        score: item.score,
      })),
    });
  } catch (error: any) {
    console.error("Matching Error:", error);
    return res.status(500).json({
      error: "Failed to assign student to teacher",
      details: error.message,
    });
  }
});

/**
 * Get matching statistics for a student
 */
router.get("/student/:studentId/matches", async (req, res): Promise<any> => {
  const { studentId } = req.params;

  try {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const matchingTeachers = await db
      .select()
      .from(teachers)
      .where(
        and(
          eq(teachers.role, "teacher"),
          eq(teachers.gender, student.gender),
          eq(teachers.isVerified, true),
        ),
      );

    return res.status(200).json({
      studentId: student.id,
      studentName: student.name,
      currentTeacher: student.assignedTeacherId,
      totalMatchingTeachers: matchingTeachers.length,
      criteria: {
        gender: student.gender,
        language: student.language,
        level: student.studentLevel || "beginner",
        days: student.selectedDays,
        sections: student.selectedSections,
      },
    });
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ error: "Failed to fetch matches" });
  }
});

/**
 * Reassign student to a different teacher
 */
router.post("/reassign-student", async (req, res): Promise<any> => {
  const { studentId, newTeacherId } = req.body;

  if (!studentId || !newTeacherId) {
    return res.status(400).json({
      error: "Student ID and new teacher ID are required",
    });
  }

  try {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const [newTeacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, newTeacherId))
      .limit(1);

    if (!newTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Decrease old teacher's count
    if (student.assignedTeacherId) {
      await db
        .update(teachers)
        .set({
          currentTotalStudents: sql`GREATEST(0, ${teachers.currentTotalStudents} - 1)`,
          updatedAt: new Date(),
        })
        .where(eq(teachers.id, student.assignedTeacherId));
    }

    // Update student
    await db
      .update(students)
      .set({
        assignedTeacherId: newTeacherId,
        updatedAt: new Date(),
      })
      .where(eq(students.id, studentId));

    // Increase new teacher's count
    await db
      .update(teachers)
      .set({
        currentTotalStudents: (newTeacher.currentTotalStudents || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(teachers.id, newTeacherId));

    return res.status(200).json({
      success: true,
      message: "Student reassigned successfully",
      oldTeacherId: student.assignedTeacherId,
      newTeacherId: newTeacherId,
    });
  } catch (error: any) {
    console.error("Reassignment Error:", error);
    return res.status(500).json({
      error: "Failed to reassign student",
      details: error.message,
    });
  }
});

/**
 * Get waiting students matched to the current interviewer
 * Matches based on:
 * 1. is_tested must be false
 * 2. current_active_shift must match exactly between interviewer and student
 * 3. At least one day in students.selected_days matches interviewer's working_days (SQL intersection)
 * 4. Only students assigned to the interviewer's shift and level
 */
router.get("/waiting-students", async (req, res): Promise<any> => {
  try {
    const { interviewerId } = req.query;

    if (!interviewerId) {
      return res.status(400).json({
        error: "Interviewer ID is required",
      });
    }

    // 1. Get interviewer details
    const [interviewer] = await db
      .select()
      .from(teachers)
      .where(
        and(
          eq(teachers.id, interviewerId as string),
          eq(teachers.role, "interviewer"),
        ),
      )
      .limit(1);

    if (!interviewer) {
      return res.status(404).json({
        error: "Interviewer not found or invalid role",
      });
    }

    const interviewerShift = interviewer.currentActiveShift;
    const interviewerDays = (interviewer.workingDays as string[]) || [];
    const interviewerType = interviewer.interviewerType; // placement, hifz, or ijaza

    if (!interviewerShift) {
      return res.status(400).json({
        error: "Interviewer has no active shift set",
      });
    }

    // 2. Fetch students matching all criteria using SQL intersection for days
    const waitingStudents = await db
      .select()
      .from(students)
      .where(
        and(
          eq(students.isTested, false), // Criterion 1: is_tested must be false
          eq(students.currentActiveShift, interviewerShift), // Criterion 2: exact shift match
          sql`EXISTS (
            SELECT 1 
            FROM jsonb_array_elements_text(${students.selectedDays}) AS student_day
            WHERE student_day = ANY(${interviewerDays})
          )`, // Criterion 3: SQL intersection check for at least one matching day
        ),
      )
      .orderBy(students.createdAt);

    // 3. Filter by interviewer level/type if applicable
    // For placement interviewers, they handle all new students
    // For hifz/ijaza interviewers, filter by student level
    let filteredStudents = waitingStudents;

    if (interviewerType === "hifz") {
      filteredStudents = waitingStudents.filter(
        (student) =>
          student.studentLevel === "intermediate" ||
          student.studentLevel === "meton",
      );
    } else if (interviewerType === "ijaza") {
      filteredStudents = waitingStudents.filter(
        (student) => student.studentLevel === "ijaza",
      );
    }
    // For placement interviewers, no additional filtering needed

    return res.status(200).json({
      success: true,
      interviewerInfo: {
        id: interviewer.id,
        name: interviewer.name,
        type: interviewerType,
        activeShift: interviewerShift,
        workingDays: interviewerDays,
      },
      waitingStudents: filteredStudents.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        gender: student.gender,
        language: student.language,
        studentLevel: student.studentLevel || "New",
        createdAt: student.createdAt,
        selectedDays: student.selectedDays,
        selectedSections: student.selectedSections,
        currentActiveShift: student.currentActiveShift,
        matchingDays: ((student.selectedDays as string[]) || []).filter((day) =>
          interviewerDays.includes(day),
        ),
      })),
      total: filteredStudents.length,
      matchCriteria: {
        isTested: false,
        shiftMatch: interviewerShift,
        daysIntersection: "At least one matching day",
        levelFilter: interviewerType,
      },
    });
  } catch (error: any) {
    console.error("Error fetching waiting students:", error);
    return res.status(500).json({
      error: "Failed to fetch waiting students",
      details: error.message,
    });
  }
});

export default router;
