# Detailed Code Changes - LiveKit Migration

## File 1: `artifacts/api-server/src/routes/sessions.ts` (NEW FILE)

```typescript
import { Router } from "express";
import { AccessToken } from "livekit-server-sdk";

const router = Router();

/**
 * POST /api/sessions/token
 * Generate LiveKit access token for joining a room
 */
router.post("/token", async (req, res): Promise<any> => {
  const { roomName, participantName, participantId } = req.body;

  if (!roomName || !participantName) {
    return res.status(400).json({
      error: "roomName and participantName are required",
    });
  }

  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("LiveKit credentials not configured");
      return res.status(500).json({
        error: "LiveKit credentials not configured",
      });
    }

    // Create access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantId || participantName,
      name: participantName,
    });

    // Grant permissions
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return res.json({
      token,
      roomName,
      url:
        process.env.LIVEKIT_URL ||
        "wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud",
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).json({
      error: "Failed to generate token",
    });
  }
});

export default router;
```

---

## File 2: `artifacts/api-server/src/routes/index.ts` (UPDATE)

**BEFORE:**

```typescript
import { Router, Request, Response, NextFunction } from "express";
import authRouter from "./auth";

const router = Router();

// ... middleware code ...

router.use("/auth", authRouter);

// ... admin routes ...

export default router;
```

**AFTER:**

```typescript
import { Router, Request, Response, NextFunction } from "express";
import authRouter from "./auth";
import sessionsRouter from "./sessions"; // NEW IMPORT

const router = Router();

// ... middleware code ...

router.use("/auth", authRouter);
router.use("/sessions", sessionsRouter); // NEW ROUTE

// ... admin routes ...

export default router;
```

---

## File 3: `lib/api-spec/openapi.yaml` (UPDATE)

**ADD THIS SECTION** after the `/auth/register/admin` endpoint (around line 107):

```yaml
# --- مسارات الجلسات (Sessions) ---
/sessions/token:
  post:
    operationId: getSessionToken
    tags: [sessions]
    summary: توليد رمز LiveKit للانضمام إلى غرفة صوتية
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [roomName, participantName]
            properties:
              roomName:
                type: string
                description: "اسم الغرفة (مثل: class_a, sec_1)"
              participantName:
                type: string
                description: "اسم المشارك"
              participantId:
                type: string
                description: "معرف المشارك (اختياري)"
    responses:
      "200":
        description: تم توليد الرمز بنجاح
        content:
          application/json:
            schema:
              type: object
              properties:
                token:
                  type: string
                  description: "رمز JWT للوصول"
                roomName:
                  type: string
                url:
                  type: string
                  description: "رابط خادم LiveKit"
      "400":
        description: بيانات مفقودة
      "500":
        description: خطأ في توليد الرمز
```

---

## File 4: `artifacts/tarteel-emaqraa/src/pages/live-class.tsx` (MAJOR REFACTOR)

**BEFORE (Lines 1-30):**

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  LogOut,
  Settings,
  Monitor,
  MessageSquare,
  Hand,
  Video,
  VideoOff,
  Users,
  Maximize,
  ShieldCheck,
} from "lucide-react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

const APP_ID = "YOUR_AGORA_APP_ID";
```

**AFTER (Lines 1-30):**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  LogOut,
  Settings,
  Monitor,
  MessageSquare,
  Hand,
  Video,
  VideoOff,
  Users,
  Maximize,
  ShieldCheck,
} from "lucide-react";
import { Room, RoomEvent } from "livekit-client";
import {
  LiveKitRoom,
  useLocalParticipant,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL ||
  "wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud";
```

**BEFORE (Lines 103-169):**

```typescript
export default function LiveClass({ roomId }: { roomId?: string }) {
  const { user } = useAuth() as any;
  const params = useParams();
  const channelId = roomId || params.id;
  const [, setLocation] = useLocation();

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const client = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrack = useRef<IMicrophoneAudioTrack | null>(null);

  const currentStudents = channelId
    ? fakeStudentsByClass[channelId] || fakeStudentsByClass["class_a"]
    : [];

  useEffect(() => {
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    if (channelId) {
      handleJoin(channelId);
    }
    return () => {
      handleLeave();
    };
  }, [channelId]);

  const handleJoin = async (name: string) => {
    try {
      await client.current?.join(
        APP_ID,
        name,
        null,
        user?.id || Math.floor(Math.random() * 10000),
      );
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current?.publish(localAudioTrack.current);
      setActiveRoom(name);
    } catch (err) {
      console.error("Agora Join Error:", err);
    }
  };

  const handleLeave = async () => {
    try {
      localAudioTrack.current?.stop();
      localAudioTrack.current?.close();
      await client.current?.leave();
      setActiveRoom(null);
      setLocation(
        user?.role === "student" ? "/dashboard/student" : "/dashboard/teacher",
      );
    } catch (err) {
      console.error("Leave Error:", err);
    }
  };

  const toggleMic = async () => {
    if (localAudioTrack.current) {
      const newMuteState = !isMuted;
      await localAudioTrack.current.setEnabled(!newMuteState);
      setIsMuted(newMuteState);
    }
  };
```

**AFTER (Lines 103-200):**

```typescript
export default function LiveClass({ roomId }: { roomId?: string }) {
  const { user } = useAuth() as any;
  const params = useParams();
  const channelId = roomId || params.id || "default_room";
  const [, setLocation] = useLocation();

  const [token, setToken] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string>("");

  const currentStudents = channelId
    ? fakeStudentsByClass[channelId] || fakeStudentsByClass["class_a"]
    : [];

  // Fetch LiveKit token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsConnecting(true);
        const response = await fetch(`${API_BASE_URL}/api/sessions/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: channelId,
            participantName: user?.name || "Guest",
            participantId: user?.id || `guest_${Date.now()}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get session token");
        }

        const data = await response.json();
        setToken(data.token);
        setError("");
      } catch (err: any) {
        console.error("Token fetch error:", err);
        setError(err.message || "Failed to connect to session");
      } finally {
        setIsConnecting(false);
      }
    };

    if (user) {
      fetchToken();
    }
  }, [channelId, user]);

  const handleDisconnect = () => {
    setLocation(
      user?.role === "student" ? "/dashboard/student" : "/dashboard/teacher"
    );
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-tarteel-maroon"></div>
          <p className="text-white font-semibold">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h2 className="text-white text-xl font-bold">Connection Error</h2>
          <p className="text-slate-400">{error || "Unable to join session"}</p>
          <Button onClick={handleDisconnect} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={handleDisconnect}
      className="h-screen"
    >
      <LiveClassContent
        channelId={channelId}
        currentStudents={currentStudents}
        user={user}
        onLeave={handleDisconnect}
      />
    </LiveKitRoom>
  );
}

// Separate component to use LiveKit hooks
function LiveClassContent({
  channelId,
  currentStudents,
  user,
  onLeave
}: {
  channelId: string;
  currentStudents: any[];
  user: any;
  onLeave: () => void;
}) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();

  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const isMuted = localParticipant?.isMicrophoneEnabled === false;

  const toggleMic = () => {
    localParticipant?.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };

  const toggleVideo = () => {
    const newState = !isVideoOff;
    setIsVideoOff(newState);
    localParticipant?.setCameraEnabled(!newState);
  };
```

**KEEP THE REST OF THE UI CODE THE SAME** - Just update the control buttons to use the new functions:

```typescript
  // In the footer controls section (around line 370-395), update:

  <Button
    size="lg"
    variant={isMuted ? "destructive" : "secondary"}
    className={`rounded-2xl w-14 h-14 p-0 shadow-lg ${!isMuted && "bg-slate-800 text-white hover:bg-slate-700 border border-white/5"}`}
    onClick={toggleMic}
  >
    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
  </Button>

  <Button
    size="lg"
    variant={isVideoOff ? "destructive" : "secondary"}
    className={`rounded-2xl w-14 h-14 p-0 shadow-lg ${!isVideoOff && "bg-slate-800 text-white hover:bg-slate-700 border border-white/5"}`}
    onClick={toggleVideo}
  >
    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
  </Button>

  // Update Leave button:
  <Button
    variant="destructive"
    className="font-bold px-6 rounded-xl"
    onClick={onLeave}
  >
    <LogOut size={18} className="mr-2" /> Leave
  </Button>
```

---

## Summary of Changes

### Backend (3 files):

1. ✅ `.env` - Added LiveKit credentials
2. 🆕 `routes/sessions.ts` - New token generation endpoint
3. ✏️ `routes/index.ts` - Register sessions router
4. ✏️ `openapi.yaml` - Add API documentation

### Frontend (1 file):

1. ✏️ `live-class.tsx` - Complete refactor to use LiveKit

### Dependencies to Install:

- Backend: `livekit-server-sdk`
- Frontend: `@livekit/components-react`, `livekit-client`

---

**Ready to proceed?** Type "yes" to install dependencies and apply all changes.
