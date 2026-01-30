import { useEffect, useState, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface OptimizedPerformanceMetrics extends PerformanceMetrics {
  memoryUsage?: number;
  networkLatency?: number;
  cacheHitRate?: number;
}

// Medical-grade performance monitoring with automatic optimization
export function useOptimizedPerformance() {
  const [metrics, setMetrics] = useState<OptimizedPerformanceMetrics>({});
  const optimizationCache = useRef(new Map<string, any>());
  const performanceStartTime = useRef<number>(Date.now());

  // MEDICAL-GRADE: Critical performance thresholds for healthcare applications
  const CRITICAL_THRESHOLDS = {
    LCP: 2000,      // 2 seconds max for healthcare professionals
    FCP: 1500,      // 1.5 seconds for first content
    FID: 100,       // 100ms for input responsiveness
    CLS: 0.1,       // Minimal layout shift
    TTFB: 800,      // 800ms time to first byte
  };

  const isPerformanceCritical = useCallback((metric: keyof typeof CRITICAL_THRESHOLDS, value?: number) => {
    if (!value) return false;
    return value > CRITICAL_THRESHOLDS[metric];
  }, []);

  // MEDICAL-GRADE: Automatic performance optimization
  const optimizePerformance = useCallback(() => {
    // Preload critical resources
    const criticalResources = [
      '/api/user/profile',
      '/api/annotations/recent',
      '/api/patients/active'
    ];

    criticalResources.forEach(resource => {
      if (!optimizationCache.current.has(resource)) {
        fetch(resource, { method: 'HEAD', cache: 'force-cache' })
          .then(() => optimizationCache.current.set(resource, true))
          .catch(() => {}); // Silent fail for prefetch
      }
    });

    // Optimize memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
        // Trigger garbage collection hint
        optimizationCache.current.clear();
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    let optimizationTriggered = false;

    // MEDICAL-GRADE: Enhanced performance monitoring with automatic optimization
    const monitorPerformance = () => {
      // Largest Contentful Paint - Critical for healthcare UX
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1].startTime;
          setMetrics(prev => ({ ...prev, lcp }));

          // Auto-optimize if LCP is critical
          if (!optimizationTriggered && isPerformanceCritical('LCP', lcp)) {
            optimizationTriggered = true;
            optimizePerformance();
            
            // Log critical performance issue
            console.warn('🚨 MEDICAL-GRADE PERFORMANCE ALERT: LCP exceeded threshold', {
              lcp: `${Math.round(lcp)}ms`,
              threshold: `${CRITICAL_THRESHOLDS.LCP}ms`,
              action: 'Auto-optimization triggered'
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP monitoring not available');
      }

      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries[entries.length - 1].startTime;
          setMetrics(prev => ({ ...prev, fcp }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP monitoring not available');
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
        console.warn('CLS monitoring not available');
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
        console.warn('FID monitoring not available');
      }

      // Enhanced Time to First Byte with network latency
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          const networkLatency = navigationEntry.responseEnd - navigationEntry.requestStart;
          
          setMetrics(prev => ({ 
            ...prev, 
            ttfb,
            networkLatency 
          }));
        }
      } catch (e) {
        console.warn('Enhanced TTFB monitoring not available');
      }

      // Memory usage monitoring (if available)
      if ('memory' in performance) {
        try {
          const memoryInfo = (performance as any).memory;
          const memoryUsage = memoryInfo.usedJSHeapSize / (1024 * 1024); // MB
          setMetrics(prev => ({ ...prev, memoryUsage }));
        } catch (e) {
          console.warn('Memory monitoring not available');
        }
      }

      // Cache hit rate estimation
      try {
        const resources = performance.getEntriesByType('resource');
        const cachedResources = resources.filter((resource: any) => 
          resource.transferSize === 0 || resource.duration < 10
        );
        const cacheHitRate = resources.length > 0 ? cachedResources.length / resources.length : 0;
        setMetrics(prev => ({ ...prev, cacheHitRate }));
      } catch (e) {
        console.warn('Cache monitoring not available');
      }
    };

    monitorPerformance();

    // Initial optimization on mount
    optimizePerformance();

  }, [isPerformanceCritical, optimizePerformance]);

  // MEDICAL-GRADE: Performance reporting with healthcare context
  const reportPerformance = useCallback(() => {
    const loadTime = Date.now() - performanceStartTime.current;
    const isMedicalGradePerformance = 
      (!metrics.lcp || metrics.lcp <= CRITICAL_THRESHOLDS.LCP) &&
      (!metrics.fcp || metrics.fcp <= CRITICAL_THRESHOLDS.FCP) &&
      (!metrics.fid || metrics.fid <= CRITICAL_THRESHOLDS.FID);

    if (process.env.NODE_ENV === 'development') {
      console.log('🏥 MEDICAL-GRADE PERFORMANCE REPORT:', {
        'LCP (2s max)': metrics.lcp ? `${Math.round(metrics.lcp)}ms ${isPerformanceCritical('LCP', metrics.lcp) ? '❌' : '✅'}` : 'N/A',
        'FCP (1.5s max)': metrics.fcp ? `${Math.round(metrics.fcp)}ms ${isPerformanceCritical('FCP', metrics.fcp) ? '❌' : '✅'}` : 'N/A',
        'FID (100ms max)': metrics.fid ? `${Math.round(metrics.fid)}ms ${isPerformanceCritical('FID', metrics.fid) ? '❌' : '✅'}` : 'N/A',
        'CLS (0.1 max)': metrics.cls ? `${metrics.cls.toFixed(3)} ${isPerformanceCritical('CLS', metrics.cls) ? '❌' : '✅'}` : 'N/A',
        'TTFB (800ms max)': metrics.ttfb ? `${Math.round(metrics.ttfb)}ms ${isPerformanceCritical('TTFB', metrics.ttfb) ? '❌' : '✅'}` : 'N/A',
        'Memory Usage': metrics.memoryUsage ? `${metrics.memoryUsage.toFixed(1)}MB` : 'N/A',
        'Cache Hit Rate': metrics.cacheHitRate ? `${(metrics.cacheHitRate * 100).toFixed(1)}%` : 'N/A',
        'Total Load Time': `${loadTime}ms`,
        'Medical Grade': isMedicalGradePerformance ? '✅ APPROVED' : '⚠️ NEEDS OPTIMIZATION',
      });
    }

    return {
      metrics,
      isMedicalGrade: isMedicalGradePerformance,
      loadTime,
      thresholds: CRITICAL_THRESHOLDS
    };
  }, [metrics, isPerformanceCritical]);

  return {
    metrics,
    isMedicalGradePerformance: 
      (!metrics.lcp || metrics.lcp <= CRITICAL_THRESHOLDS.LCP) &&
      (!metrics.fcp || metrics.fcp <= CRITICAL_THRESHOLDS.FCP) &&
      (!metrics.fid || metrics.fid <= CRITICAL_THRESHOLDS.FID),
    reportPerformance,
    optimizePerformance
  };
}

// Medical-grade performance logging for healthcare compliance
export function logMedicalGradePerformance(metrics: OptimizedPerformanceMetrics) {
  const timestamp = new Date().toISOString();
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const performanceReport = {
    timestamp,
    sessionId,
    environment: process.env.NODE_ENV,
    metrics: {
      lcp: metrics.lcp ? Math.round(metrics.lcp) : null,
      fcp: metrics.fcp ? Math.round(metrics.fcp) : null,
      fid: metrics.fid ? Math.round(metrics.fid) : null,
      cls: metrics.cls ? parseFloat(metrics.cls.toFixed(3)) : null,
      ttfb: metrics.ttfb ? Math.round(metrics.ttfb) : null,
      memoryUsage: metrics.memoryUsage ? parseFloat(metrics.memoryUsage.toFixed(1)) : null,
      cacheHitRate: metrics.cacheHitRate ? parseFloat((metrics.cacheHitRate * 100).toFixed(1)) : null,
    },
    medicalGrade: 
      (metrics.lcp || 0) <= 2000 && 
      (metrics.fcp || 0) <= 1500 && 
      (metrics.fid || 0) <= 100
  };

  // Send to medical compliance logging (anonymized)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Anonymous performance reporting for healthcare compliance
    fetch('/api/performance/medical-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(performanceReport),
      keepalive: true // Ensures report is sent even if page unloads
    }).catch(() => {}); // Silent fail for compliance logging
  }

  return performanceReport;
}