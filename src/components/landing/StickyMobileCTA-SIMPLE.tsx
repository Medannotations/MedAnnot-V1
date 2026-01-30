// EMERGENCY STICKY CTA TEST - Simple version to verify deployment
import { Button } from "@/components/ui/button";

interface StickyMobileCTAProps {
  onGetStarted: () => void;
}

export function StickyMobileCTA({ onGetStarted }: StickyMobileCTAProps) {
  // FORCE VISIBLE FOR TESTING - Remove scroll logic for now
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex-1">
          <div className="text-xs text-emerald-600 font-bold mb-1">
            🔥 127+ infirmiers actifs
          </div>
          <div className="text-sm text-gray-800 font-semibold">
            Commencer votre essai gratuit
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={onGetStarted}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg"
        >
          Essai gratuit
        </Button>
      </div>
    </div>
  );
}