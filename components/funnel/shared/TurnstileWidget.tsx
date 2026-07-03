"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";

export interface TurnstileHandle {
  /**
   * Génère un token Turnstile frais à la demande (reset + execute).
   * Résout avec le token, ou null si Turnstile est indisponible / a échoué.
   */
  getToken: () => Promise<string | null>;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TOKEN_TIMEOUT_MS = 20000;

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "timeout-callback"?: () => void;
          execution?: "render" | "execute";
          appearance?: "always" | "execute" | "interaction-only";
          theme?: string;
        }
      ) => string;
      execute: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TurnstileWidget = forwardRef<TurnstileHandle>(function TurnstileWidget(
  _props,
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const resolverRef = useRef<((token: string | null) => void) | null>(null);

  const settle = useCallback((token: string | null) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.(token);
  }, []);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || !SITE_KEY) return;
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      // Le challenge ne se lance qu'à l'appel de execute() → token toujours frais.
      execution: "execute",
      // Invisible sauf si une interaction est réellement requise (trafic suspect).
      appearance: "interaction-only",
      theme: "dark",
      callback: (token) => settle(token),
      "error-callback": () => settle(null),
      "timeout-callback": () => settle(null),
    });
  }, [settle]);

  useEffect(() => {
    if (!SITE_KEY) return;

    const existing = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"]'
    );

    if (existing && window.turnstile) {
      renderWidget();
    } else if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  useImperativeHandle(
    ref,
    () => ({
      getToken: () =>
        new Promise<string | null>((resolve) => {
          // Pas de clé configurée : on laisse le serveur décider (dev / Turnstile désactivé).
          if (!SITE_KEY) {
            resolve(null);
            return;
          }
          if (!window.turnstile || !widgetIdRef.current) {
            resolve(null);
            return;
          }

          // Un seul appel en vol à la fois : on annule le précédent.
          settle(null);
          resolverRef.current = resolve;

          try {
            window.turnstile.reset(widgetIdRef.current);
            window.turnstile.execute(widgetIdRef.current);
          } catch {
            settle(null);
            return;
          }

          // Filet de sécurité : si aucun callback ne se déclenche, on résout à null.
          setTimeout(() => {
            if (resolverRef.current === resolve) settle(null);
          }, TOKEN_TIMEOUT_MS);
        }),
    }),
    [settle]
  );

  if (!SITE_KEY) return null;

  return <div ref={containerRef} className="hidden" />;
});

export default TurnstileWidget;
