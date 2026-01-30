export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
        })
        .catch((registrationError) => {
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

// Performance monitoring for service worker
export function measureSWPerformance() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Measure cache hit rate
      if (registration.active) {
        registration.active.postMessage({
          type: 'MEASURE_PERFORMANCE'
        });
      }
    });
  }
}