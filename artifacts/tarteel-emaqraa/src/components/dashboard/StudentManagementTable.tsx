import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  MoreVertical,
  UserCheck,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
  studentLevel: "beginner" | "intermediate" | "meton" | "ijaza";
  attendance?: "present" | "absent" | "late";
  lastSeen?: string;
  progress?: string;
  grade?: string;
  juzRange?: number;
  assignedQiraat?: string;
}

interface StudentManagementTableProps {
  onRequestTest?: (studentId: string) => void;
  onViewDetails?: (studentId: string) => void;
}

export function StudentManagementTable({
  onRequestTest,
  onViewDetails,
}: StudentManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterAttendance, setFilterAttendance] = useState<string>("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students from API using proxy
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "/api";
        const response = await fetch(`${API_BASE_URL}/api/students`);

        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();

        // Map API response to component format
        const mappedStudents: Student[] = data.students.map((student: any) => {
          const attendanceOptions: ("present" | "absent" | "late")[] = [
            "present",
            "present",
            "present",
            "late",
            "absent",
          ];
          const randomAttendance =
            attendanceOptions[
              Math.floor(Math.random() * attendanceOptions.length)
            ];
          const lastSeenOptions = [
            "1 min ago",
            "2 mins ago",
            "5 mins ago",
            "15 mins ago",
            "2 hours ago",
          ];
          const randomLastSeen =
            lastSeenOptions[Math.floor(Math.random() * lastSeenOptions.length)];
          const gradeOptions = ["A+", "A", "B+", "B", "C"];
          const randomGrade =
            gradeOptions[Math.floor(Math.random() * gradeOptions.length)];

          let progress = "";
          if (student.studentLevel === "beginner") {
            progress = `Juz ${Math.floor(Math.random() * 5) + 1} - Page ${Math.floor(Math.random() * 20) + 1}`;
          } else if (student.studentLevel === "intermediate") {
            const juz = student.juzRange || Math.floor(Math.random() * 25) + 5;
            progress = `Juz ${juz} - Page ${Math.floor(Math.random() * 20) + 180}`;
          } else if (student.studentLevel === "meton") {
            progress = `Jazariyyah - Line ${Math.floor(Math.random() * 100) + 1}`;
          } else if (student.studentLevel === "ijaza") {
            const qiraat = student.assignedQiraat || "Nafi'";
            progress = `Qira'at ${qiraat} - Surah Al-Baqarah`;
          }

          return {
            id: student.id,
            name: student.name,
            studentLevel: student.studentLevel,
            attendance: randomAttendance,
            lastSeen: randomLastSeen,
            progress,
            grade: randomGrade,
            juzRange: student.juzRange,
            assignedQiraat: student.assignedQiraat,
          };
        });

        setStudents(mappedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getAttendanceIcon = (status: Student["attendance"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "late":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getAttendanceBadge = (status: Student["attendance"]) => {
    if (!status) return null;
    const colors = {
      present: "bg-green-100 text-green-700 border-green-300",
      absent: "bg-red-100 text-red-700 border-red-300",
      late: "bg-amber-100 text-amber-700 border-amber-300",
    };
    return (
      <Badge
        className={`${colors[status]} border flex items-center gap-1 capitalize`}
      >
        {getAttendanceIcon(status)}
        {status}
      </Badge>
    );
  };

  const getLevelBadge = (level: Student["studentLevel"]) => {
    const colors = {
      beginner: "bg-blue-100 text-blue-700",
      intermediate: "bg-green-100 text-green-700",
      meton: "bg-purple-100 text-purple-700",
      ijaza: "bg-amber-100 text-amber-700",
    };
    return <Badge className={`${colors[level]} capitalize`}>{level}</Badge>;
  };

  const getGradeBadge = (grade?: string) => {
    if (!grade) return null;
    const isHighGrade = grade.startsWith("A");
    return (
      <Badge
        className={`${isHighGrade ? "bg-tarteel-gold text-white" : "bg-gray-200 text-gray-700"} font-bold`}
      >
        {grade}
      </Badge>
    );
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      filterLevel === "all" || student.studentLevel === filterLevel;
    const matchesAttendance =
      filterAttendance === "all" || student.attendance === filterAttendance;
    return matchesSearch && matchesLevel && matchesAttendance;
  });

  return (
    <div className="w-full space-y-4">
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-tarteel-maroon/10 to-tarteel-gold/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-tarteel-maroon flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Student Management
            </CardTitle>
            <Badge className="bg-tarteel-maroon text-white">
              {filteredStudents.length} Students
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="meton">Meton</option>
                <option value="ijaza">Ijaza</option>
              </select>
              <select
                value={filterAttendance}
                onChange={(e) => setFilterAttendance(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tarteel-maroon mx-auto mb-4"></div>
                <p className="text-sm">Loading students...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Student Name</TableHead>
                    <TableHead className="font-bold">Level</TableHead>
                    <TableHead className="font-bold">Attendance</TableHead>
                    <TableHead className="font-bold">Last Seen</TableHead>
                    <TableHead className="font-bold">Progress</TableHead>
                    <TableHead className="font-bold">Grade</TableHead>
                    <TableHead className="font-bold text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>
                          {getLevelBadge(student.studentLevel)}
                        </TableCell>
                        <TableCell>
                          {getAttendanceBadge(student.attendance)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {student.lastSeen || "N/A"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {student.progress || "N/A"}
                        </TableCell>
                        <TableCell>{getGradeBadge(student.grade)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => onRequestTest?.(student.id)}
                              className="bg-tarteel-gold hover:bg-tarteel-gold/90 text-white"
                            >
                              <FileText className="w-4 h-4 mr-1" /> Request Test
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onViewDetails?.(student.id)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Progress Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
