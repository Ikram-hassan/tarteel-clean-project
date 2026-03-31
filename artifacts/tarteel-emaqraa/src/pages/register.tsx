import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, BookOpen, GraduationCap, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

type Role = "admin" | "teacher" | "student" | null;

export default function Register() {
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>(null);
  const [mode, setMode] = useState<"register" | "login">("register");

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth & route to dashboard
    setLocation("/dashboard");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth & route to dashboard
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-full max-w-4xl">
          
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full mb-8 flex justify-center">
            <TabsList className="bg-white border shadow-sm rounded-full p-1 h-14 w-full max-w-sm">
              <TabsTrigger value="register" className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white">Register</TabsTrigger>
              <TabsTrigger value="login" className="rounded-full w-1/2 h-full text-lg data-[state=active]:bg-tarteel-maroon data-[state=active]:text-white">Login</TabsTrigger>
            </TabsList>
          </Tabs>

          <AnimatePresence mode="wait">
            {mode === "register" ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-10">
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-tarteel-maroon mb-4">Choose Your Role</h1>
                      <p className="text-muted-foreground">Select how you want to join Tarteel E-Maqraa</p>
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

                {step === 2 && role && (
                  <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-tarteel-gold">
                    <div className="flex items-center gap-4 mb-8">
                      <Button variant="ghost" size="icon" onClick={() => setStep(1)} className="rounded-full">
                        <ArrowLeft />
                      </Button>
                      <h2 className="text-2xl font-serif font-bold text-tarteel-maroon capitalize">
                        {role} Registration
                      </h2>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input required placeholder="Enter your full name" className="bg-secondary/50 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" required placeholder="Enter your email" className="bg-secondary/50 h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" required placeholder="Create a password" className="bg-secondary/50 h-12" />
                      </div>

                      {role === "student" && (
                        <>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input type="tel" required placeholder="Enter your phone number" className="bg-secondary/50 h-12" />
                          </div>
                          <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-sm">
                            <p className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> 15 Days Free Trial</p>
                            <p>You will need to take a quick Tajweed evaluation exam after registration to determine your level.</p>
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Schedule</Label>
                            <select className="w-full h-12 rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                              <option>5 Days per week</option>
                              <option>7 Days per week</option>
                            </select>
                          </div>
                        </>
                      )}

                      {(role === "admin" || role === "teacher") && (
                        <div className="space-y-2">
                          <Label>Verification Code {role === 'teacher' && "(Sent by Admin)"}</Label>
                          <Input required placeholder="Enter code" className="bg-secondary/50 h-12 font-mono" />
                        </div>
                      )}

                      <Button type="submit" className="w-full h-12 bg-[#E07B39] hover:bg-[#E07B39]/90 text-white text-lg mt-4">
                        Complete Registration
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-tarteel-maroon"
              >
                <h2 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2 text-center">Welcome Back</h2>
                <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>
                
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label>User Name / Email</Label>
                    <Input required placeholder="Enter your credentials" className="bg-secondary/50 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password or Verification Code</Label>
                    <Input type="password" required placeholder="Enter password or code" className="bg-secondary/50 h-12" />
                  </div>
                  
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-tarteel-gold hover:underline">Forgot password?</a>
                  </div>

                  <Button type="submit" className="w-full h-12 bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white text-lg mt-4">
                    Login
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function RoleCard({ title, icon: Icon, desc, onClick }: { title: string, icon: any, desc: string, onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer group hover:border-tarteel-gold hover:shadow-xl transition-all duration-300 border-2"
      onClick={onClick}
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
