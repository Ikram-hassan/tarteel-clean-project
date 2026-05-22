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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: "A" | "B" | "C" | "D";
  name: string;
  status: "active" | "idle" | "full";
  participants: number;
  maxParticipants: number;
  color: string;
  bgColor: string;
}

interface PlacementDecision {
  studentId: string;
  studentName: string;
  decision: "beginner" | "intermediate" | "meton" | "ijaza";
  timestamp: Date;
}

interface LiveClassroomHubProps {
  userRole: "teacher" | "interviewer";
  interviewerType?: "placement" | "hifz" | "ijaza";
  onJoinRoom?: (roomId: string) => void;
  onLeaveRoom?: () => void;
}

export function LiveClassroomHub({
  userRole,
  interviewerType,
  onJoinRoom,
  onLeaveRoom,
}: LiveClassroomHubProps) {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "A",
      name: "Room A - Beginner",
      status: "idle",
      participants: 0,
      maxParticipants: 5,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "B",
      name: "Room B - Intermediate",
      status: "idle",
      participants: 0,
      maxParticipants: 5,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "C",
      name: "Room C - Meton",
      status: "idle",
      participants: 0,
      maxParticipants: 5,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "D",
      name: "Room D - Ijaza",
      status: "idle",
      participants: 0,
      maxParticipants: 5,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]);

  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [placementDecisions, setPlacementDecisions] = useState<
    PlacementDecision[]
  >([]);

  const isPlacementInterviewer =
    userRole === "interviewer" && interviewerType === "placement";

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

  const handlePlacementDecision = (
    decision: "beginner" | "intermediate" | "meton" | "ijaza",
  ) => {
    const newDecision: PlacementDecision = {
      studentId: `STU-${Date.now()}`,
      studentName: "Student Name",
      decision,
      timestamp: new Date(),
    };
    setPlacementDecisions((prev) => [newDecision, ...prev].slice(0, 5));
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
            Live Classroom Hub
          </h2>
          <p className="text-sm text-gray-600">
            {isPlacementInterviewer
              ? "Placement Interviewer - Decision Tree Mode"
              : "4 Parallel Voice Rooms"}
          </p>
        </div>
        {currentRoom && (
          <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
            <Radio className="w-4 h-4 mr-2 animate-pulse" />
            Live in Room {currentRoom}
          </Badge>
        )}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    Room {room.id}
                  </CardTitle>
                  {getRoomStatusIcon(room.status)}
                </div>
                <p className="text-xs text-gray-600">{room.name}</p>
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

                {/* Evaluation Buttons (when in room) */}
                {currentRoom === room.id && (
                  <div className="space-y-2 border-t pt-3">
                    <p className="text-xs font-bold text-gray-600 uppercase">
                      Quick Evaluation
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                        onClick={() => console.log("Perfect 100%")}
                      >
                        ✓ 100%
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
                        onClick={() => console.log("Good 80%")}
                      >
                        ✓ 80%
                      </Button>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                        onClick={() => console.log("Acceptable 60%")}
                      >
                        ✓ 60%
                      </Button>
                    </div>
                  </div>
                )}

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
      {isPlacementInterviewer && (
        <Card className="border-2 border-tarteel-gold">
          <CardHeader className="bg-tarteel-gold/10">
            <CardTitle className="text-tarteel-maroon flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Placement Decision Tree
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Decision Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => handlePlacementDecision("beginner")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                → Beginner
              </Button>
              <Button
                onClick={() => handlePlacementDecision("intermediate")}
                className="bg-green-600 hover:bg-green-700"
              >
                → Intermediate
              </Button>
              <Button
                onClick={() => handlePlacementDecision("meton")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                → Meton
              </Button>
              <Button
                onClick={() => handlePlacementDecision("ijaza")}
                className="bg-amber-600 hover:bg-amber-700"
              >
                → Ijaza
              </Button>
            </div>

            {/* Recent Decisions */}
            {placementDecisions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-bold text-gray-700">
                  Recent Decisions
                </h4>
                <div className="space-y-2">
                  {placementDecisions.map((decision, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">
                          {decision.studentName}
                        </span>
                      </div>
                      <Badge className="capitalize">{decision.decision}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
