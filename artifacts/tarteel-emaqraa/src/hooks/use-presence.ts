import { useEffect } from "react";
import { db_realtime } from "@/lib/firebase"; // تأكدي من استيراد نسخة الـ Realtime DB
import { ref, onValue, set, onDisconnect, serverTimestamp } from "firebase/database";

export function usePresence(userId: string, role: string, sessionId?: string) {
  useEffect(() => {
    if (!userId) return;

    // تحديد المسار: إذا كانت داخل حصة سجلها في الجلسة، وإلا سجلها كحالة عامة
    const path = sessionId 
      ? `sessions/${sessionId}/attendance/${userId}` 
      : `status/${userId}`;
      
    const userStatusRef = ref(db_realtime, path);
    const connectedRef = ref(db_realtime, ".info/connected");

    return onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // عند الاتصال: تحديث الحالة تلقائياً
        set(userStatusRef, {
          id: userId,
          role: role,
          status: "online",
          lastSeen: serverTimestamp(),
          ...(sessionId && { 
            joinTime: serverTimestamp(), 
            attendanceStatus: "present",
            isAutoVerified: true 
          })
        });

        // عند الانقطاع المفاجئ (إغلاق المتصفح أو إنترنت): التحديث تلقائياً
        onDisconnect(userStatusRef).update({
          status: "offline",
          lastSeen: serverTimestamp(),
          leaveTime: serverTimestamp()
        });
      }
    });
  }, [userId, sessionId]);
}