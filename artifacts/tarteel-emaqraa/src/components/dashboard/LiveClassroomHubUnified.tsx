import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Radio,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: "A" | "B" | "C" | "D" | "MAIN";
  name: string;
  status: "active" | "idle" | "full";
  participants: number;
  maxParticipants: number;
  color: string;
  bgColor: string;
}

interface WaitingStudent {
  id: string;
  name: string;
  studentLevel: string;
  waitTime?: number;
  createdAt?: string;
}

interface LiveClassroomHubUnifiedProps {
  userRole: "teacher" | "interviewer";
  teacherType?: "beginner" | "intermediate" | "meton" | "ijaza";
  interviewerType?: "placement" | "hifz" | "ijaza";
  onJoinRoom?: (roomId: string) => void;
  onLeaveRoom?: () => void;
}

const API_BASE_URL = "https://tarteel-monorepo-api-server-v6ry.vercel.app";

export function LiveClassroomHubUnified({
  userRole,
  teacherType,
  interviewerType,
  onJoinRoom,
  onLeaveRoom,
}: LiveClassroomHubUnifiedProps) {
  // Determine room configuration based on role and type
  const getRoomConfiguration = (): Room[] => {
    // Beginner & Meton: Single large hall (20 students)
    if (teacherType === "beginner" || teacherType === "meton") {
      return [
        {
          id: "MAIN",
          name: `${teacherType === "beginner" ? "Beginner" : "Meton"} Main Hall`,
          status: "idle",
          participants: 0,
          maxParticipants: 20,
          color: "text-tarteel-maroon",
          bgColor: "bg-tarteel-maroon/10",
        },
      ];
    }

    // Intermediate & Ijaza: 4 Parallel Rooms (5 students each)
    if (teacherType === "intermediate" || teacherType === "ijaza") {
      return [
        {
          id: "A",
          name: "Room A",
          status: "idle",
          participants: 0,
          maxParticipants: 5,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          id: "B",
          name: "Room B",
          status: "idle",
          participants: 0,
          maxParticipants: 5,
          color: "text-green-600",
          bgColor: "bg-green-50",
        },
        {
          id: "C",
          name: "Room C",
          status: "idle",
          participants: 0,
          maxParticipants: 5,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          id: "D",
          name: "Room D",
          status: "idle",
          participants: 0,
          maxParticipants: 5,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
        },
      ];
    }

    // Interviewers: 3-student capacity
    return [
      {
        id: "MAIN",
        name: "Interview Room",
        status: "idle",
        participants: 0,
        maxParticipants: 3,
        color: "text-tarteel-gold",
        bgColor: "bg-tarteel-gold/10",
      },
    ];
  };

  const [rooms, setRooms] = useState<Room[]>(getRoomConfiguration());
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Interviewer-specific state
  const [waitingStudents, setWaitingStudents] = useState<WaitingStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set(),
  );
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const isInterviewer = userRole === "interviewer";
  const isPlacementInterviewer = interviewerType === "placement";

  // Fetch waiting students from API with 10-second polling
  useEffect(() => {
    if (!isInterviewer) return;

    const fetchWaitingStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const response = await fetch(
          `${API_BASE_URL}/api/matching/waiting-students`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch waiting students");
        }

        const data = await response.json();

        // Map API response to component format
        const mappedStudents: WaitingStudent[] = data.waitingStudents.map(
          (student: any) => {
            // Calculate wait time in minutes
            const waitTime = student.createdAt
              ? Math.floor(
                  (Date.now() - new Date(student.createdAt).getTime()) / 60000,
                )
              : 0;

            return {
              id: student.id,
              name: student.name,
              studentLevel: student.studentLevel || "New",
              waitTime,
              createdAt: student.createdAt,
            };
          },
        );

        setWaitingStudents(mappedStudents);
      } catch (error) {
        console.error("Error fetching waiting students:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    // Initial fetch
    fetchWaitingStudents();

    // Set up 10-second polling interval
    const intervalId = setInterval(fetchWaitingStudents, 10000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [isInterviewer]);

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              status: "active" as const,
              participants: room.participants + 1,
            }
          : room,
      ),
    );
    onJoinRoom?.(roomId);
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === currentRoom
            ? {
                ...room,
                status: "idle" as const,
                participants: Math.max(0, room.participants - 1),
              }
            : room,
        ),
      );
      setCurrentRoom(null);
      onLeaveRoom?.();
    }
  };

  // Interviewer: Start test with selected students
  const handleStartTest = () => {
    if (selectedStudents.size !== 3) {
      alert("Please select exactly 3 students");
      return;
    }
    setIsSessionActive(true);
    handleJoinRoom("MAIN");
    // TODO: Send "Join Now" alerts to selected students
    console.log("Starting test with students:", Array.from(selectedStudents));
  };

  // Interviewer: Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        if (newSet.size < 3) {
          newSet.add(studentId);
        }
      }
      return newSet;
    });
  };

  // Interviewer: Placement decision
  const handlePlacementDecision = (
    decision: "beginner" | "intermediate" | "meton" | "ijaza",
    juzRange?: number,
  ) => {
    console.log("Placement decision:", decision, juzRange);
    // TODO: Trigger matching engine
  };

  const getRoomStatusIcon = (status: Room["status"]) => {
    switch (status) {
      case "active":
        return <Radio className="w-4 h-4 text-green-500 animate-pulse" />;
      case "full":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-tarteel-maroon">
            {isInterviewer ? "Interview Control Center" : "Live Classroom Hub"}
          </h2>
          <p className="text-sm text-gray-600">
            {isInterviewer
              ? `${interviewerType} Interviewer - Summoning System`
              : `${teacherType} Teacher - ${rooms.length === 1 ? "Single Hall" : "4 Parallel Rooms"}`}
          </p>
        </div>
        {currentRoom && (
          <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
            <Radio className="w-4 h-4 mr-2 animate-pulse" />
            Live in {rooms.find((r) => r.id === currentRoom)?.name}
          </Badge>
        )}
      </div>

      {/* Interviewer Waiting Room */}
      {isInterviewer && !isSessionActive && (
        <Card className="border-2 border-tarteel-gold">
          <CardHeader className="bg-tarteel-gold/10">
            <CardTitle className="text-tarteel-maroon flex items-center gap-2">
              <Users className="w-5 h-5" />
              Waiting Room ({waitingStudents.length}/20)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {isLoadingStudents && waitingStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tarteel-maroon mx-auto mb-2"></div>
                <p className="text-sm">Loading waiting students...</p>
              </div>
            ) : waitingStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No students waiting</p>
              </div>
            ) : (
              <div className="space-y-2">
                {waitingStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => toggleStudentSelection(student.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStudents.has(student.id)
                        ? "border-tarteel-gold bg-tarteel-gold/10"
                        : "border-gray-200 hover:border-tarteel-maroon"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          selectedStudents.has(student.id)
                            ? "bg-tarteel-gold text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {student.studentLevel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {student.waitTime || 0}m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleStartTest}
              disabled={selectedStudents.size !== 3}
              className="w-full bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white h-12 text-lg font-bold"
            >
              <Bell className="w-5 h-5 mr-2" />
              Start Test with {selectedStudents.size}/3 Students
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Rooms Grid */}
      {(!isInterviewer || isSessionActive) && (
        <div
          className={`grid gap-4 ${
            rooms.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`border-2 transition-all ${
                  currentRoom === room.id
                    ? "border-tarteel-gold shadow-lg shadow-tarteel-gold/30"
                    : "border-gray-200 hover:border-tarteel-maroon"
                }`}
              >
                <CardHeader className={`${room.bgColor} pb-3`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg ${room.color}`}>
                      {room.name}
                    </CardTitle>
                    {getRoomStatusIcon(room.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {/* Participants */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Participants</span>
                    </div>
                    <span className="font-bold text-tarteel-maroon">
                      {room.participants}/{room.maxParticipants}
                    </span>
                  </div>

                  {/* Join/Leave Button */}
                  {currentRoom === room.id ? (
                    <Button
                      onClick={handleLeaveRoom}
                      variant="destructive"
                      className="w-full"
                    >
                      Leave Room
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={
                        currentRoom !== null ||
                        room.participants >= room.maxParticipants
                      }
                      className="w-full bg-tarteel-maroon hover:bg-tarteel-maroon/90"
                    >
                      Join Room
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Audio Controls (when in a room) */}
      <AnimatePresence>
        {currentRoom && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-tarteel-gold bg-gradient-to-r from-tarteel-gold/10 to-tarteel-maroon/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-6">
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant={isMuted ? "destructive" : "default"}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    variant={isSpeakerOn ? "default" : "outline"}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                  >
                    {isSpeakerOn ? (
                      <Volume2 className="w-6 h-6" />
                    ) : (
                      <VolumeX className="w-6 h-6" />
                    )}
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  {isMuted ? "Microphone is muted" : "Microphone is active"} •{" "}
                  {isSpeakerOn ? "Speaker is on" : "Speaker is off"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placement Interviewer Decision Tree */}
      {isPlacementInterviewer && isSessionActive && (
        <Card className="border-2 border-tarteel-gold">
          <CardHeader className="bg-tarteel-gold/10">
            <CardTitle className="text-tarteel-maroon flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Placement Decision Tree
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Decision Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handlePlacementDecision("beginner")}
                className="bg-blue-600 hover:bg-blue-700 h-12"
              >
                → Beginner
              </Button>
              <div className="space-y-2">
                <Button
                  onClick={() => handlePlacementDecision("intermediate", 5)}
                  className="bg-green-600 hover:bg-green-700 w-full text-xs"
                >
                  → Intermediate (Juz 5)
                </Button>
                <div className="grid grid-cols-5 gap-1">
                  {[10, 15, 20, 25, 30].map((juz) => (
                    <Button
                      key={juz}
                      onClick={() =>
                        handlePlacementDecision("intermediate", juz)
                      }
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-[10px] px-1"
                    >
                      {juz}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => handlePlacementDecision("meton")}
                className="bg-purple-600 hover:bg-purple-700 h-12"
              >
                → Meton
              </Button>
              <Button
                onClick={() => handlePlacementDecision("ijaza")}
                className="bg-amber-600 hover:bg-amber-700 h-12"
              >
                → Ijaza
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hifz/Ijaza Interviewer: Promotion & Certificate */}
      {(interviewerType === "hifz" || interviewerType === "ijaza") &&
        isSessionActive && (
          <Card className="border-2 border-tarteel-gold">
            <CardHeader className="bg-tarteel-gold/10">
              <CardTitle className="text-tarteel-maroon">
                {interviewerType === "hifz"
                  ? "Hifz Promotion"
                  : "Ijaza Certification"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Promote Student
              </Button>
              <Button className="w-full bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon font-bold">
                <CheckCircle className="w-4 h-4 mr-2" />
                Request Certificate
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
