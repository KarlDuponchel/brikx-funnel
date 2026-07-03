import { FEATURES } from "@/lib/constants";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";
import Link from "next/link";
import Image from "next/image";

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
            <span className="inline-block font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3px] uppercase text-white border border-white/35 py-1.5 px-3.5 mb-3.5">
              Pour les dirigeants &amp; chefs d&apos;entreprise ambitieux
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-4 px-6 max-w-170 mx-auto text-center flex flex-col items-center">
        <Link className="shrink-0 flex justify-center mb-4" href={"/"}>
          <Image src="/logo-brikx.png" alt="brikx." loading="eager" width={200} height={80} className="block" />
        </Link>

        <div className="flex flex-wrap items-center py-1.5 px-3 sm:py-2 sm:px-4 rounded-full border border-white/30 justify-center gap-x-2 gap-y-1 sm:gap-3 mb-8 max-w-full font-(family-name:--font-barlow-condensed) text-[10px] sm:text-[13px] font-semibold tracking-[0.5px] sm:tracking-[1.5px] text-white/90">
          <span>Elue meilleure formation pour les dirigeants</span>
          <span className="hidden sm:block w-px h-4 bg-grey-light/30" />
          <span className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-[pulseGreen_1.5s_infinite]" />
            Places limitées
          </span>
        </div>

        <h1 className="font-(family-name:--font-anton) text-[clamp(42px,11vw,64px)] leading-none tracking-[-0.5px] uppercase mb-5">
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
              className="word-reveal inline-block mr-[0.3em] text-primary"
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

        <p className="text-[15px] leading-[1.65] text-white/65 max-w-120 mx-auto mb-8 font-light">
          Une méthode pour les dirigeants qui refusent de choisir entre la
          performance de leur entreprise, leur santé et leur vie.
        </p>

        <div className="flex justify-center gap-6 flex-wrap mb-9">
          {FEATURES.map((feat) => (
            <span
              key={feat}
              className="font-(family-name:--font-barlow-condensed) text-xs font-semibold tracking-[1.5px] uppercase text-white/50 flex items-center gap-1.75 before:content-[''] before:w-4.5 before:h-px before:bg-white/30"
            >
              {feat}
            </span>
          ))}
        </div>

        <PrimaryButton onClick={() => goTo(2)} className="max-w-100">
          Découvrir le Triple Projet
        </PrimaryButton>
        <SecondaryButton onClick={() => goTo(2)}>
          En savoir plus · Gratuit
        </SecondaryButton>
      </div>
    </div>
  );
}
