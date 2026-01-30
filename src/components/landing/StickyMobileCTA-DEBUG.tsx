// DEBUG VERSION - Force visible sticky CTA to test deployment
import { Button } from "@/components/ui/button";

interface StickyMobileCTAProps {
  onGetStarted: () => void;
}

export function StickyMobileCTA({ onGetStarted }: StickyMobileCTAProps) {
  // FORCE VISIBLE - Debug mode
  return (
    <>
      {/* Debug indicator */}
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center text-xs z-[99999] p-1 lg:hidden">
        🧪 STICKY CTA DEBUG MODE - Should be visible
      </div>
      
      {/* Actual sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] lg:hidden" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999,
        backgroundColor: 'white',
        borderTop: '2px solid #e5e7eb',
        padding: '16px',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold', marginBottom: '4px' }}>
              🔥 127+ infirmiers actifs
            </div>
            <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
              Commencer votre essai gratuit
            </div>
          </div>
          
          <Button
            onClick={onGetStarted}
            style={{ 
              background: 'linear-gradient(to right, #10b981, #059669)',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            Essai gratuit
          </Button>
        </div>
      </div>
    </>
  );
}