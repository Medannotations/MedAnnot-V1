import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;

const STYLE_ID = "crisp-custom-style";

/**
 * Crisp Chat Widget - Configuration discrete
 * - Bubble petite et semi-transparente, pleinement visible au hover
 * - Positionnee a gauche pour ne pas gener les CTAs
 * - Sur mobile dans le dashboard: remontee au-dessus de la bottom nav (h-16)
 * - Sur landing page: encore plus discrete pour ne pas gener la conversion
 */
export function CrispChat() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/app");
  const isLanding = location.pathname === "/";
  const initialized = useRef(false);

  // Init Crisp une seule fois
  useEffect(() => {
    if (!CRISP_WEBSITE_ID || initialized.current) return;
    if ((window as any).$crisp) return;

    initialized.current = true;

    // Queue de commandes Crisp (executees au chargement du script)
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    const $crisp = (window as any).$crisp;

    // Config via SDK (queue avant le chargement du script)
    $crisp.push(["config", "position:reverse", [true]]);    // A gauche
    $crisp.push(["config", "color:theme", ["teal"]]);        // Couleur teal
    $crisp.push(["config", "hide:on:away", [true]]);         // Pas de message auto

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Style dynamique selon la page (dashboard vs landing vs autre)
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    // Dashboard mobile: remonter au-dessus de la MobileBottomNav (h-16 = 64px + 20px marge)
    const mobileBottom = isDashboard ? "84px" : "20px";
    // Landing: tres discrete (35%), Dashboard: un peu plus visible (55%)
    const idleOpacity = isLanding ? "0.35" : "0.55";

    style.textContent = `
      /* ===== Crisp - Style discret MedAnnot ===== */

      /* Container principal du widget */
      .crisp-client .crisp-1sClKy,
      .crisp-client .cc-1brb6,
      .crisp-client .cc-tlyz {
        z-index: 40 !important;
      }

      /* ---- Bubble launcher: plus petite + semi-transparente ---- */
      .crisp-client a[data-maximized="false"],
      .crisp-client .cc-1brb6 .cc-unoo,
      .crisp-client .cc-tlyz .cc-kxkl {
        width: 44px !important;
        height: 44px !important;
        opacity: ${idleOpacity} !important;
        transition: opacity 0.3s ease, transform 0.2s ease !important;
      }
      .crisp-client a[data-maximized="false"]:hover,
      .crisp-client .cc-1brb6 .cc-unoo:hover,
      .crisp-client .cc-tlyz .cc-kxkl:hover {
        opacity: 1 !important;
        transform: scale(1.08) !important;
      }

      /* Quand le chat est ouvert, la bubble doit etre 100% visible */
      .crisp-client a[data-maximized="true"],
      .crisp-client [data-visible="true"] a {
        opacity: 1 !important;
      }

      /* ---- Icone dans la bubble ---- */
      .crisp-client a[data-maximized] span[class],
      .crisp-client .cc-1brb6 .cc-unoo .cc-1m2mf,
      .crisp-client .cc-tlyz .cc-kxkl .cc-nsge {
        width: 22px !important;
        height: 22px !important;
      }

      /* ---- Mobile: repositionner au-dessus de la bottom nav ---- */
      @media (max-width: 1023px) {
        .crisp-client .crisp-1sClKy,
        .crisp-client .cc-1brb6,
        .crisp-client .cc-tlyz,
        .crisp-client > div:first-child {
          bottom: ${mobileBottom} !important;
        }

        /* Chatbox ouverte: respecter l'offset aussi */
        .crisp-client .cc-1brb6 .cc-1yry3,
        .crisp-client .cc-tlyz .cc-7doi,
        .crisp-client [data-visible="true"] {
          bottom: ${mobileBottom} !important;
          max-height: calc(100dvh - ${parseInt(mobileBottom) + 20}px) !important;
        }
      }
    `;
  }, [isDashboard, isLanding]);

  return null;
}
