import { FEATURES } from "@/lib/constants";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";

interface HeroScreenProps {
  goTo: (n: number) => void;
}

export default function HeroScreen({ goTo }: HeroScreenProps) {
  return (
    <div>
      {/* Banner */}
      <div className="relative overflow-hidden">
        <div className="relative bg-grey \ max-h-130 flex items-end overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 z-2 px-6 pb-7 text-center">
            <span className="inline-block font-[family-name:var(--font-barlow-condensed)] text-[11px] font-bold tracking-[3px] uppercase text-white border border-white/35 py-1.5 px-3.5 mb-3.5">
              Pour les dirigeants &amp; chefs d&apos;entreprise ambitieux
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-6 max-w-[680px] mx-auto text-center">
        <p className="font-[family-name:var(--font-barlow-condensed)] text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-4">
          brikxconsulting
        </p>

        <h1 className="font-[family-name:var(--font-anton)] text-[clamp(32px,8vw,64px)] leading-[1.0] tracking-[-0.5px] uppercase mb-5">
          {"3 minutes pour".split(" ").map((word, i) => (
            <span
              key={i}
              className="word-reveal inline-block mr-[0.3em]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {word}
            </span>
          ))}
          <br />
          {"découvrir le".split(" ").map((word, i) => (
            <span
              key={i}
              className="word-reveal inline-block mr-[0.3em]"
              style={{ animationDelay: `${(i + 3) * 0.08}s` }}
            >
              {word}
            </span>
          ))}
          <br />
          <span
            className="word-reveal text-stroke inline-block"
            style={{ animationDelay: "0.4s", fontStyle: "normal" }}
          >
            triple projet
          </span>
        </h1>

        <p className="text-[15px] leading-[1.65] text-white/65 max-w-[480px] mx-auto mb-8 font-light">
          Une méthode pour les dirigeants qui refusent de choisir entre la
          performance de leur entreprise, leur santé et leur vie.
        </p>

        <div className="flex items-center justify-center gap-2 mb-8 font-[family-name:var(--font-barlow-condensed)] text-[13px] font-semibold tracking-[1.5px] uppercase text-grey-light">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-[pulseGreen_1.5s_infinite]" />
          Places limitées — Mai 2026
        </div>

        <div className="flex justify-center gap-6 flex-wrap mb-9">
          {FEATURES.map((feat) => (
            <span
              key={feat}
              className="font-[family-name:var(--font-barlow-condensed)] text-xs font-semibold tracking-[1.5px] uppercase text-white/50 flex items-center gap-[7px] before:content-[''] before:w-[18px] before:h-px before:bg-white/30"
            >
              {feat}
            </span>
          ))}
        </div>

        <PrimaryButton onClick={() => goTo(2)}>
          Découvrir le Triple Projet
        </PrimaryButton>
        <SecondaryButton onClick={() => goTo(2)}>
          En savoir plus · Gratuit
        </SecondaryButton>
      </div>
    </div>
  );
}
