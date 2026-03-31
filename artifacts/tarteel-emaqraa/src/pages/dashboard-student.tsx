// لوحة تحكم الطالب - مخصصة لعرض مستوى الطالب وتقدمه والجدول الدراسي
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function StudentDashboard() {
  const { dir } = useLanguage();
  const { user } = useAuth();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const attendance = [true, true, true, true, true, false, false];

  const upcomingClasses = [
    { time: "Today, 04:30 PM", subject: "Hifz & Saba' Review", teacher: "Sh. Abdullahi", level: "Intermediate" },
    { time: "Tomorrow, 08:00 AM", subject: "Tajweed Revision", teacher: "Sh. Abdullahi", level: "Beginner" },
    { time: "Thu, 10:00 AM", subject: "Quran Recitation", teacher: "Sh. Abdullahi", level: "Intermediate" },
  ];

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
              Welcome back, {user?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-[#E07B39]/15 text-[#E07B39] border-[#E07B39]/30 font-semibold">
                <GraduationCap size={12} className="mr-1" /> Student
              </Badge>
              <span className="text-sm text-muted-foreground">Intermediate — Level 3</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* الصف الأول: المستوى الحالي + الفصل القادم */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* بطاقة المستوى والتقدم */}
            <Card className="md:col-span-2 shadow-md border-t-4 border-[#E07B39]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-bold text-[#E07B39] uppercase tracking-widest mb-1">Current Level</p>
                    <h2 className="text-2xl font-serif font-bold text-tarteel-maroon">Intermediate — Level 3</h2>
                    <p className="text-sm text-muted-foreground mt-1">Hifz & Review • Ajza' 11–15</p>
                  </div>
                  <Award size={44} className="text-[#E07B39] opacity-20" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Hifz Progress</span>
                    <span className="text-tarteel-maroon font-bold">15 / 30 Ajza'</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-[#E07B39] rounded-full transition-all" style={{ width: "50%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  {[
                    { label: "Attendance", value: "95%" },
                    { label: "Sessions Done", value: "48" },
                    { label: "Trial Days Left", value: "8" },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg font-bold text-tarteel-maroon">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* بطاقة الفصل القادم */}
            <Card className="shadow-md bg-tarteel-maroon text-white border-none">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Next Class</p>
                  <h3 className="text-xl font-bold mb-2">Today, 04:30 PM</h3>
                  <p className="text-white/90 font-medium">Hifz & Saba' Review</p>
                  <p className="text-sm text-tarteel-gold mt-1 flex items-center gap-1">
                    <BookOpen size={12} /> Teacher: Sh. Abdullahi
                  </p>
                </div>
                <Button asChild className="w-full mt-6 bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon font-bold">
                  <Link href="/live-class">
                    <PlayCircle size={16} className="mr-2" /> Join Class
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* الصف الثاني: الحضور + الجدول */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* بطاقة الحضور */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-tarteel-maroon">
                  <Calendar size={18} /> Attendance This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-tarteel-maroon">95%</p>
                    <p className="text-xs text-muted-foreground">Overall</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex gap-2">
                    {weekDays.map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            attendance[i]
                              ? "bg-green-100 text-green-700"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {attendance[i] ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        </div>
                        <span className="text-xs text-muted-foreground">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground border-t pt-2">
                  2 absences remaining before admin alert
                </p>
              </CardContent>
            </Card>

            {/* الفصول القادمة */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-tarteel-maroon">
                  <Clock size={18} /> Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((cls, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <div>
                      <p className="text-xs text-[#E07B39] font-bold">{cls.time}</p>
                      <p className="font-semibold text-sm">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.teacher}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-tarteel-maroon/30 text-tarteel-maroon">
                      {cls.level}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* بطاقة الاشتراك */}
          <motion.div variants={item}>
            <Card className="shadow-md border border-tarteel-gold/40 bg-tarteel-gold/5">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tarteel-gold/20 flex items-center justify-center">
                    <CreditCard className="text-tarteel-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-tarteel-maroon">Free Trial Active</p>
                    <p className="text-sm text-muted-foreground">8 days remaining • After trial: 5 days/week — $20/month</p>
                  </div>
                </div>
                <Button className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white shrink-0">
                  Upgrade Plan
                </Button>
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
