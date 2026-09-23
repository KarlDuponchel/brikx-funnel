"use client";

import { useRef, useState } from "react";

const VIDEO_SRC = "/video/brikx-presentation.mp4";
const POSTER_SRC = "/video/brikx-presentation-poster.jpg";

export default function PresentationVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // La vidéo n'est téléchargée qu'au clic (preload="none")
  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className={`bg-grey aspect-video relative overflow-hidden mb-9 border border-border transition-[border-color] duration-200 ${started ? "" : "hover:border-white/30"}`}>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        preload="none"
        playsInline
        controls={started}
        className="absolute inset-0 w-full h-full object-cover bg-black"
      />

      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Lire la vidéo de présentation"
          className="group absolute inset-0 flex flex-col items-center justify-center bg-transparent cursor-pointer border-0 p-0"
        >
          {/* Voile sombre pour garder le bouton et le libellé lisibles sur l'image */}
          <div className="absolute inset-0 bg-black/40 transition-colors duration-200 group-hover:bg-black/25" />
          {/* Anneaux et bouton dans le même conteneur : le pulse reste centré sur le play */}
          <div className="relative w-16 h-16">
            <div className="play-ring inset-0" />
            <div className="play-ring inset-0" />
            <div className="play-ring inset-0" />
            <div className="w-16 h-16 border-2 border-white/70 rounded-full flex items-center justify-center relative z-1 transition-all duration-200 group-hover:border-white">
              <div
                className="ml-1"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "11px solid transparent",
                  borderBottom: "11px solid transparent",
                  borderLeft: "18px solid rgba(255,255,255,0.9)",
                }}
              />
            </div>
          </div>
          <p className="font-(family-name:--font-barlow-condensed) text-xs font-semibold tracking-[1.5px] uppercase text-white/80 mt-4 text-center relative z-1">
            Vidéo de présentation · C1 · 1 min 30
          </p>
        </button>
      )}
    </div>
  );
}
