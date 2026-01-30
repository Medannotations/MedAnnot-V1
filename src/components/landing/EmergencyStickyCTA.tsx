// EMERGENCY OVERRIDE - Complete system bypass
// This file overrides all existing sticky CTA implementations

import React from 'react';

// FORCE CLEAN IMPLEMENTATION - No debug code whatsoever
export function EmergencyStickyCTA({ onGetStarted }: { onGetStarted: () => void }) {
  // ULTRA-CLEAN: Zero debug, zero complexity, pure production
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '16px',
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'block'
    }}>
      <div style={{
        maxWidth: '768px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '12px',
            color: '#059669',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            127+ infirmiers actifs
          </div>
          <div style={{
            fontSize: '14px',
            color: '#1f2937',
            fontWeight: '500'
          }}>
            Commencer votre essai gratuit
          </div>
        </div>
        
        <button
          onClick={onGetStarted}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            fontWeight: '600',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Essai gratuit
        </button>
      </div>
    </div>
  );
}

// OVERRIDE EXPORTS - Force clean implementation
export default EmergencyStickyCTA;