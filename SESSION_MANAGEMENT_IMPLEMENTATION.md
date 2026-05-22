# Session Management Implementation - Role-Based Filtering

## Overview

This document summarizes the implementation of role-based session management that separates teacher sessions from interviewer sessions based on `hostType` and `sessionCategory` fields.

## Changes Made

### 1. Database Schema Updates

**File:** `lib/db/src/schema/sessions.ts`

Added two new fields to the sessions table:

- `hostType`: Enum field with values `"teacher"` or `"interviewer"` (default: `"teacher"`)
- `sessionCategory`: Enum field with values `"regular_class"` or `"placement_test"` (default: `"regular_class"`)

```typescript
// 🆕 نوع المضيف والفئة (للفصل بين المعلمين والمحاورين)
hostType: text("host_type", { enum: ["teacher", "interviewer"] })
  .default("teacher")
  .notNull(),
sessionCategory: text("session_category", {
  enum: ["regular_class", "placement_test"],
})
  .default("regular_class")
  .notNull(),
```

### 2. Backend API Endpoints

**File:** `artifacts/api-server/src/routes/sessions.ts`

#### A. GET /api/sessions - Role-Based Fetching

Fetches sessions filtered by user role:

- **Teachers**: Returns only sessions where `hostType === 'teacher'` AND `sessionCategory === 'regular_class'`
- **Interviewers**: Returns only sessions where `hostType === 'interviewer'` AND `sessionCategory === 'placement_test'`

**Query Parameters:**

- `userId`: The user's ID
- `userRole`: Either `"teacher"` or `"interviewer"`

**Example Request:**

```
GET /api/sessions?userId=teacher_123&userRole=teacher
```

**Example Response:**

```json
{
  "success": true,
  "sessions": [...],
  "count": 5
}
```

#### B. POST /api/sessions/create - Automatic Session Categorization

Creates a new session with automatic `hostType` and `sessionCategory` assignment:

**Logic:**

1. If `isFromTestRequest === true` → Sets `hostType='interviewer'` and `sessionCategory='placement_test'`
2. If teacher's role is `'interviewer'` → Sets `hostType='interviewer'` and `sessionCategory='placement_test'`
3. Otherwise → Sets `hostType='teacher'` and `sessionCategory='regular_class'`

**Request Body:**

```json
{
  "teacherId": "teacher_123",
  "sectionId": "sec_1",
  "sessionNumber": 1,
  "startTime": "2026-05-23T10:00:00Z",
  "endTime": "2026-05-23T11:00:00Z",
  "isFromTestRequest": true,
  "testRequestId": "test_req_456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session created successfully",
  "session": {...},
  "metadata": {
    "hostType": "interviewer",
    "sessionCategory": "placement_test",
    "isFromTestRequest": true,
    "testRequestId": "test_req_456"
  }
}
```

### 3. Frontend Integration

**File:** `artifacts/tarteel-emaqraa/src/pages/dashboard-unified.tsx`

Added session fetching logic that automatically filters based on logged-in user's role:

```typescript
// Fetch sessions based on user role
useEffect(() => {
  const fetchSessions = async () => {
    if (!user?.id || !user?.role) return;

    setIsLoadingSessions(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sessions?userId=${user.id}&userRole=${user.role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  fetchSessions();
}, [user?.id, user?.role]);
```

## Key Features

### ✅ Role-Based Separation

- Teachers only see regular class sessions
- Interviewers only see placement test sessions
- No cross-contamination of session data

### ✅ Automatic Categorization

- Sessions created from test requests are automatically marked as interviewer/placement_test
- Regular sessions default to teacher/regular_class
- System checks teacher's role to determine correct categorization

### ✅ Frontend Protection

- Dashboard automatically fetches only relevant sessions based on user role
- No manual filtering required in UI components
- Clean separation of concerns

## Database Migration Required

To apply these schema changes to your database, you'll need to:

1. Run database migration to add the new fields:

```bash
cd lib/db
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

2. Update existing sessions (if any) with default values:

```sql
UPDATE sessions
SET host_type = 'teacher',
    session_category = 'regular_class'
WHERE host_type IS NULL;
```

## Testing Checklist

- [ ] Teacher login → Should only see regular_class sessions
- [ ] Interviewer login → Should only see placement_test sessions
- [ ] Create session from testRequest → Should auto-set as interviewer/placement_test
- [ ] Create regular session → Should auto-set as teacher/regular_class
- [ ] Verify no cross-role session visibility

## API Endpoints Summary

| Endpoint               | Method | Purpose                                     | Auth Required |
| ---------------------- | ------ | ------------------------------------------- | ------------- |
| `/api/sessions`        | GET    | Fetch role-filtered sessions                | Yes           |
| `/api/sessions/create` | POST   | Create new session with auto-categorization | Yes           |
| `/api/sessions/token`  | POST   | Generate LiveKit token (existing)           | Yes           |

## Notes

- The `adminMetrics` field in sessions still contains a `sessionCategory` property for backward compatibility
- The new top-level `hostType` and `sessionCategory` fields are the source of truth
- All queries should filter on these top-level fields, not the nested ones
- Frontend components should use the new API endpoint for fetching sessions

## Future Enhancements

1. Add session analytics by category
2. Implement session transfer between teachers/interviewers
3. Add bulk session creation for test requests
4. Create admin dashboard to view all sessions regardless of category
