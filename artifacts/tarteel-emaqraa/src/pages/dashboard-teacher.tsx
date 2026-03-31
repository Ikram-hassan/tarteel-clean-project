// لوحة تحكم المعلم - إدارة الفصول والطلاب ومتابعة التقدم
import { useState } from "react";
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
  CheckCircle2,
  XCircle,
  PlayCircle,
  Clock,
  Bell,
  Calendar,
  Star,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const classes = [
  { time: "08:00 AM", group: "Group A — Hifz", level: "Intermediate L3", students: 5, active: false },
  { time: "10:30 AM", group: "Group C — Tajweed", level: "Beginner", students: 5, active: false },
  { time: "02:00 PM", group: "Group B — Saba'", level: "Intermediate L1", students: 5, active: true },
  { time: "04:30 PM", group: "Ijaza Track", level: "Advanced", students: 3, active: false },
];

const students = [
  { name: "Omar Ali", level: "Intermediate L3", parts: 15, attendance: 96, alert: true },
  { name: "Fatima Noor", level: "Intermediate L2", parts: 10, attendance: 91, alert: false },
  { name: "Ahmed Hassan", level: "Beginner", parts: 0, attendance: 88, alert: false },
  { name: "Khadija Said", level: "Intermediate L3", parts: 15, attendance: 100, alert: true },
  { name: "Yusuf Ibrahim", level: "Advanced L1", parts: 30, attendance: 85, alert: false },
];

export default function TeacherDashboard() {
  const { dir } = useLanguage();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Record<string, boolean>>({ "Omar Ali": true, "Khadija Said": true });

  const dismiss = (name: string) =>
    setAlerts((prev) => ({ ...prev, [name]: false }));

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* رأس الصفحة */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-tarteel-maroon text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-tarteel-maroon">
              Welcome, {user?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">
                <BookOpen size={12} className="mr-1" /> Teacher
              </Badge>
              <span className="text-sm text-muted-foreground">Tuesday — 4 sessions scheduled</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* إحصائيات سريعة */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "My Students", value: "20", color: "text-tarteel-maroon" },
              { icon: PlayCircle, label: "Today's Classes", value: "4", color: "text-[#E07B39]" },
              { icon: CheckCircle2, label: "Avg Attendance", value: "92%", color: "text-green-600" },
              { icon: Bell, label: "Pending Alerts", value: Object.values(alerts).filter(Boolean).length.toString(), color: "text-tarteel-gold" },
            ].map((s, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <s.icon size={18} className={s.color} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* فصول اليوم (حد أقصى 4) */}
          <motion.div variants={item}>
            <h2 className="text-lg font-bold text-tarteel-maroon mb-4 flex items-center gap-2">
              <Clock size={18} /> Today's Sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {classes.map((cls, i) => (
                <Card key={i} className={`shadow-md hover:shadow-lg transition-all ${cls.active ? "border-2 border-green-400" : "hover:border-tarteel-gold"}`}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs bg-tarteel-maroon/10 text-tarteel-maroon font-bold px-2 py-1 rounded-full">
                        {cls.time}
                      </span>
                      {cls.active && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold mb-1">{cls.group}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{cls.level}</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      <Users size={11} className="inline mr-1" /> {cls.students} Students
                    </p>
                    <Button asChild size="sm" className={`w-full ${cls.active ? "bg-green-600 hover:bg-green-700" : "bg-tarteel-maroon hover:bg-tarteel-maroon/90"} text-white`}>
                      <Link href="/live-class">
                        <PlayCircle size={14} className="mr-1" />
                        {cls.active ? "Resume Class" : "Start Class"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* تنبيهات ترقية الطلاب */}
          {Object.values(alerts).some(Boolean) && (
            <motion.div variants={item}>
              <Card className="shadow-md border-tarteel-gold/40 bg-tarteel-gold/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-tarteel-maroon text-base">
                    <Bell size={18} className="text-tarteel-gold" /> Student Level Progression Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {students
                    .filter((s) => s.alert && alerts[s.name])
                    .map((s, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-tarteel-gold/30 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-tarteel-gold/20 flex items-center justify-center font-bold text-tarteel-maroon text-sm">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{s.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Ready to advance from {s.level} — {s.parts} Ajza' memorized
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => dismiss(s.name)} data-testid={`button-reject-${s.name}`}>
                            <XCircle size={14} className="mr-1 text-red-500" /> Reject
                          </Button>
                          <Button size="sm" className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white" onClick={() => dismiss(s.name)} data-testid={`button-approve-${s.name}`}>
                            <CheckCircle2 size={14} className="mr-1" /> Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* جدول الطلاب */}
          <motion.div variants={item}>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-tarteel-maroon text-base">
                  <Users size={18} /> My Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 font-semibold text-muted-foreground">Student</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Level</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Hifz Progress</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Attendance</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Master</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {students.map((s, i) => (
                        <tr key={i} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-3 font-medium">{s.name}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="text-xs border-tarteel-maroon/30 text-tarteel-maroon">
                              {s.level}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#E07B39] rounded-full"
                                  style={{ width: `${(s.parts / 30) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{s.parts}/30</span>
                            </div>
                          </td>
                          <td className={`py-3 font-bold ${s.attendance >= 90 ? "text-green-600" : "text-red-500"}`}>
                            {s.attendance}%
                          </td>
                          <td className="py-3">
                            <Button size="sm" variant="ghost" className="text-tarteel-gold h-7 px-2" title="Assign as Master Student">
                              <Star size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* التقويم الأسبوعي */}
          <motion.div variants={item}>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-tarteel-maroon text-base">
                  <Calendar size={18} /> Weekly Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                    <div key={i} className={`rounded-lg p-2 ${i === 2 ? "bg-tarteel-maroon text-white" : "bg-secondary"}`}>
                      <p className="font-bold text-xs">{d}</p>
                      <p className={`text-lg font-bold mt-1 ${i === 2 ? "text-white" : "text-tarteel-maroon"}`}>
                        {18 + i}
                      </p>
                      {[0, 1, 2, 3, 4].includes(i) && (
                        <div className={`mt-1 text-xs ${i === 2 ? "text-tarteel-gold" : "text-[#E07B39]"}`}>4 cls</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
