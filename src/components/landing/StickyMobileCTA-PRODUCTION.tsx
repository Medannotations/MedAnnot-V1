import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface StickyMobileCTAProps {
  onGetStarted: () => void;
}

export function StickyMobileCTA({ onGetStarted }: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-4 shadow-2xl">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1">
          <div className="text-xs text-cyan-400 font-semibold mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Essai gratuit 7 jours
          </div>
          <div className="text-sm text-white font-medium">
            Testez sans engagement
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={onGetStarted}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
        >
          Commencer
        </Button>
      </div>
    </div>
  );
}
