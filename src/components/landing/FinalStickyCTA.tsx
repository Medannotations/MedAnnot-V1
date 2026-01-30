// ABSOLUTE FINAL CLEAN VERSION - Zero tolerance for failure

import React from 'react';

interface FinalStickyCTAProps {
  onGetStarted: () => void;
}

export function FinalStickyCTA({ onGetStarted }: FinalStickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex-1">
            <div className="text-xs text-emerald-600 font-semibold mb-1">
              127+ infirmiers actifs
            </div>
            <div className="text-sm text-gray-800 font-medium">
              Commencer votre essai gratuit
            </div>
          </div>
          
          <button
            onClick={onGetStarted}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Essai gratuit
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinalStickyCTA;