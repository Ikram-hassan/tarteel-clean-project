import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
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
  level: "beginner" | "intermediate" | "meton" | "ijaza";
  attendance: "present" | "absent" | "late";
  lastSeen: string;
  progress: string;
  grade: string;
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

  // Mock data - replace with real data from API
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Ahmed Ali",
      level: "beginner",
      attendance: "present",
      lastSeen: "2 mins ago",
      progress: "Juz 1 - Page 15",
      grade: "A",
    },
    {
      id: "2",
      name: "Fatima Hassan",
      level: "intermediate",
      attendance: "present",
      lastSeen: "5 mins ago",
      progress: "Juz 10 - Page 185",
      grade: "A+",
    },
    {
      id: "3",
      name: "Omar Mohamed",
      level: "meton",
      attendance: "late",
      lastSeen: "15 mins ago",
      progress: "Jazariyyah - Line 45",
      grade: "B+",
    },
    {
      id: "4",
      name: "Aisha Ibrahim",
      level: "ijaza",
      attendance: "absent",
      lastSeen: "2 hours ago",
      progress: "Qira'at Nafi' - Surah Al-Baqarah",
      grade: "A",
    },
    {
      id: "5",
      name: "Yusuf Abdullah",
      level: "beginner",
      attendance: "present",
      lastSeen: "1 min ago",
      progress: "Juz 2 - Page 25",
      grade: "B",
    },
  ]);

  const getAttendanceIcon = (status: Student["attendance"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "absent":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "late":
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getAttendanceBadge = (status: Student["attendance"]) => {
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

  const getLevelBadge = (level: Student["level"]) => {
    const colors = {
      beginner: "bg-blue-100 text-blue-700",
      intermediate: "bg-green-100 text-green-700",
      meton: "bg-purple-100 text-purple-700",
      ijaza: "bg-amber-100 text-amber-700",
    };
    return <Badge className={`${colors[level]} capitalize`}>{level}</Badge>;
  };

  const getGradeBadge = (grade: string) => {
    const isHighGrade = grade.startsWith("A");
    return (
      <Badge
        className={`${
          isHighGrade
            ? "bg-tarteel-gold text-white"
            : "bg-gray-200 text-gray-700"
        } font-bold`}
      >
        {grade}
      </Badge>
    );
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "all" || student.level === filterLevel;
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
          {/* Search and Filters */}
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

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
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
                      <TableCell>{getLevelBadge(student.level)}</TableCell>
                      <TableCell>
                        {getAttendanceBadge(student.attendance)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {student.lastSeen}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {student.progress}
                      </TableCell>
                      <TableCell>{getGradeBadge(student.grade)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => onRequestTest?.(student.id)}
                            className="bg-tarteel-gold hover:bg-tarteel-gold/90 text-white"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Request Test
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
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
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
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold text-green-600">
                  {students.filter((s) => s.attendance === "present").length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Present</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-2xl font-bold text-amber-600">
                  {students.filter((s) => s.attendance === "late").length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Late</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-2xl font-bold text-red-600">
                  {students.filter((s) => s.attendance === "absent").length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Absent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
