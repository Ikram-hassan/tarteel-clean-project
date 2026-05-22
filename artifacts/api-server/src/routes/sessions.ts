import { Router } from "express";
import * as LiveKit from "livekit-server-sdk";
import { db } from "@workspace/db";
import { students, teachers, sessions } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

/**
 * GET /api/sessions
 * Fetch sessions based on user role
 * - Teachers: hostType === 'teacher' AND sessionCategory === 'regular_class'
 * - Interviewers: hostType === 'interviewer' AND sessionCategory === 'placement_test'
 */
router.get("/", async (req, res): Promise<any> => {
  const { userId, userRole } = req.query;

  if (!userId || !userRole) {
    return res.status(400).json({
      error: "userId and userRole are required",
    });
  }

  try {
    let userSessions;

    if (userRole === "teacher") {
      // Fetch only regular class sessions for teachers
      userSessions = await db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.teacherId, userId as string),
            eq(sessions.hostType, "teacher"),
            eq(sessions.sessionCategory, "regular_class"),
          ),
        );
    } else if (userRole === "interviewer") {
      // Fetch only placement test sessions for interviewers
      userSessions = await db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.teacherId, userId as string),
            eq(sessions.hostType, "interviewer"),
            eq(sessions.sessionCategory, "placement_test"),
          ),
        );
    } else {
      return res.status(400).json({
        error: "Invalid userRole. Must be 'teacher' or 'interviewer'",
      });
    }

    return res.json({
      success: true,
      sessions: userSessions,
      count: userSessions.length,
    });
  } catch (error) {
    console.error("Fetch sessions error:", error);
    return res.status(500).json({
      error: "Failed to fetch sessions",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/sessions/token
 * Generate LiveKit access token for joining a room
 * - Verifies participantId exists in database (Students/Teachers table)
 * - Includes role metadata in token
 * - Strictly disables video (audio-only)
 */
router.post("/token", async (req, res): Promise<any> => {
  const { roomName, participantName, participantId } = req.body;

  if (!roomName || !participantName || !participantId) {
    return res.status(400).json({
      error: "roomName, participantName, and participantId are required",
    });
  }

  try {
    // 1. Verify participantId exists in database
    let userRole: "student" | "teacher" | null = null;
    let userName = participantName;

    // Check if participant is a student
    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, participantId))
      .limit(1);

    if (student.length > 0) {
      userRole = "student";
      userName = student[0].name;
    } else {
      // Check if participant is a teacher
      const teacher = await db
        .select()
        .from(teachers)
        .where(eq(teachers.id, participantId))
        .limit(1);

      if (teacher.length > 0) {
        userRole = "teacher";
        userName = teacher[0].name;
      }
    }

    // If user not found in database, reject
    if (!userRole) {
      return res.status(403).json({
        error: "Participant not found in database",
        message: "Only registered students and teachers can join sessions",
      });
    }

    // 2. Get LiveKit credentials
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("LiveKit credentials not configured");
      return res.status(500).json({
        error: "LiveKit credentials not configured",
      });
    }

    // 3. Create access token with metadata
    const at = new LiveKit.AccessToken(apiKey, apiSecret, {
      identity: participantId,
      name: userName,
      metadata: JSON.stringify({
        role: userRole,
        userId: participantId,
        userName: userName,
      }),
    });

    // 4. Grant permissions - AUDIO ONLY, NO VIDEO
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true, // CRITICAL: Required for hand-raise signaling
    });

    const token = await at.toJwt();

    return res.json({
      token,
      roomName,
      url:
        process.env.LIVEKIT_URL ||
        "wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud",
      metadata: {
        role: userRole,
        userName: userName,
      },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).json({
      error: "Failed to generate token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/sessions/create
 * Create a new session
 * - Automatically sets hostType and sessionCategory based on context
 * - For testRequest-based sessions: hostType='interviewer', sessionCategory='placement_test'
 * - For regular sessions: hostType='teacher', sessionCategory='regular_class'
 */
router.post("/create", async (req, res): Promise<any> => {
  const {
    teacherId,
    sectionId,
    sessionNumber,
    startTime,
    endTime,
    isFromTestRequest,
    testRequestId,
  } = req.body;

  if (!teacherId || !sectionId || !sessionNumber || !startTime || !endTime) {
    return res.status(400).json({
      error:
        "teacherId, sectionId, sessionNumber, startTime, and endTime are required",
    });
  }

  try {
    // Verify teacher exists
    const [teacher] = await db
      .select()
      .from(teachers)
      .where(eq(teachers.id, teacherId))
      .limit(1);

    if (!teacher) {
      return res.status(404).json({
        error: "Teacher not found",
      });
    }

    // Determine hostType and sessionCategory
    let hostType: "teacher" | "interviewer" = "teacher";
    let sessionCategory: "regular_class" | "placement_test" = "regular_class";

    if (isFromTestRequest === true) {
      // Session created from testRequest - set as interviewer/placement_test
      hostType = "interviewer";
      sessionCategory = "placement_test";
    } else if (teacher.role === "interviewer") {
      // Teacher is actually an interviewer
      hostType = "interviewer";
      sessionCategory = "placement_test";
    }

    // Generate session ID
    const sessionId = `session_${teacherId}_${Date.now()}`;

    // Create session
    const newSession = await db
      .insert(sessions)
      .values({
        id: sessionId,
        teacherId,
        sectionId,
        sessionNumber,
        hostType,
        sessionCategory,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "scheduled",
        isAudioOnly: true,
        canShareScreen: false,
        attendance: [],
        adminMetrics: {
          isTeacherLate: false,
          teacherTotalActiveMinutes: 0,
          systemCalculatedStatus: "pending",
          incidentReports: [],
          sessionCategory,
        },
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      session: newSession[0],
      metadata: {
        hostType,
        sessionCategory,
        isFromTestRequest: isFromTestRequest || false,
        testRequestId: testRequestId || null,
      },
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return res.status(500).json({
      error: "Failed to create session",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
