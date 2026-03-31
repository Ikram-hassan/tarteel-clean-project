import { MessageCircle, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-tarteel-gold hover:bg-tarteel-gold/90 text-tarteel-maroon shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle size={28} />
      </Button>
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full bg-tarteel-maroon hover:bg-tarteel-maroon/90 text-white shadow-lg transition-transform hover:scale-110"
      >
        <Headset size={28} />
      </Button>
    </div>
  );
}
