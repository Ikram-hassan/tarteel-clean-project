import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Award, CheckCircle2, AlertCircle, PlayCircle, Calendar, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { t, dir } = useLanguage();
  const [role, setRole] = useState<"admin" | "teacher" | "student">("student");

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col" dir={dir}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Role Switcher (For Demo Purposes) */}
        <div className="mb-8 flex justify-end">
          <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="w-full max-w-sm">
            <TabsList className="grid w-full grid-cols-3 bg-white border">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-tarteel-maroon mb-2">{t('dashboardTitle')}</h1>
          <p className="text-muted-foreground">Welcome back. Here is your overview.</p>
        </div>

        {/* Admin Dashboard */}
        {role === "admin" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: "Total Students", value: "1,240" },
                { icon: BookOpen, label: "Total Teachers", value: "85" },
                { icon: PlayCircle, label: "Active Classes", value: "32" },
                { icon: Award, label: "Certificates", value: "450" },
              ].map((stat, i) => (
                <Card key={i} className="border-t-4 border-tarteel-maroon shadow-md">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-tarteel-maroon/10 flex items-center justify-center">
                      <stat.icon className="text-tarteel-maroon" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 shadow-md">
                <CardHeader>
                  <CardTitle>Recent Teacher Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-tarteel-maroon border border-tarteel-gold">
                            T{i}
                          </div>
                          <div>
                            <p className="font-bold">Ahmed Hassan</p>
                            <p className="text-sm text-muted-foreground">Applied 2 days ago • Hafs 'an Asim</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm" className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white">Approve</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full bg-[#E07B39] hover:bg-[#E07B39]/90 text-white justify-start">
                    <Link href="/certificates">
                      <Award className="mr-2 h-4 w-4" /> Issue Certificate
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" /> Manage Roles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="mr-2 h-4 w-4" /> Post Announcement
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Teacher Dashboard */}
        {role === "teacher" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-xl font-bold text-tarteel-maroon">Today's Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { time: "08:00 AM", group: "Group A - Hifz", students: 5 },
                { time: "10:30 AM", group: "Group C - Tajweed", students: 8 },
                { time: "02:00 PM", group: "Group B - Saba'", students: 4 },
                { time: "04:30 PM", group: "Ijaza Track", students: 2 },
              ].map((cls, i) => (
                <Card key={i} className="shadow-md hover:border-tarteel-gold transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-tarteel-maroon font-bold bg-tarteel-maroon/10 px-3 py-1 rounded-full text-sm">
                        {cls.time}
                      </div>
                      <Users size={18} className="text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{cls.group}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{cls.students} Students</p>
                    <Button asChild className="w-full bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white">
                      <Link href="/live-class">Start Class</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-md mt-8">
              <CardHeader>
                <CardTitle>Student Progression Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-tarteel-gold/10 rounded-lg border border-tarteel-gold/30 gap-4">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="text-tarteel-gold" />
                        <div>
                          <p className="font-bold">Omar Ali</p>
                          <p className="text-sm text-muted-foreground">Ready to advance to Intermediate Level 2</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none">Review</Button>
                        <Button className="flex-1 md:flex-none bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white">Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Student Dashboard */}
        {role === "student" && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 shadow-md border-t-4 border-[#E07B39]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm font-bold text-[#E07B39] uppercase tracking-wider mb-1">Current Level</p>
                      <h2 className="text-3xl font-serif font-bold text-tarteel-maroon">Intermediate - Level 3</h2>
                    </div>
                    <Award size={48} className="text-[#E07B39] opacity-20" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Hifz Progress</span>
                      <span>15/30 Ajza'</span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-[#E07B39] rounded-full" style={{ width: "50%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md bg-tarteel-maroon text-white border-none">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <p className="text-white/70 font-medium mb-1">Next Class</p>
                    <h3 className="text-2xl font-bold mb-2">Today, 04:30 PM</h3>
                    <p className="text-white/90">Hifz & Saba' Review</p>
                    <p className="text-sm text-tarteel-gold mt-1">Teacher: Sh. Abdullahi</p>
                  </div>
                  <Button asChild className="w-full mt-6 bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon font-bold">
                    <Link href="/live-class">Join Class</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Attendance & Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-tarteel-maroon">95%</p>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                  </div>
                  <div className="h-12 w-px bg-border"></div>
                  <div className="flex gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'}`}>
                          {i < 5 ? '✓' : '-'}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <FloatingButtons />
      <Footer />
    </div>
  );
}
