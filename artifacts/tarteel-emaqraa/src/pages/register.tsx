"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth, UserRole } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  UserCheck,
  Globe,
  Clock,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

const DAYS = [
  { id: "sat", label: "Saturday" },
  { id: "sun", label: "Sunday" },
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
];

const SECTIONS = [
  { id: "sec_1", label: "06:00 AM - 09:00 AM" },
  { id: "sec_2", label: "09:00 AM - 12:00 PM" },
  { id: "sec_3", label: "01:00 PM - 04:00 PM" },
  { id: "sec_4", label: "04:00 PM - 07:00 PM" },
  { id: "sec_5", label: "07:00 PM - 10:00 PM" },
];

const LANGUAGES = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
  { id: "so", label: "Somali" },
];

export default function Register() {
  const { dir } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [code, setCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("ar");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Step 3: Specialization States
  const [teacherType, setTeacherType] = useState<string>("");
  const [juzRange, setJuzRange] = useState<string>("");
  const [qiraatSpecialization, setQiraatSpecialization] = useState<string>("");
  const [interviewerType, setInterviewerType] = useState<string>("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Juz Range Options with exact Arabic labels as specified
  const JUZ_OPTIONS = [
    { value: "5", label: "5 Juz: (من الأحقاف إلى الناس)" },
    { value: "10", label: "10 Juz: (من العنكبوت إلى الناس)" },
    { value: "15", label: "15 Juz: (من الكهف إلى الناس)" },
    { value: "20", label: "20 Juz: (من التوبة إلى الناس)" },
    { value: "25", label: "25 Juz: (من المائدة إلى الناس)" },
    { value: "30", label: "30 Juz: (القرآن كاملاً)" },
  ];

  // Ten Qira'at Options
  const QIRAAT_OPTIONS = [
    { value: "nafi", label: "نافع" },
    { value: "ibn_kathir", label: "ابن كثير" },
    { value: "abu_amr", label: "أبو عمرو" },
    { value: "ibn_amir", label: "ابن عامر" },
    { value: "asim", label: "عاصم" },
    { value: "hamzah", label: "حمزة" },
    { value: "al_kisai", label: "الكسائي" },
    { value: "abu_jafar", label: "أبو جعفر" },
    { value: "yaqub", label: "يعقوب" },
    { value: "khalaf", label: "خلف العاشر" },
  ];

  // Interviewer Type Options
  const INTERVIEWER_OPTIONS = [
    { value: "placement", label: "Placement: تحديد مستوى" },
    { value: "hifz", label: "Hifz: حفظ" },
    { value: "ijaza", label: "Ijaza: إجازة" },
  ];

  const monthlyPrice = useMemo(() => {
    if (role !== "student") return 0;
    const count = selectedDays.length;
    if (count >= 2 && count <= 3) return 10;
    if (count >= 4 && count <= 5) return 20;
    if (count >= 6 && count <= 7) return 25;
    return 0;
  }, [selectedDays, role]);

  const isFormValid = useMemo(() => {
    const commonFields = name && email && password && phone;
    if (role === "admin") return !!(commonFields && code);
    if (role === "student")
      return !!(
        commonFields &&
        age &&
        selectedDays.length >= 2 &&
        selectedSections.length > 0
      );
    if (role === "teacher")
      return !!(
        commonFields &&
        code &&
        selectedDays.length >= 2 &&
        selectedSections.length > 0 &&
        teacherType &&
        (teacherType === "beginner" ||
          teacherType === "meton" ||
          (teacherType === "intermediate" && juzRange) ||
          (teacherType === "ijaza" && qiraatSpecialization))
      );
    if (role === "interviewer")
      return !!(
        commonFields &&
        code &&
        selectedDays.length >= 2 &&
        selectedSections.length > 0 &&
        interviewerType
      );
    return false;
  }, [
    name,
    email,
    password,
    phone,
    role,
    age,
    selectedDays,
    selectedSections,
    code,
    teacherType,
    juzRange,
    qiraatSpecialization,
    interviewerType,
  ]);

  const redirectByUserRole = (userRole: UserRole) => {
    switch (userRole) {
      case "admin":
        setLocation("/dashboard/admin");
        break;
      case "student":
        setLocation("/dashboard/student");
        break;
      case "teacher":
      case "interviewer":
        setLocation("/dashboard/teacher");
        break;
      default:
        setLocation("/");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // CRITICAL: Pull ALL form data from localStorage for Step 3 submissions
    const storedFormDataStr = localStorage.getItem("registrationFormData");
    let storedFormData: any = null;

    if (storedFormDataStr) {
      try {
        storedFormData = JSON.parse(storedFormDataStr);
        console.log(
          "[Register] Retrieved form data from localStorage:",
          storedFormData,
        );
      } catch (e) {
        console.error("[Register] Failed to parse localStorage data:", e);
      }
    }

    // Use stored values if available (Step 3), otherwise use state (Step 2)
    const finalName = storedFormData?.name || name;
    const finalEmail = storedFormData?.email || email;
    const finalPassword = storedFormData?.password || password;
    const finalPhone = storedFormData?.phone || phone;
    const finalGender = storedFormData?.gender || gender;
    const finalSelectedLang = storedFormData?.selectedLang || selectedLang;
    const finalSelectedDays = storedFormData?.selectedDays || selectedDays;
    const finalSelectedSections =
      storedFormData?.selectedSections || selectedSections;
    const finalCode = storedFormData?.code || code;

    // CRITICAL: Validate that required fields are present
    if (!finalName || !finalEmail || !finalPassword || !finalPhone) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      (role === "teacher" || role === "interviewer" || role === "admin") &&
      !finalCode
    ) {
      setError("Verification code is required");
      return;
    }

    try {
      const registrationData: any = {
        name: finalName,
        email: finalEmail,
        password: finalPassword,
        phone: finalPhone,
        gender: finalGender,
        role,
        language: finalSelectedLang,
        verificationCode: finalCode, // MUST be included for teacher/interviewer/admin
      };

      if (role !== "admin") {
        registrationData.selectedDays = finalSelectedDays;
        registrationData.selectedSections = finalSelectedSections;
      }

      if (role === "student") {
        registrationData.age = age;
        registrationData.monthlyFee = monthlyPrice.toString();
        delete registrationData.verificationCode;
      }

      if (role === "teacher") {
        // CRITICAL: Ensure verificationCode is NOT deleted
        registrationData.teacherType = teacherType;
        if (teacherType === "intermediate") {
          registrationData.juzRange = Number(juzRange);
        }
        if (teacherType === "ijaza") {
          registrationData.qiraatSpecialization = qiraatSpecialization;
        }
      }

      if (role === "interviewer") {
        // CRITICAL: Ensure verificationCode is NOT deleted
        registrationData.interviewerType = interviewerType;
      }

      console.log("[Register] Submitting payload:", registrationData);
      await register(registrationData);

      // Clean up localStorage after successful registration
      localStorage.removeItem("registrationFormData");

      if (role) redirectByUserRole(role);
    } catch (err: any) {
      console.error("[Register] Error:", err);
      setError(err.message || "Registration failed.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response: any = await login(loginEmail, loginPassword);
      // تصحيح السطر 161: الوصول الآمن للـ role سواء كان في response أو response.user
      const userRole = response?.user?.role || response?.role;
      if (userRole) {
        redirectByUserRole(userRole);
      }
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  };

  const toggleItem = (
    id: string,
    list: string[],
    setList: (val: string[]) => void,
  ) => {
    setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30" dir={dir}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-start">
        <div className="w-full max-w-4xl">
          <div className="flex justify-center mb-10">
            <Tabs
              value={mode}
              onValueChange={(v: any) => {
                setMode(v);
                setError("");
                setShowPassword(false);
              }}
              className="w-full max-w-sm"
            >
              <TabsList className="bg-white border shadow-sm rounded-full p-1 h-14 w-full">
                <TabsTrigger
                  value="register"
                  className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white transition-all"
                >
                  Register
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white transition-all"
                >
                  Login
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            {mode === "register" ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {step === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RoleCard
                      title="Admin"
                      icon={Shield}
                      desc="Platform Control"
                      onClick={() => {
                        setRole("admin");
                        setStep(2);
                      }}
                    />
                    <RoleCard
                      title="Interviewer"
                      icon={UserCheck}
                      desc="Evaluate Students"
                      onClick={() => {
                        setRole("interviewer");
                        setStep(2);
                      }}
                    />
                    <RoleCard
                      title="Teacher"
                      icon={BookOpen}
                      desc="Teach Quran"
                      onClick={() => {
                        setRole("teacher");
                        setStep(2);
                      }}
                    />
                    <RoleCard
                      title="Student"
                      icon={GraduationCap}
                      desc="Learn Quran"
                      onClick={() => {
                        setRole("student");
                        setStep(2);
                      }}
                    />
                  </div>
                ) : step === 2 ? (
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-8 border-tarteel-maroon">
                    <div className="flex items-center gap-4 mb-8">
                      <Button
                        variant="ghost"
                        onClick={() => setStep(1)}
                        disabled={isLoading}
                        className="hover:bg-tarteel-maroon/5"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <h2 className="text-2xl font-black text-tarteel-maroon capitalize">
                        {role} Account - Step 2
                      </h2>
                    </div>

                    <form
                      onSubmit={handleRegisterSubmit}
                      className="space-y-6"
                      autoComplete="off"
                    >
                      {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>WhatsApp Phone</Label>
                          <Input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+252..."
                            className="h-12 bg-secondary/20 focus:ring-tarteel-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="h-12 bg-secondary/20 focus:ring-tarteel-gold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select
                            onValueChange={(v: any) => setGender(v)}
                            defaultValue={gender}
                          >
                            <SelectTrigger className="h-12 bg-secondary/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="h-12 bg-secondary/20 focus:ring-tarteel-gold"
                          />
                        </div>
                      </div>

                      {role === "student" && (
                        <div className="space-y-2">
                          <Label>Age</Label>
                          <Input
                            required
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="h-12 bg-secondary/20"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative">
                          <Input
                            required
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-secondary/20 pr-12 focus:ring-tarteel-gold"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tarteel-maroon transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Globe size={16} /> Preferred Language
                        </Label>
                        <Select
                          value={selectedLang}
                          onValueChange={setSelectedLang}
                        >
                          <SelectTrigger className="h-12 bg-tarteel-gold/10 border-tarteel-gold/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {role !== "admin" && (
                        <>
                          <div className="space-y-4 p-4 bg-secondary/10 rounded-2xl border border-dashed border-tarteel-gold/50">
                            <Label className="text-tarteel-maroon font-bold flex items-center gap-2">
                              <CheckCircle2 size={16} /> Select Available Days
                              (Min 2)
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {DAYS.map((day) => (
                                <div
                                  key={day.id}
                                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm hover:border-tarteel-gold transition-colors"
                                >
                                  <Checkbox
                                    id={day.id}
                                    checked={selectedDays.includes(day.id)}
                                    onCheckedChange={() =>
                                      toggleItem(
                                        day.id,
                                        selectedDays,
                                        setSelectedDays,
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={day.id}
                                    className="text-xs font-medium cursor-pointer select-none"
                                  >
                                    {day.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label className="flex items-center gap-2">
                              <Clock size={16} />{" "}
                              {role === "student"
                                ? "Study Shift"
                                : "Work Shifts"}
                            </Label>
                            {role === "student" ? (
                              <Select
                                onValueChange={(v) => setSelectedSections([v])}
                              >
                                <SelectTrigger className="h-12 bg-secondary/20">
                                  <SelectValue placeholder="Choose shift" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SECTIONS.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {SECTIONS.map((s) => (
                                  <div
                                    key={s.id}
                                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-tarteel-gold/5 transition-colors"
                                  >
                                    <Checkbox
                                      id={`sec-${s.id}`}
                                      checked={selectedSections.includes(s.id)}
                                      onCheckedChange={() =>
                                        toggleItem(
                                          s.id,
                                          selectedSections,
                                          setSelectedSections,
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`sec-${s.id}`}
                                      className="text-xs cursor-pointer flex-1 select-none"
                                    >
                                      {s.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {role === "student" && selectedDays.length > 0 && (
                        <div className="p-4 bg-tarteel-gold/20 border-2 border-tarteel-gold rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
                          <span className="font-bold text-tarteel-maroon">
                            Monthly Subscription:
                          </span>
                          <span className="text-2xl font-black text-tarteel-maroon">
                            ${monthlyPrice}/mo
                          </span>
                        </div>
                      )}

                      {(role === "teacher" ||
                        role === "interviewer" ||
                        role === "admin") && (
                        <div className="space-y-2">
                          <Label>Verification Code</Label>
                          <Input
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter staff/admin code"
                            className="h-14 border-2 border-tarteel-maroon/20 text-center font-mono text-xl focus:border-tarteel-maroon"
                          />
                        </div>
                      )}

                      {role === "teacher" || role === "interviewer" ? (
                        <Button
                          type="button"
                          onClick={() => {
                            // CRITICAL: Save ALL form data to localStorage before moving to Step 3
                            const formData = {
                              name,
                              email,
                              password,
                              phone,
                              gender,
                              selectedLang,
                              selectedDays,
                              selectedSections,
                              code,
                            };
                            localStorage.setItem(
                              "registrationFormData",
                              JSON.stringify(formData),
                            );
                            console.log(
                              "[Step2->Step3] Saved ALL form data to localStorage:",
                              formData,
                            );
                            setStep(3);
                          }}
                          disabled={
                            !name ||
                            !email ||
                            !password ||
                            !phone ||
                            !code ||
                            selectedDays.length < 2 ||
                            selectedSections.length === 0
                          }
                          className="w-full h-14 bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon text-xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
                        >
                          Next: Specialization →
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={!isFormValid || isLoading}
                          className="w-full h-14 bg-[#E07B39] hover:bg-[#E07B39]/90 text-white text-xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
                        >
                          {isLoading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Complete Registration"
                          )}
                        </Button>
                      )}
                    </form>
                  </div>
                ) : (
                  // Step 3: Specialization Selection
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-8 border-tarteel-gold">
                    <div className="flex items-center gap-4 mb-8">
                      <Button
                        variant="ghost"
                        onClick={() => setStep(2)}
                        disabled={isLoading}
                        className="hover:bg-tarteel-maroon/5"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <h2 className="text-2xl font-black text-tarteel-maroon capitalize">
                        {role} Specialization - Step 3
                      </h2>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
                          {error}
                        </div>
                      )}

                      {role === "teacher" && (
                        <>
                          <div className="space-y-2">
                            <Label className="text-lg font-bold text-tarteel-maroon">
                              Select Teacher Type
                            </Label>
                            <Select
                              value={teacherType}
                              onValueChange={setTeacherType}
                            >
                              <SelectTrigger className="h-14 bg-secondary/20 border-2 border-tarteel-gold/30">
                                <SelectValue placeholder="Choose your specialization..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">
                                  Beginner Teacher (معلم مبتدئين)
                                </SelectItem>
                                <SelectItem value="intermediate">
                                  Intermediate Teacher (معلم متوسط)
                                </SelectItem>
                                <SelectItem value="meton">
                                  Meton Teacher (معلم متون)
                                </SelectItem>
                                <SelectItem value="ijaza">
                                  Ijaza Teacher (معلم إجازة)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {teacherType === "intermediate" && (
                            <div className="space-y-2 p-4 bg-tarteel-gold/10 rounded-2xl border-2 border-tarteel-gold/50">
                              <Label className="text-lg font-bold text-tarteel-maroon">
                                Select Juz Range
                              </Label>
                              <Select
                                value={juzRange}
                                onValueChange={setJuzRange}
                              >
                                <SelectTrigger className="h-14 bg-white border-2 border-tarteel-gold">
                                  <SelectValue placeholder="Choose Juz range..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {JUZ_OPTIONS.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {teacherType === "ijaza" && (
                            <div className="space-y-2 p-4 bg-tarteel-gold/10 rounded-2xl border-2 border-tarteel-gold/50">
                              <Label className="text-lg font-bold text-tarteel-maroon">
                                Select Qira'at Specialization
                              </Label>
                              <Select
                                value={qiraatSpecialization}
                                onValueChange={setQiraatSpecialization}
                              >
                                <SelectTrigger className="h-14 bg-white border-2 border-tarteel-gold">
                                  <SelectValue placeholder="Choose Qira'at..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {QIRAAT_OPTIONS.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}

                      {role === "interviewer" && (
                        <div className="space-y-2 p-4 bg-tarteel-gold/10 rounded-2xl border-2 border-tarteel-gold/50">
                          <Label className="text-lg font-bold text-tarteel-maroon">
                            Select Interviewer Type
                          </Label>
                          <Select
                            value={interviewerType}
                            onValueChange={setInterviewerType}
                          >
                            <SelectTrigger className="h-14 bg-white border-2 border-tarteel-gold">
                              <SelectValue placeholder="Choose interviewer type..." />
                            </SelectTrigger>
                            <SelectContent>
                              {INTERVIEWER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className="w-full h-14 bg-[#E07B39] hover:bg-[#E07B39]/90 text-white text-xl font-bold rounded-2xl shadow-lg transition-transform active:scale-95"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Complete Registration"
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-8 border-tarteel-maroon"
              >
                <h2 className="text-2xl font-bold text-tarteel-maroon mb-6 text-center">
                  Welcome Back
                </h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center border border-red-100">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                  autoComplete="off"
                >
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      required
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 bg-secondary/20 focus:ring-tarteel-gold"
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        required
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-12 bg-secondary/20 pr-12 focus:ring-tarteel-gold"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tarteel-maroon transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Login Now"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function RoleCard({ title, icon: Icon, desc, onClick }: any) {
  return (
    <Card
      className="cursor-pointer group hover:border-tarteel-gold hover:shadow-2xl transition-all border-2 rounded-2xl bg-white overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-tarteel-gold transition-colors">
          <Icon
            size={28}
            className="text-tarteel-maroon group-hover:text-white transition-colors"
          />
        </div>
        <h3 className="text-lg font-bold text-tarteel-maroon group-hover:text-tarteel-gold transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
