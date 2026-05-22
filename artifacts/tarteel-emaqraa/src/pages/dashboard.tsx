"use client";

import { useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Shield,
  Calendar,
  Clock,
  BookMarked,
  Mic2,
  ClipboardCheck,
  Radio,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { AchievementStatsBar } from "@/components/dashboard/AchievementStatsBar";
import { LiveClassroomHub } from "@/components/dashboard/LiveClassroomHub";
import { StudentManagementTable } from "@/components/dashboard/StudentManagementTable";
import { AppointmentMessagingCenter } from "@/components/dashboard/AppointmentMessagingCenter";
import { METON_TEXTS } from "@/constants/quran-specializations";

export default function Dashboard() {
  const { t, dir } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // إذا انتهى التحميل والمستخدم غير مسجل، يتم توجيهه لصفحة التسجيل
    if (!isLoading && !isAuthenticated) {
      setLocation("/register");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // حالة التحميل لتجنب الوميض أو الصفحة البيضاء
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tarteel-maroon"></div>
      </div>
    );
  }

  if (!user) return null;

  const role = user.role;
  const teacherType = (user as any).teacherType;
  const interviewerType = (user as any).interviewerType;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2">
              {t("dashboardTitle") || "لوحة التحكم"}
            </h1>
            <p className="text-muted-foreground">
              {t("welcomeBack") || "مرحباً بعودتك"}،{" "}
              <span className="font-bold text-slate-800">{user.name}</span>
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full border shadow-sm flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                role === "admin"
                  ? "bg-red-500"
                  : role === "teacher"
                    ? "bg-blue-500"
                    : role === "interviewer"
                      ? "bg-purple-500"
                      : "bg-green-500"
              }`}
            />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
              {role} {t("panel") || "لوحة"}
            </span>
          </div>
        </div>

        {/* --- 1. INTERVIEWER DASHBOARD --- */}
        {role === "interviewer" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Achievement Stats Bar */}
            <AchievementStatsBar
              userRole="interviewer"
              stats={{
                totalStudents: 20,
                activeClasses: 4,
                completedSessions: 148,
                averageRating: 4.9,
                workHours: 180,
                certifications: 25,
              }}
            />

            {/* Section 2: Live Classroom Hub with Placement Decision Tree */}
            <LiveClassroomHub
              userRole="interviewer"
              interviewerType={(user as any).interviewerType || "placement"}
              onJoinRoom={(roomId) => console.log("Joined room:", roomId)}
              onLeaveRoom={() => console.log("Left room")}
            />

            {/* Section 3: Student Management Table */}
            <StudentManagementTable
              onRequestTest={(studentId) =>
                console.log("Test requested for:", studentId)
              }
              onViewDetails={(studentId) =>
                console.log("View details:", studentId)
              }
            />

            {/* Section 4: Appointment & Messaging Center */}
            <AppointmentMessagingCenter />
          </div>
        )}

        {/* --- 2. STUDENT DASHBOARD --- */}
        {role === "student" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-t-4 border-tarteel-maroon shadow-md">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <BookOpen className="text-tarteel-maroon" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      My Courses
                    </p>
                    <h3 className="text-2xl font-bold">3 Active</h3>
                  </div>
                </CardContent>
              </Card>
              {/* أضف المزيد من الكروت للطالب هنا */}
            </div>
          </div>
        )}

        {/* --- 3. TEACHER DASHBOARD --- */}
        {role === "teacher" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section 1: Dynamic Achievement Stats Bar based on Teacher Type */}
            {teacherType === "meton" ? (
              <Card className="bg-gradient-to-br from-tarteel-maroon via-[#5c0000] to-tarteel-maroon border-2 border-tarteel-gold shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-tarteel-gold flex items-center gap-3">
                    <BookMarked className="w-8 h-8" />
                    Meton Teacher Dashboard - 6 Sacred Texts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {METON_TEXTS.map((text) => (
                      <div
                        key={text.id}
                        className="group relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-tarteel-gold/30 hover:border-tarteel-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 cursor-pointer"
                      >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                          {text.icon}
                        </div>
                        <h3 className="text-lg font-bold text-tarteel-gold mb-1">
                          {text.nameAr}
                        </h3>
                        <p className="text-xs text-white/70">{text.nameEn}</p>
                        <div className="absolute inset-0 bg-tarteel-gold/0 group-hover:bg-tarteel-gold/10 rounded-2xl transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : teacherType === "intermediate" ? (
              <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-2 border-blue-400 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <BookOpen className="w-8 h-8" />
                    Intermediate Teacher - Juz Progress Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-400/50">
                    <div className="text-center mb-4">
                      <p className="text-blue-200 text-sm mb-2">
                        Your Specialization
                      </p>
                      <h3 className="text-3xl font-bold text-white">
                        {(user as any).juzRange
                          ? `${(user as any).juzRange} Juz`
                          : "Juz Range"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white/20 p-4 rounded-xl text-center">
                        <p className="text-blue-200 text-xs mb-1">Students</p>
                        <p className="text-2xl font-bold text-white">45</p>
                      </div>
                      <div className="bg-white/20 p-4 rounded-xl text-center">
                        <p className="text-blue-200 text-xs mb-1">
                          Active Classes
                        </p>
                        <p className="text-2xl font-bold text-white">8</p>
                      </div>
                      <div className="bg-white/20 p-4 rounded-xl text-center">
                        <p className="text-blue-200 text-xs mb-1">Completed</p>
                        <p className="text-2xl font-bold text-white">120</p>
                      </div>
                      <div className="bg-white/20 p-4 rounded-xl text-center">
                        <p className="text-blue-200 text-xs mb-1">Rating</p>
                        <p className="text-2xl font-bold text-white">4.8⭐</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AchievementStatsBar
                userRole="teacher"
                teacherType={teacherType || "beginner"}
                stats={{
                  totalStudents: 45,
                  activeClasses: 8,
                  completedSessions: 120,
                  averageRating: 4.8,
                  workHours: 240,
                  certifications: 15,
                }}
              />
            )}

            {/* Section 2: Live Classroom Hub */}
            <LiveClassroomHub
              userRole="teacher"
              onJoinRoom={(roomId) => console.log("Joined room:", roomId)}
              onLeaveRoom={() => console.log("Left room")}
            />

            {/* Section 3: Student Management Table */}
            <StudentManagementTable
              onRequestTest={(studentId) =>
                console.log("Test requested for:", studentId)
              }
              onViewDetails={(studentId) =>
                console.log("View details:", studentId)
              }
            />

            {/* Section 4: Appointment & Messaging Center */}
            <AppointmentMessagingCenter />
          </div>
        )}

        {/* --- 4. ADMIN DASHBOARD --- */}
        {role === "admin" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-900 text-white">
                <CardContent className="p-6">
                  <Shield className="mb-2 text-tarteel-gold" />
                  <p className="text-xs text-slate-400">System Status</p>
                  <h3 className="text-xl font-bold">All Systems Go</h3>
                </CardContent>
              </Card>
              {/* أضف اختصارات الإدارة هنا */}
            </div>
          </div>
        )}
      </main>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
