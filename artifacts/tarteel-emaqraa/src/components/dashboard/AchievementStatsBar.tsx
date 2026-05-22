import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface StatItem {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  glowColor: string;
}

interface AchievementStatsBarProps {
  userRole: "teacher" | "interviewer" | "student" | "admin";
  teacherType?: "beginner" | "intermediate" | "meton" | "ijaza";
  stats?: {
    totalStudents?: number;
    activeClasses?: number;
    completedSessions?: number;
    averageRating?: number;
    workHours?: number;
    certifications?: number;
  };
}

export function AchievementStatsBar({
  userRole,
  teacherType,
  stats = {},
}: AchievementStatsBarProps) {
  const [goldenGlowEnabled, setGoldenGlowEnabled] = useState(true);

  // Default stats
  const {
    totalStudents = 0,
    activeClasses = 0,
    completedSessions = 0,
    averageRating = 5.0,
    workHours = 0,
    certifications = 0,
  } = stats;

  // Stats configuration based on user role
  const getStatsConfig = (): StatItem[] => {
    if (userRole === "teacher" && teacherType === "meton") {
      // Meton Teachers: 6 text icons with Golden Glow toggle
      return [
        {
          id: "tuhfat",
          icon: BookOpen,
          label: "Tuhfat al-Atfal",
          value: "📖",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
        {
          id: "jazariyyah",
          icon: BookOpen,
          label: "Jazariyyah",
          value: "📚",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
        {
          id: "shatibiyyah",
          icon: BookOpen,
          label: "Shatibiyyah",
          value: "📜",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
        {
          id: "durrah",
          icon: BookOpen,
          label: "Durrah",
          value: "💎",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
        {
          id: "tayyibat",
          icon: BookOpen,
          label: "Tayyibat al-Nashr",
          value: "🌟",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
        {
          id: "salsabil",
          icon: BookOpen,
          label: "Salsabil",
          value: "💧",
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_20px_rgba(212,175,55,0.6)]",
        },
      ];
    }

    if (userRole === "teacher" || userRole === "interviewer") {
      return [
        {
          id: "students",
          icon: Users,
          label: "Total Students",
          value: totalStudents,
          color: "text-tarteel-maroon",
          glowColor: "shadow-[0_0_15px_rgba(128,0,0,0.3)]",
        },
        {
          id: "classes",
          icon: BookOpen,
          label: "Active Classes",
          value: activeClasses,
          color: "text-tarteel-gold",
          glowColor: "shadow-[0_0_15px_rgba(212,175,55,0.4)]",
        },
        {
          id: "sessions",
          icon: CheckCircle,
          label: "Completed Sessions",
          value: completedSessions,
          color: "text-green-600",
          glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        },
        {
          id: "rating",
          icon: Award,
          label: "Average Rating",
          value: averageRating.toFixed(1),
          color: "text-amber-500",
          glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
        },
        {
          id: "hours",
          icon: Clock,
          label: "Work Hours",
          value: workHours,
          color: "text-blue-600",
          glowColor: "shadow-[0_0_15px_rgba(37,99,235,0.3)]",
        },
        {
          id: "certs",
          icon: TrendingUp,
          label: "Certifications",
          value: certifications,
          color: "text-purple-600",
          glowColor: "shadow-[0_0_15px_rgba(147,51,234,0.3)]",
        },
      ];
    }

    // Student stats
    return [
      {
        id: "attendance",
        icon: CheckCircle,
        label: "Attendance",
        value: "95%",
        color: "text-green-600",
        glowColor: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
      },
      {
        id: "progress",
        icon: TrendingUp,
        label: "Progress",
        value: "Juz 5",
        color: "text-tarteel-gold",
        glowColor: "shadow-[0_0_15px_rgba(212,175,55,0.4)]",
      },
      {
        id: "sessions",
        icon: BookOpen,
        label: "Sessions",
        value: completedSessions,
        color: "text-tarteel-maroon",
        glowColor: "shadow-[0_0_15px_rgba(128,0,0,0.3)]",
      },
      {
        id: "grade",
        icon: Award,
        label: "Grade",
        value: "A",
        color: "text-amber-500",
        glowColor: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
      },
    ];
  };

  const statsConfig = getStatsConfig();
  const isMetonTeacher = userRole === "teacher" && teacherType === "meton";

  return (
    <div className="w-full">
      {/* Header with Golden Glow Toggle for Meton Teachers */}
      {isMetonTeacher && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-tarteel-maroon">
            Meton Texts Mastery
          </h3>
          <button
            onClick={() => setGoldenGlowEnabled(!goldenGlowEnabled)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              goldenGlowEnabled
                ? "bg-tarteel-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            ✨ Golden Glow {goldenGlowEnabled ? "ON" : "OFF"}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div
        className={`grid gap-4 ${
          isMetonTeacher
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        }`}
      >
        {statsConfig.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 bg-white border-2 border-gray-100 hover:border-tarteel-gold transition-all ${
                isMetonTeacher && goldenGlowEnabled ? stat.glowColor : ""
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                {isMetonTeacher ? (
                  // Meton: Display text icon (emoji)
                  <div
                    className={`text-4xl ${
                      goldenGlowEnabled
                        ? "filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                        : ""
                    }`}
                  >
                    {stat.value}
                  </div>
                ) : (
                  // Regular: Display Lucide icon
                  <div
                    className={`w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon size={24} />
                  </div>
                )}

                <div className="space-y-1">
                  {!isMetonTeacher && (
                    <p className="text-2xl font-bold text-tarteel-maroon">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info for Meton Teachers */}
      {isMetonTeacher && (
        <div className="mt-4 p-3 bg-tarteel-gold/10 border border-tarteel-gold/30 rounded-lg">
          <p className="text-sm text-tarteel-maroon text-center">
            <span className="font-bold">Master Status:</span> Expert in all 6
            classical Tajweed texts
          </p>
        </div>
      )}
    </div>
  );
}
