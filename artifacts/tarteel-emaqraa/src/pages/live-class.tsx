import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, Hand, MessageSquare, LogOut, Settings, Users, Monitor, Maximize } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LiveClass() {
  const { t, dir } = useLanguage();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Mock data
  const students = [
    { id: 1, name: "Omar Ali", isSpeaking: false, isMuted: true, handRaised: true },
    { id: 2, name: "Fatima Noor", isSpeaking: true, isMuted: false, handRaised: false },
    { id: 3, name: "Ahmed Hassan", isSpeaking: false, isMuted: true, handRaised: false },
    { id: 4, name: "Khadija Said", isSpeaking: false, isMuted: true, handRaised: false },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden" dir={dir}>
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-md text-sm font-bold animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            LIVE
          </div>
          <h1 className="font-bold text-lg">Group A - Hifz & Saba' Review</h1>
          <span className="text-slate-400 text-sm">| Sh. Abdullahi</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-slate-300 font-mono">45:12</div>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Settings size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Area */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Main Speaker/Teacher */}
          <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none" />
            
            <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
              <VideoOff size={48} className="text-slate-500" />
            </div>

            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-green-500">
                <AvatarFallback className="bg-tarteel-maroon text-white">SA</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">Sh. Abdullahi</p>
                <p className="text-xs text-slate-400">Teacher</p>
              </div>
            </div>
            
            <div className="absolute top-4 right-4 z-20">
              <Button size="icon" variant="ghost" className="bg-black/50 text-white hover:bg-black/70">
                <Maximize size={18} />
              </Button>
            </div>
          </div>

          {/* Students Grid */}
          <div className="h-48 grid grid-cols-4 gap-4">
            {students.map((student) => (
              <div key={student.id} className={`bg-slate-950 rounded-xl border relative overflow-hidden flex items-center justify-center ${student.isSpeaking ? 'border-green-500' : 'border-slate-800'}`}>
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-slate-800 text-slate-300 text-lg">{student.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="absolute bottom-2 left-2 z-20">
                  <p className="text-xs font-medium bg-black/60 px-2 py-1 rounded truncate max-w-[100px]">{student.name}</p>
                </div>
                
                <div className="absolute top-2 right-2 z-20 flex gap-1">
                  {student.isMuted ? (
                    <div className="bg-red-500/80 p-1 rounded-full"><MicOff size={12} /></div>
                  ) : (
                    <div className="bg-green-500/80 p-1 rounded-full"><Mic size={12} /></div>
                  )}
                  {student.handRaised && (
                    <div className="bg-yellow-500/80 p-1 rounded-full"><Hand size={12} /></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <Users size={18} /> Participants (5)
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {/* Teacher */}
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-tarteel-maroon text-white text-xs">SA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Sh. Abdullahi</p>
                  <p className="text-[10px] text-slate-400">Teacher</p>
                </div>
              </div>
              <Mic size={14} className="text-green-500" />
            </div>

            <div className="my-2 border-t border-slate-800"></div>

            {/* Students */}
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-slate-800 text-xs">{student.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{student.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {student.handRaised && <Hand size={14} className="text-yellow-500" />}
                  {student.isMuted ? <MicOff size={14} className="text-red-500" /> : <Mic size={14} className="text-green-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-20 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-8">
        <div className="w-1/3">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
            <Monitor size={20} className="mr-2" /> Share Screen
          </Button>
        </div>

        <div className="w-1/3 flex justify-center gap-4">
          <Button 
            size="lg"
            variant={isMuted ? "destructive" : "secondary"} 
            className={`rounded-full w-14 h-14 p-0 ${!isMuted && 'bg-slate-800 text-white hover:bg-slate-700'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>
          
          <Button 
            size="lg"
            variant={isVideoOff ? "destructive" : "secondary"} 
            className={`rounded-full w-14 h-14 p-0 ${!isVideoOff && 'bg-slate-800 text-white hover:bg-slate-700'}`}
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </Button>

          <Button 
            size="lg"
            variant="secondary"
            className={`rounded-full w-14 h-14 p-0 bg-slate-800 text-white hover:bg-slate-700 ${isHandRaised && 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'}`}
            onClick={() => setIsHandRaised(!isHandRaised)}
          >
            <Hand size={24} />
          </Button>
        </div>

        <div className="w-1/3 flex justify-end gap-4">
          <Button 
            variant="secondary" 
            className="bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare size={20} className="mr-2" /> Chat
          </Button>
          <Button asChild variant="destructive" className="font-bold">
            <Link href="/dashboard">
              <LogOut size={18} className="mr-2" /> Leave
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
