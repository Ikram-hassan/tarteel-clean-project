"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Monitor,
  ArrowRightCircle,
  Activity,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CLASSES = [
  { id: "class_a", name: "Class A", description: "Hafiz Level" },
  { id: "class_b", name: "Class B", description: "Intermediate" },
  { id: "class_c", name: "Class C", description: "Beginners" },
  { id: "class_d", name: "Class D", description: "Tajweed Rules" },
];

export default function TeacherDashboard() {
  const { dir, t } = useLanguage();
  const { user } = useAuth() as any;
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // State for students data
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // التحقق مما إذا كان المستخدم محاوراً (Interviewer)
  const isInterviewer = user?.role === "interviewer";

  // محاكاة حالة الحضور - تعتمد على الرتبة (المحاور يرى 3 طلاب والمعلم يرى 5)
  const waitingCount = isInterviewer ? 3 : 5;

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to load students data. Please try again later.",
          variant: "destructive",
        });
        // Set empty array on error to prevent crashes
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ${isInterviewer ? "bg-tarteel-gold ring-tarteel-gold/10" : "bg-tarteel-maroon ring-tarteel-maroon/10"}`}
            >
              {isInterviewer ? (
                <ShieldCheck size={32} />
              ) : (
                <UserCheck size={32} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {t("welcomeBack")}, {user?.name || "User"}
              </h1>
              <div className="flex gap-2 mt-1">
                <Badge
                  className={`${isInterviewer ? "bg-tarteel-gold" : "bg-tarteel-maroon"} text-white px-3 py-1 font-bold border-none`}
                >
                  {isInterviewer ? "ACADEMIC INTERVIEWER" : "MAIN TEACHER"}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500 text-green-600 font-bold bg-green-50 uppercase text-[10px]"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Session Control Active
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          {/* Section: Active Rooms Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-900 rounded-lg shadow-lg">
                <Monitor className="text-tarteel-gold" size={20} />
              </div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
                Available Learning Rooms
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CLASSES.map((cls) => (
                <motion.div key={cls.id} variants={item}>
                  <Card className="group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-900 group-hover:bg-tarteel-maroon transition-colors p-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-black text-white tracking-widest uppercase">
                          {cls.name}
                        </CardTitle>
                        <Activity
                          size={14}
                          className="text-green-400 animate-pulse"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center mb-6">
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-4xl font-black ${isInterviewer ? "text-tarteel-gold" : "text-tarteel-maroon"}`}
                          >
                            {waitingCount}
                          </span>
                          <span className="text-lg font-bold text-slate-300">
                            / {waitingCount}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                          Students in Waiting Room
                        </p>
                      </div>

                      <Button
                        className={`w-full h-12 ${isInterviewer ? "bg-tarteel-gold shadow-tarteel-gold/20" : "bg-tarteel-maroon shadow-tarteel-maroon/20"} hover:opacity-90 text-white font-black rounded-2xl transition-all group-hover:scale-[1.02] shadow-lg`}
                        onClick={() => setLocation(`/live-class/${cls.id}`)}
                      >
                        {isInterviewer ? "START INTERVIEW" : "OPEN CLASSROOM"}{" "}
                        <ArrowRightCircle className="ml-2" size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section: Live Attendance & Reports */}
          <motion.section variants={item}>
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b bg-white p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="text-tarteel-maroon" size={22} />
                  <div>
                    <CardTitle className="text-lg font-black text-slate-800">
                      Connection Monitor
                    </CardTitle>
                    <p className="text-xs text-slate-400 font-medium italic">
                      Tracking live students across your active sessions
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Export Attendance
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-black text-slate-500 uppercase text-[10px] px-6 py-4">
                          Student Name
                        </TableHead>
                        <TableHead className="font-black text-slate-500 uppercase text-[10px]">
                          Session Name
                        </TableHead>
                        <TableHead className="font-black text-slate-500 uppercase text-[10px]">
                          Signal Strength
                        </TableHead>
                        <TableHead className="font-black text-slate-500 uppercase text-[10px] text-right px-6">
                          Live Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-8 h-8 border-4 border-tarteel-maroon border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm font-medium text-slate-500">
                                Loading students...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <span className="text-sm font-medium text-slate-500">
                              No students online at the moment
                            </span>
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((s) => (
                          <TableRow
                            key={s.id}
                            className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                          >
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-tarteel-maroon/10 flex items-center justify-center text-[10px] font-black text-tarteel-maroon">
                                  {s.name?.charAt(0) || "S"}
                                </div>
                                <span className="font-bold text-slate-700 text-sm">
                                  {s.name || "Unknown Student"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[9px] px-3 py-1">
                                {CLASSES.find((c) => c.id === s.classId)
                                  ?.name || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4].map((b) => (
                                  <div
                                    key={b}
                                    className={`w-1 h-3 rounded-full ${b < 4 ? "bg-green-500" : "bg-slate-200"}`}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right px-6">
                              <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                {s.status === "online" ? "Live Now" : "Offline"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
