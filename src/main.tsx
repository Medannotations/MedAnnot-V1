import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/serviceWorker";
import { PerformanceMonitor } from "./components/PerformanceMonitor";

// Register service worker for caching and offline functionality
registerServiceWorker();

// Create root and render app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <>
      <App />
      <PerformanceMonitor />
    </>
  );
}

// Report web vitals
if (typeof window !== 'undefined') {
  // Import web vitals library dynamically
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }).catch(() => {
    // Web vitals not available, use custom implementation
    console.log('Web vitals library not available');
  });
}
