import { useEffect } from 'react';
import { usePerformanceMetrics, logPerformanceMetrics } from '@/hooks/usePerformanceMetrics';

export function PerformanceMonitor() {
  const metrics = usePerformanceMetrics();

  useEffect(() => {
    if (Object.keys(metrics).length > 0) {
      logPerformanceMetrics(metrics);
    }
  }, [metrics]);

  // Display performance badge in development
  if (process.env.NODE_ENV === 'development' && metrics.lcp) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono z-50">
        <div>LCP: {Math.round(metrics.lcp)}ms</div>
        <div>FCP: {Math.round(metrics.fcp || 0)}ms</div>
        <div>CLS: {(metrics.cls || 0).toFixed(3)}</div>
      </div>
    );
  }

  return null;
}

export function reportWebVitals(metric: any) {
  // Handle different metric types
  switch (metric.name) {
    case 'FCP':
      // First Contentful Paint
      break;
    case 'LCP':
      // Largest Contentful Paint
      break;
    case 'CLS':
      // Cumulative Layout Shift
      break;
    case 'FID':
      // First Input Delay
      break;
    case 'TTFB':
      // Time to First Byte
      break;
    default:
      break;
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value * 100) / 100,
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      });
    }
  }
}