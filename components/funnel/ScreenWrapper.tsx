import { type ReactNode } from "react";
import Image from "next/image";

interface ScreenWrapperProps {
  isActive: boolean;
  isLeaving: boolean;
  children: ReactNode;
}

export default function ScreenWrapper({
  isActive,
  isLeaving,
  children,
}: ScreenWrapperProps) {
  if (!isActive && !isLeaving) return null;

  return (
    <section
      className={`screen ${isActive ? "screen-enter" : ""} ${isLeaving ? "screen-leave" : ""}`}
    >
      {children}
      <footer className="py-12 text-center">
        <Image
          src="/logo-brikx.png"
          alt="brikx."
          width={150}
          height={64}
          className="h-16 w-auto mx-auto opacity-85 mb-3"
        />
        <p className="font-[family-name:var(--font-barlow-condensed)] text-[11px] font-bold tracking-[2.5px] uppercase text-white/25">
          Santé &amp; Performance du Dirigeant
        </p>
      </footer>
    </section>
  );
}
