"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Sans clé publique (dev / Turnstile désactivé), aucune vérification n'est demandée. */
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

export type TurnstileStatus = "pending" | "verified" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (code: string) => void;
          "expired-callback"?: () => void;
          "timeout-callback"?: () => void;
          appearance?: "always" | "execute" | "interaction-only";
          "refresh-expired"?: "auto" | "manual" | "never";
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          language?: string;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileWidgetProps {
  /** Reçoit le jeton valide, ou null quand il expire / échoue. */
  onToken: (token: string | null, status: TurnstileStatus) => void;
}

/**
 * Vérification anti-bot affichée dans la page.
 * Le challenge démarre dès le montage : invisible dans la plupart des cas,
 * une case à cocher n'apparaît que si Cloudflare l'exige.
 */
export default function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY) return;

    const render = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        appearance: "interaction-only",
        // Le jeton expire après 5 min : Cloudflare en génère un nouveau automatiquement
        "refresh-expired": "auto",
        theme: "dark",
        size: "flexible",
        language: "fr",
        callback: (token) => onTokenRef.current(token, "verified"),
        "expired-callback": () => onTokenRef.current(null, "pending"),
        "timeout-callback": () => onTokenRef.current(null, "error"),
        "error-callback": (code) => {
          console.error("Turnstile erreur :", code);
          onTokenRef.current(null, "error");
        },
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;

  // Ne jamais masquer ce conteneur (display:none) : la case ne pourrait plus s'afficher.
  return <div ref={containerRef} className="w-full max-w-100 mx-auto" />;
}

