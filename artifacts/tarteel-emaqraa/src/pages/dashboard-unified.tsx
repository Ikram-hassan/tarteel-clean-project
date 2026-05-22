"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { AchievementStatsBar } from "@/components/dashboard/AchievementStatsBar";
import { LiveClassroomHubUnified } from "@/components/dashboard/LiveClassroomHubUnified";
import { StudentManagementTable } from "@/components/dashboard/StudentManagementTable";
import { AppointmentMessagingCenter } from "@/components/dashboard/AppointmentMessagingCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RefreshCw, Loader2 } from "lucide-react";

const API_BASE_URL = "https://tarteel-monorepo-api-server-v6ry.vercel.app";

/**
 * UNIFIED 4-SECTION DASHBOARD
 * Implements the Architect's Override with Maroon (#800000) & Gold (#D4AF37) luxury theme
 *
 * Sections:
 * 1. Stats & Achievements (Top Bar) - with Meton Teacher special icons
 * 2. Live Classroom Hub (Center) - 4 parallel rooms with evaluation system
 * 3. Student Data & Attendance (Bottom Left) - Real-time Firebase connectivity
 * 4. Appointments & Messaging (Bottom Right) - Double-name validation system
 */

export default function UnifiedDashboard() {
  const { dir, t } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Shift Toggle State
  const [currentShift, setCurrentShift] = useState<"shift_1" | "shift_2">(
    "shift_1",
  );
  const [isShiftSwitching, setIsShiftSwitching] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/register");
    }
  }, [isAuthenticated, isLoading, setLocation]);

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
        } else {
          console.error("Failed to fetch sessions:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [user?.id, user?.role]);

  // Handle Shift Toggle
  const handleShiftToggle = async () => {
    setIsShiftSwitching(true);

    // Simulate API call to switch shift data
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newShift = currentShift === "shift_1" ? "shift_2" : "shift_1";
    setCurrentShift(newShift);

    // TODO: Update backend with new active shift
    // await updateUserActiveShift(user.id, newShift);

    setIsShiftSwitching(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-tarteel-maroon" />
      </div>
    );
  }

  if (!user) return null;

  const role = user.role as "teacher" | "interviewer" | "admin";
  const teacherType = (user as any).teacherType;
  const interviewerType = (user as any).interviewerType;
  const registeredShifts = (user as any).registeredShifts || ["shift_1"];
  const hasMultipleShifts = registeredShifts.length > 1;

  // Mock stats - replace with real data from API
  const stats = {
    totalStudents: 45,
    activeClasses: 8,
    completedSessions: 120,
    averageRating: 4.8,
    workHours: 240,
    certifications: 15,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col"
      dir={dir}
    >
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header with Shift Toggle */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">
              {t("welcomeBack") || "Welcome Back"},{" "}
              <span className="text-tarteel-maroon">{user.name}</span>
            </h1>
            <div className="flex gap-2 items-center">
              <Badge className="bg-tarteel-maroon text-white px-4 py-1.5 font-bold border-none uppercase tracking-wide">
                {role === "teacher"
                  ? "Teacher"
                  : role === "interviewer"
                    ? "Interviewer"
                    : "Admin"}
                {teacherType && ` - ${teacherType}`}
                {interviewerType && ` - ${interviewerType}`}
              </Badge>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 font-bold uppercase">
                Live
              </span>
            </div>
          </div>

          {/* Shift Toggle Button (if user has multiple shifts) */}
          {hasMultipleShifts && (
            <Card className="border-2 border-tarteel-gold shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                      Active Shift
                    </p>
                    <p className="text-lg font-black text-tarteel-maroon">
                      {currentShift === "shift_1"
                        ? "Shift 1 (Morning)"
                        : "Shift 2 (Evening)"}
                    </p>
                  </div>
                  <Button
                    onClick={handleShiftToggle}
                    disabled={isShiftSwitching}
                    className="bg-tarteel-gold hover:bg-tarteel-gold/90 text-slate-900 font-bold px-6 h-12 rounded-xl shadow-lg"
                  >
                    {isShiftSwitching ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Switching...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Switch Shift
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 4-SECTION LAYOUT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* SECTION 1: Stats & Achievements (Top Bar) */}
          <section>
            <AchievementStatsBar
              userRole={role}
              teacherType={teacherType}
              stats={stats}
            />
          </section>

          {/* SECTION 2: Live Classroom Hub (Center) */}
          {(role === "teacher" || role === "interviewer") && (
            <section>
              <LiveClassroomHubUnified
                userRole={role}
                teacherType={teacherType}
                interviewerType={interviewerType}
                onJoinRoom={(roomId: string) => {
                  console.log("Joined room:", roomId);
                  setLocation(`/live-class/${roomId}`);
                }}
                onLeaveRoom={() => {
                  console.log("Left room");
                }}
              />
            </section>
          )}

          {/* SECTIONS 3 & 4: Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SECTION 3: Student Data & Attendance (Bottom Left) */}
            <section>
              <StudentManagementTable
                onRequestTest={(studentId) => {
                  console.log("Test requested for:", studentId);
                  // TODO: Send test request to interviewer
                }}
                onViewDetails={(studentId) => {
                  console.log("View details:", studentId);
                  setLocation(`/student/${studentId}`);
                }}
              />
            </section>

            {/* SECTION 4: Appointments & Messaging (Bottom Right) */}
            <section>
              <AppointmentMessagingCenter />
            </section>
          </div>
        </motion.div>

        {/* Shift Data Indicator */}
        {hasMultipleShifts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-tarteel-gold/10 border-2 border-tarteel-gold rounded-2xl"
          >
            <p className="text-sm text-center text-tarteel-maroon font-bold">
              📊 All data displayed is for{" "}
              <span className="underline">
                {currentShift === "shift_1" ? "Shift 1" : "Shift 2"}
              </span>
            </p>
          </motion.div>
        )}
      </main>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
