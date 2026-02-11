import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;

const STYLE_ID = "crisp-custom-style";

/**
 * Crisp Chat Widget - Configuration discrete MedAnnot
 * - Desktop: a droite (position par defaut)
 * - Mobile landing: a gauche, au-dessus du sticky CTA (~80px)
 * - Mobile dashboard: a gauche, au-dessus de la bottom nav (h-16)
 * - Couleur personnalisee #25B2BD
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

    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    const $crisp = (window as any).$crisp;

    // Desktop: position par defaut (droite)
    // Pas de position:reverse → reste a droite
    $crisp.push(["config", "hide:on:away", [true]]);

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Style dynamique selon la page
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    // Mobile: landing a le sticky CTA (~80px + marge), dashboard a la bottom nav (64px + marge)
    const mobileBottom = isLanding ? "96px" : isDashboard ? "84px" : "20px";
    const idleOpacity = isLanding ? "0.4" : "0.6";

    style.textContent = `
      /* ===== Crisp - Style MedAnnot #25B2BD ===== */

      /* Couleur personnalisee sur la bubble et la chatbox */
      .crisp-client .cc-1brb6 .cc-unoo,
      .crisp-client .cc-tlyz .cc-kxkl,
      .crisp-client a[data-maximized="false"] {
        background-color: #25B2BD !important;
      }
      .crisp-client .cc-1brb6 .cc-1yry3 .cc-ge7p,
      .crisp-client .cc-tlyz .cc-7doi .cc-1sat,
      .crisp-client [data-full-view="true"] .cc-1sat,
      .crisp-client [data-pane="compose"] .cc-2wq2,
      .crisp-client .cc-1brb6 .cc-1yry3 .cc-1m1c,
      .crisp-client .cc-tlyz .cc-7doi .cc-1m1c {
        background-color: #25B2BD !important;
      }

      /* Container principal du widget */
      .crisp-client .crisp-1sClKy,
      .crisp-client .cc-1brb6,
      .crisp-client .cc-tlyz {
        z-index: 40 !important;
      }

      /* ---- Bubble: taille reduite + semi-transparente ---- */
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

      /* Chat ouvert: 100% visible */
      .crisp-client a[data-maximized="true"],
      .crisp-client [data-visible="true"] a {
        opacity: 1 !important;
      }

      /* Icone dans la bubble */
      .crisp-client a[data-maximized] span[class],
      .crisp-client .cc-1brb6 .cc-unoo .cc-1m2mf,
      .crisp-client .cc-tlyz .cc-kxkl .cc-nsge {
        width: 22px !important;
        height: 22px !important;
      }

      /* ---- Mobile: a gauche + au-dessus du sticky CTA / bottom nav ---- */
      @media (max-width: 1023px) {
        /* Passer a gauche sur mobile */
        .crisp-client .crisp-1sClKy,
        .crisp-client .cc-1brb6,
        .crisp-client .cc-tlyz,
        .crisp-client > div:first-child {
          bottom: ${mobileBottom} !important;
          left: 12px !important;
          right: auto !important;
        }

        /* Chatbox ouverte: respecter l'offset */
        .crisp-client .cc-1brb6 .cc-1yry3,
        .crisp-client .cc-tlyz .cc-7doi,
        .crisp-client [data-visible="true"] {
          bottom: ${mobileBottom} !important;
          left: 0 !important;
          right: 0 !important;
          max-height: calc(100dvh - ${parseInt(mobileBottom) + 20}px) !important;
        }
      }
    `;
  }, [isDashboard, isLanding]);

  return null;
}
