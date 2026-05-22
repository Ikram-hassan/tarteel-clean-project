import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";

interface StudentMotivationBoardProps {
  studentLevel: "beginner" | "intermediate" | "ijaza";
  qiraatName?: string;
  completedJuz?: number[];
  onJuzClick?: (juzNumber: number) => void;
}

export function StudentMotivationBoard({
  studentLevel,
  qiraatName,
  completedJuz = [],
  onJuzClick,
}: StudentMotivationBoardProps) {
  const [localCompletedJuz, setLocalCompletedJuz] =
    useState<number[]>(completedJuz);

  // Beginner Skills Checklist
  const beginnerSkills = [
    { id: 1, name: "Exit Points of Letters (Makharij)", completed: false },
    { id: 2, name: "Letter Attributes (Sifaat)", completed: false },
    { id: 3, name: "Rules of Meem Sakenah", completed: false },
    { id: 4, name: "Rules of Noon Sakenah & Tanween", completed: false },
    { id: 5, name: "Madd (Elongation) Rules", completed: false },
    { id: 6, name: "Qalqalah (Echoing)", completed: false },
    { id: 7, name: "Ghunnah (Nasalization)", completed: false },
    { id: 8, name: "Idgham (Merging)", completed: false },
  ];

  const [beginnerProgress, setBeginnerProgress] = useState(beginnerSkills);

  const toggleBeginnerSkill = (skillId: number) => {
    setBeginnerProgress((prev) =>
      prev.map((skill) =>
        skill.id === skillId
          ? { ...skill, completed: !skill.completed }
          : skill,
      ),
    );
  };

  const handleJuzClick = (juzNumber: number) => {
    setLocalCompletedJuz((prev) => {
      if (prev.includes(juzNumber)) {
        return prev.filter((j) => j !== juzNumber);
      } else {
        return [...prev, juzNumber];
      }
    });
    onJuzClick?.(juzNumber);
  };

  // Beginner View
  if (studentLevel === "beginner") {
    const completedCount = beginnerProgress.filter((s) => s.completed).length;
    const progressPercentage = (completedCount / beginnerProgress.length) * 100;

    return (
      <Card className="rounded-[2.5rem] p-8 bg-gradient-to-br from-blue-50 to-white shadow-sm border-none">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Tajweed Skills Progress
          </h3>
          <Badge className="bg-blue-600 text-white px-4 py-1.5 text-sm font-bold">
            {completedCount}/{beginnerProgress.length} Complete
          </Badge>
        </div>

        <div className="mb-6">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center font-bold">
            {progressPercentage.toFixed(0)}% Mastered
          </p>
        </div>

        <div className="space-y-3">
          {beginnerProgress.map((skill) => (
            <motion.div
              key={skill.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleBeginnerSkill(skill.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
                skill.completed
                  ? "bg-blue-100 border-2 border-blue-600"
                  : "bg-white border-2 border-slate-100 hover:border-blue-300"
              }`}
            >
              {skill.completed ? (
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-bold ${
                  skill.completed ? "text-blue-900" : "text-slate-600"
                }`}
              >
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-l-4 border-blue-600">
          <p className="text-xs text-blue-900 font-bold">
            💡 Tip: Click on each skill to mark it as completed. This is for
            your motivation only!
          </p>
        </div>
      </Card>
    );
  }

  // Intermediate & Ijaza View (30 Juz Grid)
  return (
    <Card className="rounded-[2.5rem] p-8 bg-gradient-to-br from-green-50 to-white shadow-sm border-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <Award size={20} className="text-tarteel-gold" />
            Khatmah Progress (30 Juz)
          </h3>
          {studentLevel === "ijaza" && qiraatName && (
            <Badge className="bg-tarteel-gold text-slate-900 px-3 py-1 text-xs font-bold mt-2">
              Qira'ah: {qiraatName}
            </Badge>
          )}
        </div>
        <Badge className="bg-green-600 text-white px-4 py-1.5 text-sm font-bold">
          {localCompletedJuz.length}/30 Complete
        </Badge>
      </div>

      <div className="mb-6">
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(localCompletedJuz.length / 30) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-green-500 to-tarteel-gold"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center font-bold">
          {((localCompletedJuz.length / 30) * 100).toFixed(0)}% Completed
        </p>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
          const isCompleted = localCompletedJuz.includes(juz);
          return (
            <motion.div
              key={juz}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleJuzClick(juz)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black cursor-pointer border-2 transition-all ${
                isCompleted
                  ? "bg-tarteel-gold border-tarteel-gold text-slate-900 shadow-lg shadow-tarteel-gold/30"
                  : "bg-white border-slate-200 text-slate-400 hover:border-green-500 hover:text-green-600"
              }`}
            >
              {juz}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-2xl border-l-4 border-green-600">
        <p className="text-xs text-green-900 font-bold">
          ✨ Click on each Juz number to mark it as completed. Watch them turn
          into Glowing Gold!
        </p>
      </div>
    </Card>
  );
}
