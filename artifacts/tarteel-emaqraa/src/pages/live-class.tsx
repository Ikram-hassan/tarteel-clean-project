"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mic,
  MicOff,
  LogOut,
  Settings,
  Monitor,
  MessageSquare,
  Hand,
  Users,
  Maximize,
  ShieldCheck,
} from "lucide-react";
import {
  LiveKitRoom,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, DataPacket_Kind, type RemoteParticipant } from "livekit-client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL ||
  "wss://tarteel-e-maqraa-ly5s2et3.livekit.cloud";

export default function LiveClass({ roomId }: { roomId?: string }) {
  const { user } = useAuth() as any;
  const params = useParams();
  const channelId = roomId || params.id || "default_room";
  const [, setLocation] = useLocation();

  const [token, setToken] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch LiveKit token from backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsConnecting(true);
        const response = await fetch(`${API_BASE_URL}/api/sessions/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: channelId,
            participantName: user?.name || user?.username || "Guest",
            participantId: user?.id || `guest_${Date.now()}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to get session token");
        }

        const data = await response.json();
        setToken(data.token);
        setError("");
      } catch (err: any) {
        console.error("Token fetch error:", err);
        setError(err.message || "Failed to connect to session");
      } finally {
        setIsConnecting(false);
      }
    };

    if (user) {
      fetchToken();
    }
  }, [channelId, user]);

  const handleDisconnect = () => {
    setLocation(
      user?.role === "student" ? "/dashboard/student" : "/dashboard/teacher",
    );
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-tarteel-maroon"></div>
          <p className="text-white font-semibold">Connecting to session...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h2 className="text-white text-xl font-bold">Connection Error</h2>
          <p className="text-slate-400">{error || "Unable to join session"}</p>
          <Button onClick={handleDisconnect} variant="secondary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={false} // Start with audio OFF by default
      video={false} // Strictly disable video
      onDisconnected={handleDisconnect}
      className="h-screen"
    >
      <LiveClassContent
        channelId={channelId}
        user={user}
        onLeave={handleDisconnect}
      />
    </LiveKitRoom>
  );
}

// Separate component to use LiveKit hooks
function LiveClassContent({
  channelId,
  user,
  onLeave,
}: {
  channelId: string;
  user: any;
  onLeave: () => void;
}) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const room = useRoomContext();

  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());

  // Listen for hand-raise data packets
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
    ) => {
      const decoder = new TextDecoder();
      const data = decoder.decode(payload);

      try {
        const message = JSON.parse(data);
        if (message.type === "hand-raise") {
          const participantId = participant?.identity || message.participantId;
          setRaisedHands((prev) => {
            const newSet = new Set(prev);
            if (message.raised) {
              newSet.add(participantId);
            } else {
              newSet.delete(participantId);
            }
            return newSet;
          });
        }
      } catch (e) {
        console.error("Failed to parse data packet:", e);
      }
    };

    room.on("dataReceived", handleDataReceived);

    return () => {
      room.off("dataReceived", handleDataReceived);
    };
  }, [room]);

  const isMuted = !localParticipant?.isMicrophoneEnabled;

  // Toggle microphone - physically enable/disable audio track
  const toggleMic = async () => {
    if (!localParticipant) return;

    try {
      await localParticipant.setMicrophoneEnabled(
        !localParticipant.isMicrophoneEnabled,
      );
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
    }
  };

  // Hand-raise feature - send data packet to all participants
  const toggleHandRaise = async () => {
    if (!room || !localParticipant) return;

    const newState = !isHandRaised;
    setIsHandRaised(newState);

    // Send data packet to all participants
    const encoder = new TextEncoder();
    const data = encoder.encode(
      JSON.stringify({
        type: "hand-raise",
        raised: newState,
        participantId: localParticipant.identity,
        participantName: localParticipant.name,
        timestamp: Date.now(),
      }),
    );

    try {
      await room.localParticipant.publishData(data, {
        reliable: true,
        destinationIdentities: [], // Empty array = broadcast to all
      });

      // Update local state
      setRaisedHands((prev) => {
        const newSet = new Set(prev);
        if (newState) {
          newSet.add(localParticipant.identity);
        } else {
          newSet.delete(localParticipant.identity);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Failed to send hand-raise signal:", error);
    }
  };

  // Get participant metadata
  const getParticipantMetadata = (participant: any) => {
    try {
      return participant.metadata ? JSON.parse(participant.metadata) : {};
    } catch {
      return {};
    }
  };

  // Check if participant is speaking
  const isParticipantSpeaking = (participant: any) => {
    return participant.isSpeaking;
  };

  // Handle real-time evaluation
  const handleEvaluation = async (participantId: string, grade: number) => {
    if (!room) return;

    // Send evaluation data packet
    const encoder = new TextEncoder();
    const data = encoder.encode(
      JSON.stringify({
        type: "evaluation",
        participantId,
        grade,
        evaluatorId: user?.id,
        evaluatorName: user?.name || user?.username,
        timestamp: Date.now(),
      }),
    );

    try {
      await room.localParticipant.publishData(data, {
        reliable: true,
        destinationIdentities: [participantId], // Send only to the evaluated student
      });

      // TODO: Also save to database
      console.log(`Evaluated ${participantId} with grade: ${grade}%`);
    } catch (error) {
      console.error("Failed to send evaluation:", error);
    }
  };

  // --- TEACHER & INTERVIEWER VIEW ---
  const StaffView = () => {
    const isInterviewer =
      user?.role === "interviewer" || user?.role === "admin";
    const isPlacementInterviewer =
      (user as any)?.interviewerType === "placement";

    // Filter out local participant from the list
    const remoteParticipants = participants.filter(
      (p) => p.identity !== localParticipant?.identity,
    );

    const displayStudents = isInterviewer
      ? remoteParticipants.slice(0, 3)
      : remoteParticipants.slice(0, 5);

    // State for placement decisions per student
    const [studentDecisions, setStudentDecisions] = useState<
      Record<
        string,
        {
          level: "beginner" | "intermediate" | "meton" | "ijaza" | null;
          juzRange?: number;
          assignedQiraat?: string;
        }
      >
    >({});

    // Handle level selection for a student
    const handleLevelSelection = (
      studentId: string,
      level: "beginner" | "intermediate" | "meton" | "ijaza",
    ) => {
      setStudentDecisions((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], level },
      }));
    };

    // Handle juz range selection for intermediate
    const handleJuzSelection = (studentId: string, juzRange: number) => {
      setStudentDecisions((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], juzRange },
      }));
    };

    // Handle Qira'at selection for ijaza
    const handleQiraatSelection = (studentId: string, qiraat: string) => {
      setStudentDecisions((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], assignedQiraat: qiraat },
      }));
    };

    // Assign level and trigger matching engine
    const handleAssignLevel = async (
      studentId: string,
      studentName: string,
    ) => {
      const decision = studentDecisions[studentId];
      if (!decision?.level) {
        alert("Please select a level first");
        return;
      }

      // Validate intermediate requires juz selection
      if (decision.level === "intermediate" && !decision.juzRange) {
        alert("Please select a Juz range for Intermediate level");
        return;
      }

      // Validate ijaza requires Qira'at selection
      if (decision.level === "ijaza" && !decision.assignedQiraat) {
        alert("Please select a Qira'at for Ijaza level");
        return;
      }

      console.log("🎯 PLACEMENT DECISION:", {
        studentId,
        studentName,
        decision,
      });

      // Call placement API with 5-point hierarchy
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/matching/placement-assign`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId,
              studentName,
              level: decision.level,
              juzRange:
                decision.level === "intermediate"
                  ? Number(decision.juzRange)
                  : null,
              assignedQiraat:
                decision.level === "ijaza" ? decision.assignedQiraat : null,
              interviewerId: user?.id,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          alert(
            `✅ SUCCESS!\n\nStudent: ${studentName}\nLevel: ${decision.level}${decision.juzRange ? ` (Juz ${decision.juzRange})` : ""}${decision.assignedQiraat ? ` (Qira'at: ${decision.assignedQiraat})` : ""}\nAssigned Teacher: ${data.placement.teacherName}\nMatch Score: ${data.placement.matchScore}/200`,
          );

          // Clear decision for this student
          setStudentDecisions((prev) => {
            const newDecisions = { ...prev };
            delete newDecisions[studentId];
            return newDecisions;
          });
        } else {
          alert(`❌ Assignment Failed:\n${data.error}`);
        }
      } catch (error: any) {
        console.error("Placement API Error:", error);
        alert(`❌ Network Error:\n${error.message}`);
      }
    };

    return (
      <div className="flex-1 flex overflow-hidden bg-slate-900">
        {/* Main Video Area */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
          {/* Host/Interviewer Card */}
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent z-10" />

            <div className="w-40 h-40 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-800 shadow-inner">
              <span className="text-6xl font-bold text-slate-700">
                {user?.username?.charAt(0).toUpperCase() ||
                  user?.name?.charAt(0).toUpperCase() ||
                  "T"}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-tarteel-maroon">
                <AvatarFallback className="bg-tarteel-maroon text-white text-xl uppercase">
                  {user?.username?.charAt(0) || user?.name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg text-white capitalize">
                    {user?.username || user?.name || "Staff"}
                  </p>
                  <ShieldCheck size={16} className="text-blue-400" />
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  {isInterviewer ? "Interview Lead" : "Main Instructor"}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20">
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/40 text-white hover:bg-black/60 rounded-full"
              >
                <Maximize size={18} />
              </Button>
            </div>
          </div>

          {/* Students Grid - Real LiveKit Participants */}
          <div
            className={`h-48 grid gap-4 ${isInterviewer ? "grid-cols-3" : "grid-cols-5"}`}
          >
            {displayStudents.map((participant: any) => {
              const metadata = getParticipantMetadata(participant);
              const isSpeaking = isParticipantSpeaking(participant);
              const isMuted = !participant.isMicrophoneEnabled;
              const hasHandRaised = raisedHands.has(participant.identity);

              return (
                <div
                  key={participant.identity}
                  className={`bg-slate-950 rounded-xl border-2 transition-all duration-300 relative overflow-hidden flex items-center justify-center ${isSpeaking ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "border-slate-800"}`}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-slate-800 text-slate-400 text-lg font-bold">
                      {participant.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="absolute bottom-2 left-2 z-20">
                    <p className="text-[11px] font-medium bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white border border-white/5 truncate max-w-[100px]">
                      {participant.name || "Unknown"}
                    </p>
                  </div>

                  <div className="absolute top-2 right-2 z-20 flex gap-1.5">
                    {hasHandRaised && (
                      <div className="bg-yellow-500 p-1 rounded-md animate-bounce">
                        <Hand size={10} className="text-black" />
                      </div>
                    )}
                    <div
                      className={`${isMuted ? "bg-red-500" : "bg-green-500"} p-1 rounded-md`}
                    >
                      {isMuted ? <MicOff size={10} /> : <Mic size={10} />}
                    </div>
                  </div>

                  {/* Strategic Routing Panel (Placement Interviewer Only) */}
                  {isPlacementInterviewer && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 z-30 opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-bold mb-2">
                        ASSIGN LEVEL
                      </p>
                      <div className="flex flex-col gap-1 w-full">
                        <button
                          onClick={() =>
                            handleLevelSelection(
                              participant.identity,
                              "beginner",
                            )
                          }
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                            studentDecisions[participant.identity]?.level ===
                            "beginner"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-600/50 text-white/70 hover:bg-blue-600"
                          }`}
                        >
                          Beginner
                        </button>
                        <button
                          onClick={() =>
                            handleLevelSelection(
                              participant.identity,
                              "intermediate",
                            )
                          }
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                            studentDecisions[participant.identity]?.level ===
                            "intermediate"
                              ? "bg-green-600 text-white"
                              : "bg-green-600/50 text-white/70 hover:bg-green-600"
                          }`}
                        >
                          Intermediate
                        </button>
                        {studentDecisions[participant.identity]?.level ===
                          "intermediate" && (
                          <div className="flex gap-1 flex-wrap">
                            {[5, 10, 15, 20, 25, 30].map((juz) => (
                              <button
                                key={juz}
                                onClick={() =>
                                  handleJuzSelection(participant.identity, juz)
                                }
                                className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                                  studentDecisions[participant.identity]
                                    ?.juzRange === juz
                                    ? "bg-tarteel-gold text-black"
                                    : "bg-green-700 text-white hover:bg-tarteel-gold hover:text-black"
                                }`}
                              >
                                {juz}
                              </button>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() =>
                            handleLevelSelection(participant.identity, "meton")
                          }
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                            studentDecisions[participant.identity]?.level ===
                            "meton"
                              ? "bg-purple-600 text-white"
                              : "bg-purple-600/50 text-white/70 hover:bg-purple-600"
                          }`}
                        >
                          Meton
                        </button>
                        <button
                          onClick={() =>
                            handleLevelSelection(participant.identity, "ijaza")
                          }
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                            studentDecisions[participant.identity]?.level ===
                            "ijaza"
                              ? "bg-amber-600 text-white"
                              : "bg-amber-600/50 text-white/70 hover:bg-amber-600"
                          }`}
                        >
                          Ijaza
                        </button>
                        {studentDecisions[participant.identity]?.level ===
                          "ijaza" && (
                          <select
                            onChange={(e) =>
                              handleQiraatSelection(
                                participant.identity,
                                e.target.value,
                              )
                            }
                            value={
                              studentDecisions[participant.identity]
                                ?.assignedQiraat || ""
                            }
                            className="text-[8px] font-bold px-1 py-1 rounded bg-amber-700 text-white w-full"
                          >
                            <option value="">Select Qira'at</option>
                            <option value="nafi">Nafi'</option>
                            <option value="ibn_kathir">Ibn Kathir</option>
                            <option value="abu_amr">Abu Amr</option>
                            <option value="ibn_amir">Ibn Amir</option>
                            <option value="asim">Asim</option>
                            <option value="hamzah">Hamzah</option>
                            <option value="al_kisai">Al-Kisa'i</option>
                            <option value="abu_jafar">Abu Ja'far</option>
                            <option value="yaqub">Yaqub</option>
                            <option value="khalaf">Khalaf al-Aishir</option>
                          </select>
                        )}
                        {studentDecisions[participant.identity]?.level && (
                          <button
                            onClick={() =>
                              handleAssignLevel(
                                participant.identity,
                                participant.name || "Student",
                              )
                            }
                            className="bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white text-[9px] font-bold px-2 py-1 rounded mt-1"
                          >
                            ✓ ASSIGN
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Real-time Evaluation Buttons (Teacher/Non-Placement Interviewer) */}
                  {(user?.role === "teacher" ||
                    (user?.role === "interviewer" &&
                      !isPlacementInterviewer)) && (
                    <div className="absolute bottom-2 right-2 z-20 flex gap-1">
                      <button
                        onClick={() =>
                          handleEvaluation(participant.identity, 100)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white text-[9px] font-bold px-2 py-1 rounded transition-all"
                        title="Perfect 100%"
                      >
                        100%
                      </button>
                      <button
                        onClick={() =>
                          handleEvaluation(participant.identity, 80)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold px-2 py-1 rounded transition-all"
                        title="Good 80%"
                      >
                        80%
                      </button>
                      <button
                        onClick={() =>
                          handleEvaluation(participant.identity, 60)
                        }
                        className="bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold px-2 py-1 rounded transition-all"
                        title="Acceptable 60%"
                      >
                        60%
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - Participants List */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col hidden lg:flex">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-bold flex items-center gap-2 text-slate-200">
              <Users size={18} className="text-tarteel-maroon" /> Participants
              <span className="ml-auto bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">
                {participants.length}
              </span>
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* Local Participant (You) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tarteel-maroon flex items-center justify-center text-[10px] font-bold">
                  {user?.username?.charAt(0) || user?.name?.charAt(0) || "Y"}
                </div>
                <p className="text-sm font-semibold">You (Staff)</p>
              </div>
              <div className="flex items-center gap-2">
                {isHandRaised && <Hand size={14} className="text-yellow-500" />}
                <Mic
                  size={14}
                  className={isMuted ? "text-red-500" : "text-green-500"}
                />
              </div>
            </div>

            {/* Remote Participants */}
            {participants
              .filter((p) => p.identity !== localParticipant?.identity)
              .map((participant: any) => {
                const metadata = getParticipantMetadata(participant);
                const hasHandRaised = raisedHands.has(participant.identity);
                const isMuted = !participant.isMicrophoneEnabled;

                return (
                  <div
                    key={participant.identity}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                        {participant.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "?"}
                      </div>
                      <p className="text-sm text-slate-300">
                        {participant.name || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasHandRaised && (
                        <Hand size={14} className="text-yellow-500" />
                      )}
                      <Mic
                        size={14}
                        className={
                          isMuted ? "text-slate-600" : "text-green-500"
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden"
      dir="ltr"
    >
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-md text-[10px] font-black animate-pulse flex items-center gap-2 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            LIVE
          </div>
          <h1 className="font-bold text-sm uppercase tracking-widest text-slate-200">
            {channelId?.replace("_", " ") || "Hifz Session"}
          </h1>
          <span className="text-slate-500 text-xs hidden md:block">
            | Instructor ID: {user?.id}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-slate-400 font-mono text-sm bg-slate-900 px-3 py-1 rounded border border-slate-800">
            {participants.length} participants
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:text-white"
          >
            <Settings size={18} />
          </Button>
        </div>
      </header>

      {/* Dynamic Content */}
      <main className="flex-1 flex overflow-hidden">
        <StaffView />
      </main>

      {/* Control Bar (Footer) */}
      <footer className="h-24 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-10 shrink-0">
        <div className="w-1/4 hidden md:block">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-slate-900 px-4 rounded-xl"
          >
            <Monitor size={20} className="mr-3 text-tarteel-maroon" /> Share
            Screen
          </Button>
        </div>

        <div className="flex items-center gap-6">
          {/* Microphone Toggle */}
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "secondary"}
            className={`rounded-2xl w-14 h-14 p-0 shadow-lg ${!isMuted && "bg-slate-800 text-white hover:bg-slate-700 border border-white/5"}`}
            onClick={toggleMic}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>

          {/* Hand Raise Button (Students Only) */}
          {user?.role === "student" && (
            <Button
              size="lg"
              variant="secondary"
              className={`rounded-2xl w-14 h-14 p-0 bg-slate-800 text-white border border-white/5 ${isHandRaised && "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"}`}
              onClick={toggleHandRaise}
            >
              <Hand size={24} />
            </Button>
          )}
        </div>

        <div className="w-1/4 flex justify-end gap-3">
          <Button
            variant="destructive"
            className="font-bold px-6 rounded-xl"
            onClick={onLeave}
          >
            <LogOut size={18} className="mr-2" /> Leave
          </Button>
        </div>
      </footer>
    </div>
  );
}
