import { useState } from "react";
import { STATS, TRIPLE_PROJET, PAIN_POINTS, TESTIMONIALS } from "@/lib/constants";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";

interface VideoSocialScreenProps {
  goTo: (n: number) => void;
}

export default function VideoSocialScreen({ goTo }: VideoSocialScreenProps) {
  const [selectedPains, setSelectedPains] = useState<Set<number>>(new Set());

  const togglePain = (i: number) => {
    setSelectedPains((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <BackButton onClick={() => goTo(2)} />
      <div className="max-w-190 mx-auto px-6 pt-6 pb-12">
        {/* Video */}
        <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-2.5 text-center">
          La méthode · Présentation exclusive
        </p>
        <h2 className="font-(family-name:--font-anton) text-[clamp(24px,5vw,40px)] uppercase text-center mb-8 leading-[1.05]">
          Faites-vous<br />brikx.er !
        </h2>

        <div className="bg-grey aspect-video flex flex-col items-center justify-center relative cursor-pointer overflow-hidden mb-9 border border-border transition-[border-color] duration-200 hover:border-white/30">
          <div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)",
            }}
          />
          <div className="play-ring" />
          <div className="play-ring" />
          <div className="play-ring" />
          <div className="w-16 h-16 border-2 border-white/70 rounded-full flex items-center justify-center relative z-1 transition-all duration-200">
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
          <p className="font-(family-name:--font-barlow-condensed) text-xs font-semibold tracking-[1.5px] uppercase text-white/35 mt-4 text-center relative z-1">
            Vidéo de présentation · C1 · ~12 min
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-border border border-border mb-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-black py-6 px-4 text-center">
              <div className="font-(family-name:--font-anton) text-[clamp(28px,6vw,48px)] leading-none mb-1.5">
                {stat.value}
              </div>
              <div className="font-(family-name:--font-barlow-condensed) text-[10px] font-bold tracking-[2px] uppercase text-grey-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Triple Projet */}
        <div className="mb-14">
          <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-2.5">
            La méthode · Fondée sur les neurosciences
          </p>
          <h3 className="font-(family-name:--font-anton) text-[clamp(22px,5vw,38px)] uppercase mb-6 leading-[1.1]">
            Le Triple Projet
          </h3>
          <p className="text-sm leading-[1.7] text-white/55 mb-6 font-light">
            La plupart des approches de coaching traitent la performance
            professionnelle d&apos;un côté, la santé de l&apos;autre — et
            ignorent le reste. Le Triple Projet part d&apos;un principe
            différent, validé par les neurosciences :{" "}
            <strong className="text-white font-semibold">
              un dirigeant ne peut pas performer durablement s&apos;il se
              fragmente
            </strong>
            . Les trois projets forment un système. On travaille les trois, ou
            on ne travaille rien.
          </p>
          <div className="grid gap-3">
            {TRIPLE_PROJET.map((item) => (
              <div
                key={item.num}
                className="border border-border p-5 transition-all duration-200 hover:border-white/30"
              >
                <div className="font-condensed text-[11px] font-bold tracking-[2px] uppercase text-grey-light mb-1">
                  {item.num}
                </div>
                <div className="font-(family-name:--font-anton) text-lg uppercase mb-2">
                  {item.name}
                </div>
                <p className="text-[13px] leading-[1.6] text-white/55 font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pain points */}
        <div className="mb-14">
          <h3 className="font-(family-name:--font-anton) text-[clamp(22px,5vw,38px)] uppercase mb-6 leading-[1.1]">
            Vous en avez marre de...
          </h3>
          <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
            {PAIN_POINTS.map((pain, i) => (
              <button
                key={i}
                onClick={() => togglePain(i)}
                className={`border text-left text-[13px] font-normal leading-[1.4] cursor-pointer transition-all duration-200 relative pl-10.5 py-4 pr-4.5 before:content-[''] before:absolute before:left-4 before:top-1/2 before:-translate-y-1/2 before:w-3.5 before:h-3.5 before:border before:rounded-full before:transition-all before:duration-200 ${
                  selectedPains.has(i)
                    ? "border-white/50 text-white bg-grey before:bg-white before:border-white"
                    : "border-border text-white/60 hover:border-white/50 hover:text-white hover:bg-grey before:border-white/25"
                }`}
              >
                {pain}
              </button>
            ))}
          </div>
        </div>

        {/* CTA + Social proof */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="flex">
              {["LM", "SD", "MT"].map((initials, i) => (
                <div
                  key={initials}
                  className="w-6.5 h-6.5 rounded-full bg-grey-mid border-2 border-black font-(family-name:--font-barlow-condensed) text-[10px] font-bold flex items-center justify-center"
                  style={{ marginLeft: i > 0 ? -8 : 0 }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] shrink-0 animate-[pulseGreen_1.8s_infinite]" />
            <span className="font-(family-name:--font-barlow-condensed) text-xs font-semibold tracking-[0.5px] text-white/50">
              <strong className="text-white">+200 dirigeants</strong> ont
              franchi le pas
            </span>
          </div>

          <PrimaryButton onClick={() => goTo(4)}>
            Réserver mon appel découverte
          </PrimaryButton>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-2.5 text-center">
            Témoignages · Ce qu&apos;ils en disent
          </p>
          <h3 className="font-(family-name:--font-anton) text-[clamp(22px,5vw,38px)] uppercase text-center mb-8 leading-[1.1]">
            Ils sont passés à l&apos;action
          </h3>
          <div className="grid gap-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="border border-border p-6 bg-grey relative"
              >
                <div className="text-[11px] tracking-[2px] text-yellow-400">
                  ★★★★★
                </div>
                <p className="text-sm leading-[1.65] text-white/75 mb-4.5 italic font-light">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-10.5 h-10.5 bg-grey-mid rounded-full shrink-0 flex items-center justify-center font-(family-name:--font-anton) text-base">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-(family-name:--font-barlow-condensed) text-xs font-bold tracking-[1.5px] uppercase">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-grey-light mt-0.5">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <PrimaryButton onClick={() => goTo(4)}>
            Réserver mon appel découverte
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
