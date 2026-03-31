// صفحة التسجيل وتسجيل الدخول - مع التحقق من الكود ورمز الدور
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

type Role = "admin" | "teacher" | "student" | null;

// رمز التحقق الخاص بالمعلم والمدير
const VERIFICATION_CODE = "tartiil2026";

export default function Register() {
  const { t, dir } = useLanguage();
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>(null);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");

  // حقول النموذج
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [schedule, setSchedule] = useState("5");

  // حقول تسجيل الدخول
  const [loginName, setLoginName] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "teacher" | "student">("student");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCode, setLoginCode] = useState("");

  const dashboardPath = (r: string) =>
    r === "admin" ? "/dashboard/admin" : r === "teacher" ? "/dashboard/teacher" : "/dashboard/student";

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(2);
    setError("");
  };

  // معالجة التسجيل
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) return;

    // التحقق من رمز التحقق للمعلم والمدير
    if ((role === "admin" || role === "teacher") && code !== VERIFICATION_CODE) {
      setError("Invalid verification code. Please check with the administrator.");
      return;
    }

    login({ name, email, role });
    setLocation(dashboardPath(role));
  };

  // معالجة تسجيل الدخول
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (loginRole === "admin" || loginRole === "teacher") {
      if (loginCode !== VERIFICATION_CODE) {
        setError("Invalid verification code. Please check with the administrator.");
        return;
      }
    } else {
      if (!loginPassword.trim()) {
        setError("Please enter your password.");
        return;
      }
    }

    login({ name: loginName, email: "", role: loginRole });
    setLocation(dashboardPath(loginRole));
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-start">
        <div className="w-full max-w-4xl">
          {/* مبدّل التسجيل / تسجيل الدخول */}
          <div className="flex justify-center mb-10">
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as "register" | "login");
                setError("");
                setStep(1);
                setRole(null);
              }}
              className="w-full max-w-sm"
            >
              <TabsList className="bg-white border shadow-sm rounded-full p-1 h-14 w-full">
                <TabsTrigger
                  value="register"
                  className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <AnimatePresence mode="wait">
            {/* ===== وضع التسجيل ===== */}
            {mode === "register" ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* الخطوة 1: اختيار الدور */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-10">
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-tarteel-maroon mb-4">
                        Choose Your Role
                      </h1>
                      <p className="text-muted-foreground">
                        Select how you want to join Tarteel E-Maqraa
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <RoleCard
                        title="Student"
                        icon={GraduationCap}
                        desc="Learn and memorize the Quran with the Saba' system"
                        onClick={() => handleRoleSelect("student")}
                      />
                      <RoleCard
                        title="Teacher"
                        icon={BookOpen}
                        desc="Teach and evaluate students globally"
                        onClick={() => handleRoleSelect("teacher")}
                      />
                      <RoleCard
                        title="Admin"
                        icon={Shield}
                        desc="Manage the platform and verify users"
                        onClick={() => handleRoleSelect("admin")}
                      />
                    </div>
                  </div>
                )}

                {/* الخطوة 2: نموذج التسجيل */}
                {step === 2 && role && (
                  <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-tarteel-gold">
                    <div className="flex items-center gap-4 mb-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setStep(1); setError(""); }}
                        className="rounded-full"
                        data-testid="button-back-step"
                      >
                        <ArrowLeft />
                      </Button>
                      <h2 className="text-2xl font-serif font-bold text-tarteel-maroon capitalize">
                        {role} Registration
                      </h2>
                    </div>

                    {error && (
                      <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-secondary/50 h-12"
                          data-testid="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="bg-secondary/50 h-12"
                          data-testid="input-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="bg-secondary/50 h-12"
                          data-testid="input-password"
                        />
                      </div>

                      {/* حقول خاصة بالطالب */}
                      {role === "student" && (
                        <>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Enter your phone number"
                              className="bg-secondary/50 h-12"
                              data-testid="input-phone"
                            />
                          </div>
                          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-sm">
                            <p className="font-bold flex items-center gap-2 mb-1">
                              <CheckCircle2 size={16} /> 15 Days Free Trial
                            </p>
                            <p>
                              A Tajweed evaluation exam will determine your starting level after registration.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Schedule</Label>
                            <select
                              className="w-full h-12 rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm"
                              value={schedule}
                              onChange={(e) => setSchedule(e.target.value)}
                              data-testid="select-schedule"
                            >
                              <option value="5">5 Days per week — $20/month</option>
                              <option value="7">7 Days per week — $25/month</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* حقل كود التحقق للمعلم والمدير */}
                      {(role === "admin" || role === "teacher") && (
                        <div className="space-y-2">
                          <Label>
                            Verification Code
                            {role === "teacher" && (
                              <span className="text-xs text-muted-foreground ml-2">
                                (Provided by Admin)
                              </span>
                            )}
                          </Label>
                          <Input
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="bg-secondary/50 h-12 font-mono tracking-widest"
                            data-testid="input-verification-code"
                          />
                          {role === "teacher" && (
                            <p className="text-xs text-muted-foreground">
                              Contact the admin to receive your verification code before registering.
                            </p>
                          )}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-[#E07B39] hover:bg-[#E07B39]/90 text-white text-lg mt-4"
                        data-testid="button-register-submit"
                      >
                        Complete Registration
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>
            ) : (
              /* ===== وضع تسجيل الدخول ===== */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-tarteel-maroon"
              >
                <h2 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2 text-center">
                  Welcome Back
                </h2>
                <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>

                {error && (
                  <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  {/* اختيار الدور عند تسجيل الدخول */}
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["student", "teacher", "admin"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => { setLoginRole(r); setError(""); }}
                          className={`h-11 rounded-lg border-2 text-sm font-semibold capitalize transition-all ${
                            loginRole === r
                              ? "border-tarteel-maroon bg-tarteel-maroon text-white"
                              : "border-gray-200 bg-white text-tarteel-maroon hover:border-tarteel-maroon/50"
                          }`}
                          data-testid={`button-login-role-${r}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      required
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-secondary/50 h-12"
                      data-testid="input-login-name"
                    />
                  </div>

                  {/* طالب: كلمة المرور | معلم / مدير: رمز التحقق */}
                  {loginRole === "student" ? (
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-secondary/50 h-12"
                        data-testid="input-login-password"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Verification Code</Label>
                      <Input
                        required
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="bg-secondary/50 h-12 font-mono tracking-widest"
                        data-testid="input-login-code"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white text-lg"
                    data-testid="button-login-submit"
                  >
                    Login
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

// مكوّن بطاقة الدور
function RoleCard({
  title,
  icon: Icon,
  desc,
  onClick,
}: {
  title: string;
  icon: React.ElementType;
  desc: string;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer group hover:border-tarteel-gold hover:shadow-xl transition-all duration-300 border-2"
      onClick={onClick}
      data-testid={`card-role-${title.toLowerCase()}`}
    >
      <CardContent className="p-8 flex flex-col items-center text-center h-full">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:bg-tarteel-gold group-hover:scale-110 transition-all duration-300">
          <Icon size={36} className="text-tarteel-maroon group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-tarteel-maroon mb-3">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
        <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-tarteel-gold font-bold flex items-center gap-2">
          Select <ArrowRight size={16} />
        </div>
      </CardContent>
    </Card>
  );
}
