import { useEffect } from "react";

/**
 * Crisp Chat Widget
 * Remplacer CRISP_WEBSITE_ID par l'ID obtenu sur https://app.crisp.chat
 * Settings > Website > Website ID
 */
const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;

export function CrispChat() {
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    // Eviter le double chargement
    if ((window as any).$crisp) return;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup si besoin
      try {
        document.head.removeChild(script);
      } catch {}
    };
  }, []);

  return null;
}
