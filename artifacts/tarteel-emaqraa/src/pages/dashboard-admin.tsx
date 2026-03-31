// لوحة تحكم المدير - إدارة المعلمين والطلاب والشهادات والإعلانات
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  BookOpen,
  Award,
  PlayCircle,
  Shield,
  Bell,
  CheckCircle,
  XCircle,
  Plus,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const teacherApplications = [
  { name: "Ahmed Hassan", spec: "Hafs 'an Asim", date: "2 days ago", status: "pending" },
  { name: "Zahra Mohamed", spec: "Tajweed", date: "4 days ago", status: "pending" },
  { name: "Bilal Abdi", spec: "Ijaza", date: "1 week ago", status: "pending" },
];

const students = [
  { name: "Omar Ali", level: "Intermediate L3", teacher: "Sh. Abdullahi", attendance: "96%", status: "active" },
  { name: "Fatima Noor", level: "Intermediate L2", teacher: "Sh. Abdullahi", attendance: "91%", status: "active" },
  { name: "Khadija Said", level: "Advanced L1", teacher: "Sh. Hussein", attendance: "100%", status: "active" },
  { name: "Ali Farah", level: "Beginner", teacher: "Sh. Abdullahi", attendance: "72%", status: "warning" },
];

export default function AdminDashboard() {
  const { dir } = useLanguage();
  const { user } = useAuth();
  const [applications, setApplications] = useState(teacherApplications);
  const [certOpen, setCertOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const handleApprove = (name: string) =>
    setApplications((prev) => prev.filter((a) => a.name !== name));
  const handleReject = (name: string) =>
    setApplications((prev) => prev.filter((a) => a.name !== name));

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQ.toLowerCase())
  );

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
              Admin Panel — {user?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-tarteel-maroon/10 text-tarteel-maroon border-tarteel-maroon/30 font-semibold">
                <Shield size={12} className="mr-1" /> Administrator
              </Badge>
              <span className="text-sm text-muted-foreground">Full platform access</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* إحصائيات عامة */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Users, label: "Total Students", value: "1,240", color: "border-tarteel-maroon" },
              { icon: BookOpen, label: "Total Teachers", value: "85", color: "border-blue-400" },
              { icon: PlayCircle, label: "Active Classes", value: "32", color: "border-[#E07B39]" },
              { icon: Award, label: "Certificates Issued", value: "450", color: "border-tarteel-gold" },
            ].map((stat, i) => (
              <Card key={i} className={`shadow-md border-t-4 ${stat.color}`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center">
                    <stat.icon size={20} className="text-tarteel-maroon" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* طلبات المعلمين للانضمام */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="shadow-md h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-tarteel-maroon text-base">
                    <Bell size={18} /> Teacher Applications
                    {applications.length > 0 && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 ml-1">{applications.length}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <CheckCircle size={40} className="mb-3 text-green-400" />
                      <p className="font-medium">All applications reviewed</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/50 rounded-lg border gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border-2 border-tarteel-gold flex items-center justify-center font-bold text-tarteel-maroon text-sm">
                              {app.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold">{app.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {app.spec} • Applied {app.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button size="sm" variant="outline" onClick={() => handleReject(app.name)} data-testid={`button-reject-teacher-${i}`}>
                              <XCircle size={14} className="mr-1 text-red-500" /> Reject
                            </Button>
                            <Button size="sm" className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white" onClick={() => handleApprove(app.name)} data-testid={`button-approve-teacher-${i}`}>
                              <CheckCircle size={14} className="mr-1" /> Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* الإجراءات السريعة */}
            <motion.div variants={item}>
              <Card className="shadow-md h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-tarteel-maroon text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* نافذة إصدار الشهادة */}
                  <Dialog open={certOpen} onOpenChange={setCertOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#E07B39] hover:bg-[#E07B39]/90 text-white justify-start" data-testid="button-issue-certificate">
                        <Award size={16} className="mr-2" /> Issue Certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-tarteel-maroon font-serif">Issue New Certificate</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCertOpen(false); }}>
                        <div className="space-y-2">
                          <Label>Student Name</Label>
                          <Input placeholder="Enter student full name" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label>Course Completed</Label>
                          <select className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>Tajweed — Beginner</option>
                            <option>Hifz — Intermediate Level 6</option>
                            <option>Ijaza — Hafs 'an Asim</option>
                            <option>Ijaza — Qawa'id</option>
                            <option>Ijaza — Diraayah</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date of Completion</Label>
                          <Input type="date" className="h-11" />
                        </div>
                        <Button type="submit" className="w-full bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white" data-testid="button-issue-cert-submit">
                          Issue Certificate
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button asChild className="w-full bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white justify-start">
                    <Link href="/certificates">
                      <Award size={16} className="mr-2" /> View All Certificates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield size={16} className="mr-2" /> Manage Roles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell size={16} className="mr-2" /> Post Announcement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus size={16} className="mr-2" /> Add Teacher
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/live-class">
                      <PlayCircle size={16} className="mr-2" /> Monitor Live Class
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* جدول الطلاب مع بحث */}
          <motion.div variants={item}>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-tarteel-maroon text-base">
                    <Users size={18} /> All Students
                  </CardTitle>
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      placeholder="Search students..."
                      className="pl-8 h-9 text-sm"
                      data-testid="input-search-students"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-3 font-semibold text-muted-foreground">Student</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Level</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Teacher</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Attendance</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                        <th className="pb-3 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredStudents.map((s, i) => (
                        <tr key={i} className="hover:bg-secondary/30 transition-colors">
                          <td className="py-3 font-medium">{s.name}</td>
                          <td className="py-3">
                            <Badge variant="outline" className="text-xs border-tarteel-maroon/30 text-tarteel-maroon">
                              {s.level}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground text-xs">{s.teacher}</td>
                          <td className={`py-3 font-bold text-sm ${s.status === "warning" ? "text-red-500" : "text-green-600"}`}>
                            {s.attendance}
                          </td>
                          <td className="py-3">
                            <Badge
                              className={s.status === "warning"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-green-100 text-green-700 border-green-200"}
                            >
                              {s.status === "warning" ? "Low Attendance" : "Active"}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-tarteel-maroon hover:bg-tarteel-maroon/10">
                              View
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
        </motion.div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
