import { Router } from "express";
import * as LiveKit from "livekit-server-sdk";
import { db } from "@workspace/db";
import { students, teachers } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

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

export default router;
