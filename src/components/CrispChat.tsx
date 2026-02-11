import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const CRISP_WEBSITE_ID = import.meta.env.VITE_CRISP_WEBSITE_ID;

const STYLE_ID = "crisp-custom-style";
const BRAND_COLOR = "#25B2BD";

/**
 * Crisp Chat Widget - Configuration MedAnnot
 * - Desktop: a droite
 * - Mobile: a gauche, au-dessus du sticky CTA / bottom nav
 * - Couleur #25B2BD
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

    // Position native gauche (on deplace a droite sur desktop via CSS)
    $crisp.push(["config", "position:reverse", [true]]);
    $crisp.push(["config", "hide:on:away", [true]]);

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    // Forcer la couleur #25B2BD via JS apres chargement de Crisp
    script.onload = () => {
      const applyColor = () => {
        const els = document.querySelectorAll(
          '.crisp-client a[data-maximized], .crisp-client [data-maximized] ~ div'
        );
        els.forEach((el) => {
          (el as HTMLElement).style.setProperty("background-color", BRAND_COLOR, "important");
        });
      };
      // Observer pour detecter quand Crisp injecte ses elements
      const observer = new MutationObserver(() => {
        applyColor();
      });
      const crispRoot = document.querySelector('.crisp-client');
      if (crispRoot) {
        observer.observe(crispRoot, { childList: true, subtree: true, attributes: true });
      }
      // Fallback: appliquer apres un delai
      setTimeout(applyColor, 2000);
      setTimeout(applyColor, 5000);
    };
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

    // Mobile: landing = sticky CTA (~80px + marge), dashboard = bottom nav (64px + marge)
    const mobileBottom = isLanding ? "96px" : isDashboard ? "84px" : "20px";
    const idleOpacity = isLanding ? "0.4" : "0.6";

    style.textContent = `
      /* ===== Crisp - MedAnnot ${BRAND_COLOR} ===== */

      /* --- Couleur forcee partout --- */
      .crisp-client a[data-maximized="false"],
      .crisp-client a[data-maximized="true"],
      .crisp-client .cc-1brb6 .cc-unoo,
      .crisp-client .cc-tlyz .cc-kxkl {
        background-color: ${BRAND_COLOR} !important;
        background: ${BRAND_COLOR} !important;
      }
      /* Header chatbox */
      .crisp-client .cc-1brb6 .cc-1yry3 .cc-ge7p,
      .crisp-client .cc-1brb6 .cc-1yry3 .cc-1m1c,
      .crisp-client .cc-tlyz .cc-7doi .cc-1sat,
      .crisp-client .cc-tlyz .cc-7doi .cc-1m1c,
      .crisp-client [data-full-view="true"] .cc-1sat,
      .crisp-client [data-pane="compose"] .cc-2wq2 {
        background-color: ${BRAND_COLOR} !important;
        background: ${BRAND_COLOR} !important;
      }
      /* Bouton envoyer et liens dans le chat */
      .crisp-client .cc-1brb6 button[data-action="send"],
      .crisp-client .cc-tlyz button[data-action="send"],
      .crisp-client a[data-action] {
        color: ${BRAND_COLOR} !important;
      }

      /* Z-index */
      .crisp-client .crisp-1sClKy,
      .crisp-client .cc-1brb6,
      .crisp-client .cc-tlyz {
        z-index: 40 !important;
      }

      /* --- Bubble: taille reduite + semi-transparente --- */
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

      /* --- Desktop (>= 1024px): deplacer a DROITE --- */
      @media (min-width: 1024px) {
        .crisp-client .crisp-1sClKy,
        .crisp-client .cc-1brb6,
        .crisp-client .cc-tlyz,
        .crisp-client > div:first-child {
          left: auto !important;
          right: 0 !important;
        }
        /* Bubble elle-meme */
        .crisp-client a[data-maximized] {
          left: auto !important;
          right: 20px !important;
        }
        /* Chatbox ouverte sur desktop */
        .crisp-client .cc-1brb6 .cc-1yry3,
        .crisp-client .cc-tlyz .cc-7doi {
          left: auto !important;
          right: 20px !important;
        }
      }

      /* --- Mobile (< 1024px): GAUCHE natif + remonter au-dessus du CTA --- */
      @media (max-width: 1023px) {
        .crisp-client .crisp-1sClKy,
        .crisp-client .cc-1brb6,
        .crisp-client .cc-tlyz,
        .crisp-client > div:first-child {
          bottom: ${mobileBottom} !important;
        }
        .crisp-client a[data-maximized] {
          bottom: ${mobileBottom} !important;
        }
        /* Chatbox ouverte */
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
