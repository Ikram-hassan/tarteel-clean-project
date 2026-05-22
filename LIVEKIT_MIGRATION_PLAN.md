# LiveKit Migration Plan - Changes Preview

## Overview

Migrating from Agora RTC to LiveKit for voice session functionality.

---

## 1. Backend Changes

### A. Install LiveKit Server SDK

```bash
cd artifacts/api-server
pnpm add livekit-server-sdk
```

### B. Create Session Routes (`artifacts/api-server/src/routes/sessions.ts`)

**NEW FILE** - Will create a session controller with LiveKit token generation:

- Endpoint: `POST /api/sessions/token`
- Generates JWT token using LIVEKIT_API_KEY and LIVEKIT_API_SECRET
- Returns token + room name for frontend to join

### C. Update Routes Index (`artifacts/api-server/src/routes/index.ts`)

- Import and register the new sessions router
- Add route: `/sessions` → sessionsRouter

---

## 2. Frontend Changes

### A. Install LiveKit React Components

```bash
cd artifacts/tarteel-emaqraa
pnpm add @livekit/components-react livekit-client
```

### B. Update `live-class.tsx` (Major Refactor)

**CHANGES:**

- Remove Agora imports and replace with LiveKit
- Remove `APP_ID` constant (no longer needed)
- Fetch LiveKit token from backend API
- Use LiveKit's `useRoom()` hook for connection
- Use `useLocalParticipant()` for mic control
- Use `useParticipants()` for participant list
- Keep existing UI structure (minimal visual changes)

**KEY DIFFERENCES:**

- Agora: Manual client creation + track management
- LiveKit: React hooks handle everything automatically
- Simpler code, better React integration

---

## 3. Environment Variables

### Backend (`.env` and `artifacts/api-server/.env`)

✅ Already added:

```
LIVEKIT_URL=wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud
LIVEKIT_API_KEY=APIWcGGRGSepZPC
LIVEKIT_API_SECRET=EfAqsp4CjHRETdeoj9WZrXEGsBWCaApDcg4Dfx3VwIYB
```

### Frontend (`.env`)

✅ Already added:

```
VITE_LIVEKIT_URL=wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud
```

---

## 4. API Spec Update (`lib/api-spec/openapi.yaml`)

Add new endpoint definition:

```yaml
/sessions/token:
  post:
    operationId: getSessionToken
    summary: Generate LiveKit token for joining a session
    requestBody:
      roomName: string
      participantName: string
    responses:
      200:
        token: string
        roomName: string
```

---

## 5. Testing Checklist

- [ ] Backend generates valid LiveKit tokens
- [ ] Frontend connects to LiveKit room
- [ ] Microphone works by default
- [ ] Mute/unmute functionality works
- [ ] Participant list displays correctly
- [ ] Leave room functionality works
- [ ] Multiple participants can join same room

---

## Next Steps

1. Show detailed code diffs for each file
2. Get your approval
3. Install dependencies
4. Apply all changes
5. Test the implementation

Ready to proceed with detailed diffs?
