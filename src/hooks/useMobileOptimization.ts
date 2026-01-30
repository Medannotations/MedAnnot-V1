/**
 * Mobile-First Responsive Utilities
 * Swiss Nurse Optimized - Zero Friction Design
 */

import { useEffect, useState } from 'react';

// Breakpoint system optimized for Swiss healthcare workers
export const BREAKPOINTS = {
  mobile: '320px',   // Minimum mobile (iPhone SE)
  tablet: '768px',   // iPad/tablet
  desktop: '1024px', // Desktop minimum
  wide: '1440px',    // Wide screens
} as const;

// Hook for responsive design
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

// Mobile-first responsive utilities
export function useResponsive() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.tablet})`);
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet}) and (max-width: ${BREAKPOINTS.desktop})`);
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop})`);
  const isWide = useMediaQuery(`(min-width: ${BREAKPOINTS.wide})`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isTouch: isMobile || isTablet,
  };
}

// Swiss nurse optimized touch targets (minimum 44px)
export const TOUCH_TARGETS = {
  mobile: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '12px',
  },
  tablet: {
    minHeight: '48px',
    minWidth: '48px',
    padding: '14px',
  },
  desktop: {
    minHeight: '36px',
    minWidth: '36px',
    padding: '8px',
  },
} as const;

// Mobile-first form optimization
export const MOBILE_FORM_STYLES = {
  input: {
    fontSize: '16px', // Prevents zoom on iOS
    minHeight: TOUCH_TARGETS.mobile.minHeight,
    padding: '12px 16px',
  },
  button: {
    minHeight: TOUCH_TARGETS.mobile.minHeight,
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
  },
  spacing: {
    section: '24px',
    element: '16px',
    inline: '8px',
  },
} as const;

// Critical mobile performance optimizations
export const MOBILE_PERFORMANCE = {
  // Lazy load threshold (pixels before entering viewport)
  lazyLoadOffset: '50px',
  
  // Image optimization for mobile
  imageSizes: {
    thumbnail: '150w',
    small: '300w',
    medium: '600w',
    large: '1200w',
  },
  
  // Debounce timing for mobile interactions
  debounce: {
    search: 300,
    scroll: 100,
    resize: 250,
  },
};

// Swiss healthcare specific mobile patterns
export const SWISS_MOBILE_PATTERNS = {
  // One-hand usage optimization (thumb-friendly zones)
  thumbZones: {
    primary: 'bottom-right', // CTA placement for right-handed users
    secondary: 'bottom-left',
    avoid: 'top-left', // Hard to reach with thumb
  },
  
  // Quick action buttons (emergency-ready)
  quickActions: {
    size: '56px', // Larger for emergency situations
    spacing: '16px',
    position: 'bottom-center',
  },
  
  // Voice recording optimization
  voiceRecording: {
    buttonSize: '80px', // Large enough for quick access
    tapTarget: '120px', // Invisible larger tap area
    hapticFeedback: true,
  },
};

// Mobile navigation optimization
export const MOBILE_NAVIGATION = {
  // Sticky navigation height
  navHeight: '64px',
  
  // Bottom navigation for thumb access
  bottomNav: {
    height: '80px',
    itemMinWidth: '64px',
    iconSize: '24px',
  },
  
  // Back button placement (Swiss user pattern)
  backButton: {
    position: 'top-left',
    size: TOUCH_TARGETS.mobile.minHeight,
    margin: '16px',
  },
};

// Form validation for mobile (prevent frustrating errors)
export const MOBILE_VALIDATION = {
  // Real-time validation delay
  delay: 500,
  
  // Error message positioning
  errorPosition: 'bottom',
  
  // Success feedback timing
  successDelay: 1000,
  
  // Prevent double-submission
  submitDelay: 2000,
};

// Export all as default
export default {
  BREAKPOINTS,
  useMediaQuery,
  useResponsive,
  TOUCH_TARGETS,
  MOBILE_FORM_STYLES,
  MOBILE_PERFORMANCE,
  SWISS_MOBILE_PATTERNS,
  MOBILE_NAVIGATION,
  MOBILE_VALIDATION,
};