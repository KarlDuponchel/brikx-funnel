"use client";

import { useEffect, useRef, useState } from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export default function TestimonialCard({ quote, name, role, initials }: TestimonialCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  // Détecte si le texte dépasse les 6 lignes (recalculé au resize et au chargement des polices)
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;

    let active = true;
    const measure = () => {
      if (active) setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.fonts?.ready.then(measure);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [expanded]);

  return (
    <div className="border border-border p-6 bg-grey relative">
      <div className="text-[11px] tracking-[2px] text-primary">★★★★★</div>
      <p
        ref={textRef}
        className={`text-sm leading-[1.65] text-white/75 italic font-light whitespace-pre-line ${
          expanded ? "" : "line-clamp-6"
        } ${clamped ? "mb-2" : "mb-4.5"}`}
      >
        &ldquo;{quote}&rdquo;
      </p>
      {clamped && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mb-4.5 bg-transparent p-0 border-0 cursor-pointer font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[2px] uppercase text-primary transition-opacity duration-200 hover:opacity-70"
        >
          {expanded ? "Réduire" : "Lire la suite"}
        </button>
      )}
      <div className="flex items-center gap-3.5">
        <div className="w-10.5 h-10.5 bg-grey-mid rounded-full shrink-0 flex items-center justify-center font-(family-name:--font-anton) text-base">
          {initials}
        </div>
        <div>
          <div className="font-(family-name:--font-barlow-condensed) text-xs font-bold tracking-[1.5px] uppercase">
            {name}
          </div>
          <div className="text-[11px] text-grey-light mt-0.5">{role}</div>
        </div>
      </div>
    </div>
  );
}
