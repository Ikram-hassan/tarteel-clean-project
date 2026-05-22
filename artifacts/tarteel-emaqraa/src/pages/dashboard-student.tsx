"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePresence } from "@/hooks/use-presence";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Award,
  PlayCircle,
  History,
  LayoutDashboard,
  Clock,
  Timer,
  Lock,
  CheckCircle2,
  BookOpen,
  Mic2,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationContent {
  portal: string;
  welcome: string;
  shift: string;
  sessionTime: string;
  progress: string;
  stage: string;
  completed: string;
  totalSessions: string;
  daysWeek: string;
  status: string;
  active: string;
  pending: string;
  virtualHall: string;
  joinNow: string;
  schedule: string;
  feedback: string;
  noFeedback: string;
  direction: "rtl" | "ltr";
  interview: string;
  startInterview: string;
  registration: string;
  result: string;
  beginner: string;
  notAssigned: string;
  sanadTitle: string;
  juzMap: string;
  tajweedNotes: string;
  makharij: string;
  sifaat: string;
  days: Record<string, string>;
}

export default function StudentDashboard() {
  const { user, isLoading } = useAuth() as any;
  const { language: currentLang } = useLanguage();
  const [, setLocation] = useLocation();

  usePresence(user?.id, "student");

  const userLang = (user?.language || currentLang || "so") as
    | "ar"
    | "en"
    | "so";

  const translations: Record<"ar" | "en" | "so", TranslationContent> = {
    ar: {
      portal: "بوابة الطالب",
      welcome: "السلام عليكم،",
      shift: "وردية",
      sessionTime: "وقت الحصة الحالي",
      progress: "التقدم الأكاديمي",
      stage: "المستوى:",
      completed: "مكتمل",
      totalSessions: "إجمالي الحصص",
      daysWeek: "أيام الأسبوع",
      status: "الحالة",
      active: "نشط",
      pending: "قيد الانتظار",
      virtualHall: "القاعة الافتراضية",
      joinNow: "انضم للحصة الآن",
      schedule: "جدولك الأسبوعي",
      feedback: "آخر ملاحظات المعلم",
      noFeedback: "مرحباً بك! ستبدأ حصصك قريباً بناءً على الوردية المختارة.",
      direction: "rtl",
      interview: "المقابلة",
      startInterview: "ابدأ المقابلة الآن",
      registration: "التسجيل",
      result: "النتيجة",
      beginner: "مبتدئ",
      notAssigned: "غير محدد",
      sanadTitle: "سلسلة السند المتصل",
      juzMap: "خريطة الأجزاء (الختمة)",
      tajweedNotes: "ملاحظات التجويد الفنية",
      makharij: "مخارج الحروف",
      sifaat: "الصفات والغنة",
      days: {
        sat: "سبت",
        sun: "أحد",
        mon: "إثنين",
        tue: "ثلاثاء",
        wed: "أربعاء",
        thu: "خميس",
        fri: "جمعة",
      },
    },
    en: {
      portal: "Student Portal",
      welcome: "Assalamu Alaikum,",
      shift: "Shift",
      sessionTime: "Current Session Time",
      progress: "Academic Progress",
      stage: "Stage:",
      completed: "Completed",
      totalSessions: "Total Sessions",
      daysWeek: "Days per Week",
      status: "Status",
      active: "Active",
      pending: "Pending",
      virtualHall: "Virtual Hall",
      joinNow: "Join Class Now",
      schedule: "Weekly Schedule",
      feedback: "Latest Feedback",
      noFeedback:
        "Welcome! Your classes will start soon based on your selected shift.",
      direction: "ltr",
      interview: "Interview",
      startInterview: "Start Interview Now",
      registration: "Registration",
      result: "Result",
      beginner: "Beginner",
      notAssigned: "Not Assigned",
      sanadTitle: "Connected Sanad Chain",
      juzMap: "Khatmah Juz Grid",
      tajweedNotes: "Technical Tajweed Notes",
      makharij: "Makharij (Articulation)",
      sifaat: "Sifaat & Ghunnah",
      days: {
        sat: "Sat",
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
      },
    },
    so: {
      portal: "Bogga Ardayga",
      welcome: "Assalamu Alaikum,",
      shift: "Xilliga",
      sessionTime: "Waqtiga Fasalka Hadda",
      progress: "Horumarka Waxbarashada",
      stage: "Heerka:",
      completed: "La dhameystiray",
      totalSessions: "Warta Fasallada",
      daysWeek: "Maalmaha Toddobaadka",
      status: "Xaaladda",
      active: "Shaqeeya",
      pending: "Sugitaan",
      virtualHall: "Hoolka Tooska ah",
      joinNow: "Ku biir Fasalka hadda",
      schedule: "Jadwalka Toddobaadka",
      feedback: "Faallooyinkii u dambeeyay",
      noFeedback:
        "Ku soo dhawaaw! Fasalladaadu waxay bilaaban doonaan dhowaan.",
      direction: "ltr",
      interview: "Waraysiga",
      startInterview: "Bilow Waraysiga hadda",
      registration: "Diiwaangelinta",
      result: "Natiijada",
      beginner: "Bilaabe",
      notAssigned: "Lama huraan",
      sanadTitle: "Silsiladda Sanadka",
      juzMap: "Khariidadda Juzaska",
      tajweedNotes: "Xusuus-qorka Tajwiidka",
      makharij: "Makhariijta",
      sifaat: "Sifaadka & Ghunno",
      days: {
        sat: "Sab",
        sun: "Axad",
        mon: "Isniin",
        tue: "Talaado",
        wed: "Arbaco",
        thu: "Khamiis",
        fri: "Jimce",
      },
    },
  };

  const t = translations[userLang] || translations.en;

  const shiftTimeMap: Record<string, string> = {
    sec_1: "06:00 AM - 09:00 AM",
    sec_2: "09:00 AM - 12:00 PM",
    sec_3: "01:00 PM - 04:00 PM",
    sec_4: "04:00 PM - 07:00 PM",
    sec_5: "07:00 PM - 10:00 PM",
  };

  const isAnasVerified =
    user?.isTested === true || (user?.level && user?.level !== "null");
  const preferredDays = user?.selectedDays || [];
  const preferredSections = user?.selectedSections || [];
  const currentShiftTime = shiftTimeMap[preferredSections[0]] || t.notAssigned;

  // Data for Ijaza Features
  const completedJuz = user?.completedJuz || [1, 2, 30]; // Placeholder
  const sanadChain = [
    {
      name: user?.name || "Student",
      role: "Student",
      icon: <UserCheck size={18} />,
    },
    { name: "Teacher Name", role: "Teacher", icon: <Award size={18} /> },
    { name: "Sheikh Al-Maqari", role: "Grand Teacher" },
    { name: "Prophet Muhammad ﷺ", role: "Source", highlight: true },
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-tarteel-maroon" />
      </div>
    );

  return (
    <div
      className="min-h-screen bg-slate-50/50 flex flex-col"
      dir={t.direction}
    >
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!isAnasVerified ? (
            <motion.div
              key="exam-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-10 text-center"
            >
              <section className="bg-white p-8 rounded-3xl shadow-sm border">
                <div className="flex items-center justify-between relative max-w-xl mx-auto">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />
                  {[
                    { id: 1, label: t.registration, done: true },
                    { id: 2, label: t.interview, current: true },
                    { id: 3, label: t.result, locked: true },
                  ].map((step) => (
                    <div
                      key={step.id}
                      className="relative z-10 flex flex-col items-center gap-2"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step.done ? "bg-green-500 text-white" : step.current ? "bg-orange-500 text-white animate-pulse" : "bg-slate-200 text-white"}`}
                      >
                        {step.done ? (
                          <CheckCircle2 size={18} />
                        ) : step.locked ? (
                          <Lock size={14} />
                        ) : (
                          <Timer size={18} />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <h1 className="text-4xl font-black text-slate-800">
                {t.welcome} {user?.name} 👋
              </h1>
              <Button
                onClick={() => setLocation("/live-class/interview_hall")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-16 rounded-2xl font-black shadow-xl"
              >
                {t.startInterview}{" "}
                {t.direction === "rtl" ? (
                  <ArrowLeft className="mr-2" />
                ) : (
                  <ArrowRight className="ml-2" />
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="active-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-tarteel-maroon">
                    <LayoutDashboard size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {t.portal}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-slate-800">
                    {t.welcome} {user?.name}
                  </h1>
                  <div className="flex gap-2 mt-3">
                    <Badge className="bg-tarteel-maroon text-white px-3 py-1">
                      {user?.level || t.beginner}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-500 border-slate-200 uppercase font-bold text-[10px]"
                    >
                      {preferredSections[0]} {t.shift}
                    </Badge>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 bg-tarteel-gold/10 rounded-full flex items-center justify-center text-tarteel-gold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {t.sessionTime}
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {currentShiftTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Grid: Progress & Virtual Hall */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none rounded-[2.5rem] p-8 bg-white shadow-sm relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 opacity-[0.03] text-tarteel-maroon">
                    <Award size={250} />
                  </div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {t.progress}
                      </p>
                      <h2 className="text-3xl font-black text-slate-800">
                        {t.stage} {user?.level || t.beginner}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-tarteel-maroon">
                        {(user?.sessionNumber || 0) > 0 ? "5%" : "0%"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {t.completed}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(user?.sessionNumber || 0) > 0 ? 5 : 0}
                    className="h-3 mb-8"
                  />
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-800">
                        {user?.sessionNumber || 0}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {t.totalSessions}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-800">
                        {preferredDays.length}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {t.daysWeek}
                      </p>
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xl font-black ${user?.paymentStatus === "paid" ? "text-green-600" : "text-orange-500"}`}
                      >
                        {user?.paymentStatus === "paid" ? t.active : t.pending}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {t.status}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-tarteel-maroon text-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl border-none">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <PlayCircle className="text-tarteel-gold" size={28} />
                    </div>
                    <h2 className="text-2xl font-black">{t.virtualHall}</h2>
                  </div>
                  <Button
                    onClick={() =>
                      setLocation(
                        `/live-class/${user?.assignedTeacherId || "general"}`,
                      )
                    }
                    className="bg-tarteel-gold text-slate-900 hover:bg-white w-full rounded-2xl h-14 font-black mt-6"
                  >
                    {t.joinNow}{" "}
                    {t.direction === "rtl" ? (
                      <ArrowLeft className="mr-2" />
                    ) : (
                      <ArrowRight className="ml-2" />
                    )}
                  </Button>
                </Card>
              </div>

              {/* Ijaza Feature: Khatmah Grid & Sanad */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sanad Chain */}
                <Card className="rounded-[2.5rem] p-8 bg-white shadow-sm border-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 text-tarteel-maroon">
                    <History size={80} />
                  </div>
                  <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <History size={18} className="text-tarteel-maroon" />{" "}
                    {t.sanadTitle}
                  </h3>
                  <div className="space-y-5 relative">
                    {sanadChain.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 relative z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.highlight ? "bg-tarteel-gold text-slate-900" : "bg-tarteel-maroon/10 text-tarteel-maroon"}`}
                        >
                          {link.icon || <Award size={14} />}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-black ${link.highlight ? "text-tarteel-maroon" : "text-slate-700"}`}
                          >
                            {link.name}
                          </p>
                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            {link.role}
                          </p>
                        </div>
                        {idx !== sanadChain.length - 1 && (
                          <div
                            className={`absolute top-8 ${t.direction === "rtl" ? "right-4" : "left-4"} w-px h-5 bg-slate-100`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Juz Grid */}
                <Card className="lg:col-span-2 rounded-[2.5rem] p-8 bg-white shadow-sm border-none">
                  <h3 className="font-black text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <BookOpen size={18} className="text-tarteel-maroon" />{" "}
                    {t.juzMap}
                  </h3>
                  <TooltipProvider>
                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(
                        (juz) => {
                          const isDone = completedJuz.includes(juz);
                          return (
                            <Tooltip key={juz}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold cursor-help border transition-colors ${isDone ? "bg-tarteel-gold border-tarteel-gold text-slate-900" : "bg-slate-50 border-slate-100 text-slate-300"}`}
                                >
                                  {juz}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-bold">
                                  {isDone ? t.completed : juz}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        },
                      )}
                    </div>
                  </TooltipProvider>
                </Card>
              </div>

              {/* Tajweed Technical Notes */}
              <Card className="rounded-[2.5rem] p-8 bg-tarteel-maroon text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Mic2 size={150} />
                </div>
                <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                  <Mic2 className="text-tarteel-gold" /> {t.tajweedNotes}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                    <p className="text-tarteel-gold font-bold uppercase text-[10px] tracking-widest mb-1">
                      {t.makharij}
                    </p>
                    <p className="text-sm italic opacity-90">
                      "انتبه لمخرج حرف الضاد وتجنب خلطه بحرف الظاء."
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
                    <p className="text-tarteel-gold font-bold uppercase text-[10px] tracking-widest mb-1">
                      {t.sifaat}
                    </p>
                    <p className="text-sm italic opacity-90">
                      "تحتاج لزيادة زمن الغنة في الإدغام الناقص."
                    </p>
                  </div>
                </div>
              </Card>

              {/* Schedule & General Feedback */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] p-8 bg-white shadow-sm border-none">
                  <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-tarteel-maroon" />{" "}
                    {t.schedule}
                  </h3>
                  <div className="flex gap-3 justify-center bg-slate-50 p-6 rounded-[2rem]">
                    {["sat", "sun", "mon", "tue", "wed", "thu", "fri"].map(
                      (day) => (
                        <div
                          key={day}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase ${preferredDays.includes(day) ? "bg-tarteel-maroon text-white" : "bg-white text-slate-200 border"}`}
                        >
                          {t.days[day] || day}
                        </div>
                      ),
                    )}
                  </div>
                </Card>
                <Card className="rounded-[2.5rem] p-8 bg-white shadow-sm border-none">
                  <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                    <History size={20} className="text-tarteel-maroon" />{" "}
                    {t.feedback}
                  </h3>
                  <div className="p-6 bg-slate-50 rounded-[2rem] italic text-slate-500 text-sm border-l-4 border-tarteel-maroon">
                    "{t.noFeedback}"
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
