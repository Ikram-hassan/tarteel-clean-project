import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import { students } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * 🔹 GET /api/students
 * جلب قائمة جميع الطلاب من قاعدة البيانات
 */
router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("[Students] Fetching all students from database...");

    // Query the database for all students
    const allStudents = await db.select().from(students);

    console.log(
      `[Students] Successfully fetched ${allStudents.length} students`,
    );

    // Return JSON response with students data
    return res.json({
      status: "success",
      count: allStudents.length,
      data: allStudents,
    });
  } catch (error) {
    console.error("[Students] Error fetching students:", error);
    return res.status(500).json({
      status: "error",
      error: "Failed to fetch students",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * 🔹 GET /api/students/:id
 * جلب طالب واحد بناءً على المعرف
 */
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    console.log(`[Students] Fetching student with ID: ${id}`);

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, String(id)))
      .limit(1);

    if (!student) {
      console.log(`[Students] Student with ID ${id} not found`);
      return res.status(404).json({
        status: "error",
        error: "Student not found",
      });
    }

    console.log(`[Students] Successfully fetched student: ${student.name}`);
    return res.json({
      status: "success",
      data: student,
    });
  } catch (error) {
    console.error(`[Students] Error fetching student ${id}:`, error);
    return res.status(500).json({
      status: "error",
      error: "Failed to fetch student",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * 🔹 PUT /api/students/:id
 * تحديث بيانات طالب
 */
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    console.log(`[Students] Updating student with ID: ${id}`, updateData);

    const [updatedStudent] = await db
      .update(students)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(students.id, String(id)))
      .returning();

    if (!updatedStudent) {
      console.log(`[Students] Student with ID ${id} not found for update`);
      return res.status(404).json({
        status: "error",
        error: "Student not found",
      });
    }

    console.log(
      `[Students] Successfully updated student: ${updatedStudent.name}`,
    );
    return res.json({
      status: "success",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(`[Students] Error updating student ${id}:`, error);
    return res.status(500).json({
      status: "error",
      error: "Failed to update student",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * 🔹 DELETE /api/students/:id
 * حذف طالب
 */
router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    console.log(`[Students] Deleting student with ID: ${id}`);

    const [deletedStudent] = await db
      .delete(students)
      .where(eq(students.id, String(id)))
      .returning();

    if (!deletedStudent) {
      console.log(`[Students] Student with ID ${id} not found for deletion`);
      return res.status(404).json({
        status: "error",
        error: "Student not found",
      });
    }

    console.log(
      `[Students] Successfully deleted student: ${deletedStudent.name}`,
    );
    return res.json({
      status: "success",
      message: "Student deleted successfully",
      data: deletedStudent,
    });
  } catch (error) {
    console.error(`[Students] Error deleting student ${id}:`, error);
    return res.status(500).json({
      status: "error",
      error: "Failed to delete student",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
