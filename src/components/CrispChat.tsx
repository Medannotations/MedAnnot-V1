import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;
const BRAND_COLOR = "#25B2BD";

/**
 * Crisp Chat Widget - MedAnnot
 * - Desktop: droite
 * - Mobile: gauche, au-dessus du sticky CTA / bottom nav
 * - Couleur #25B2BD forcee via JS (inline styles)
 */
export function CrispChat() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/app");
  const isLanding = location.pathname === "/";
  const initialized = useRef(false);
  const configRef = useRef({ isDashboard, isLanding });

  // Garder les refs a jour
  configRef.current = { isDashboard, isLanding };

  // Fonction qui force nos styles directement sur les elements DOM de Crisp
  const applyStyles = useCallback(() => {
    const isMobile = window.innerWidth < 1024;
    const { isDashboard: dash, isLanding: landing } = configRef.current;
    const mobileBottom = landing ? 96 : dash ? 84 : 20;

    // -- Bubble (le bouton rond) --
    const bubble = document.querySelector('.crisp-client a[data-maximized]') as HTMLElement;
    if (bubble) {
      // Couleur
      bubble.style.setProperty("background-color", BRAND_COLOR, "important");
      // Taille
      bubble.style.setProperty("width", "44px", "important");
      bubble.style.setProperty("height", "44px", "important");

      if (isMobile) {
        // Mobile: a gauche + au-dessus du sticky CTA
        bubble.style.setProperty("left", "12px", "important");
        bubble.style.removeProperty("right");
        bubble.style.setProperty("right", "auto", "important");
        bubble.style.setProperty("bottom", `${mobileBottom}px`, "important");
      } else {
        // Desktop: a droite
        bubble.style.removeProperty("left");
        bubble.style.setProperty("left", "auto", "important");
        bubble.style.setProperty("right", "20px", "important");
      }
    }

    // -- Containers Crisp --
    const containers = document.querySelectorAll(
      '.crisp-client .cc-1brb6, .crisp-client .cc-tlyz, .crisp-client .crisp-1sClKy'
    );
    containers.forEach((el) => {
      const h = el as HTMLElement;
      h.style.setProperty("z-index", "40", "important");
      if (isMobile) {
        h.style.setProperty("bottom", `${mobileBottom}px`, "important");
      }
    });

    // -- Chatbox ouverte (header) --
    const headerSelectors = [
      '.crisp-client .cc-ge7p',
      '.crisp-client .cc-1m1c',
      '.crisp-client .cc-1sat',
    ];
    headerSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        (el as HTMLElement).style.setProperty("background-color", BRAND_COLOR, "important");
      });
    });

    // -- Chatbox panel position --
    const chatbox = document.querySelector(
      '.crisp-client .cc-1yry3, .crisp-client .cc-7doi'
    ) as HTMLElement;
    if (chatbox) {
      if (isMobile) {
        chatbox.style.setProperty("bottom", `${mobileBottom}px`, "important");
        chatbox.style.setProperty("max-height", `calc(100dvh - ${mobileBottom + 20}px)`, "important");
      } else {
        chatbox.style.removeProperty("bottom");
        chatbox.style.setProperty("left", "auto", "important");
        chatbox.style.setProperty("right", "20px", "important");
      }
    }
  }, []);

  // Init Crisp une seule fois
  useEffect(() => {
    if (!CRISP_WEBSITE_ID || initialized.current) return;
    if ((window as any).$crisp) return;

    initialized.current = true;

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    // Pas de position:reverse - on gere tout en JS
    (window as any).$crisp.push(["config", "hide:on:away", [true]]);

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Polling qui applique nos styles en continu
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    // Appliquer toutes les 500ms pendant les 10 premieres secondes, puis toutes les 3s
    let count = 0;
    const interval = setInterval(() => {
      applyStyles();
      count++;
      if (count > 20) {
        // Apres 10s (20 x 500ms), ralentir
        clearInterval(interval);
        // Continuer en mode lent
        slowInterval = setInterval(applyStyles, 3000);
      }
    }, 500);

    let slowInterval: ReturnType<typeof setInterval> | undefined;

    // Aussi appliquer sur resize (changement mobile <-> desktop)
    const onResize = () => applyStyles();
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      if (slowInterval) clearInterval(slowInterval);
      window.removeEventListener("resize", onResize);
    };
  }, [applyStyles]);

  // Re-appliquer quand la route change (mobileBottom change)
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;
    applyStyles();
    // Petit delai pour laisser React re-rendre
    const t = setTimeout(applyStyles, 300);
    return () => clearTimeout(t);
  }, [isDashboard, isLanding, applyStyles]);

  return null;
}
