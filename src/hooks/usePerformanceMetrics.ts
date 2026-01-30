import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries[entries.length - 1].startTime;
          setMetrics(prev => ({ ...prev, fcp }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1].startTime;
          setMetrics(prev => ({ ...prev, lcp }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const fid = entries[0].processingStart - entries[0].startTime;
            setMetrics(prev => ({ ...prev, fid }));
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
      }

      // Time to First Byte
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          setMetrics(prev => ({ ...prev, ttfb }));
        }
      } catch (e) {
      }
    }
  }, []);

  return metrics;
}

export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  // Send to analytics in production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: Send to your analytics service
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', {
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
      });
    }
  }
}