import type { LeadData, BookingData } from "@/lib/types";
import PrimaryButton from "../shared/PrimaryButton";
import SecondaryButton from "../shared/SecondaryButton";

interface ConfirmationScreenProps {
  lead: LeadData;
  booking: BookingData;
  goTo: (n: number) => void;
}

export default function ConfirmationScreen({
  lead,
  booking,
  goTo,
}: ConfirmationScreenProps) {
  return (
    <div className="max-w-[560px] mx-auto px-6 pb-16">
      <div className="pt-12 text-center">
        <div
          className="w-14 h-14 border-[1.5px] border-white/50 rounded-full flex items-center justify-center text-[22px] mx-auto mb-6"
          style={{ animation: "scalePop 0.5s ease forwards" }}
        >
          ✓
        </div>
        <h2 className="font-[family-name:var(--font-anton)] text-[clamp(26px,6vw,42px)] uppercase mb-[18px] leading-[1.1]">
          Votre appel<br />est confirmé.
        </h2>
        <p className="font-[family-name:var(--font-barlow-condensed)] text-[13px] font-semibold tracking-[2px] uppercase text-grey-light mb-9">
          Félicitations, {lead.prenom || "vous"} !
        </p>
      </div>

      {/* Booking card */}
      <div className="border border-white/20 py-7 px-6 text-left mb-8 bg-grey">
        {[
          { icon: "📅", label: "Date", value: booking.date ?? "À confirmer" },
          {
            icon: "🕙",
            label: "Heure",
            value: booking.time
              ? `${booking.time} · Durée : 30 min`
              : "À confirmer",
          },
          {
            icon: "💻",
            label: "Format",
            value: "Visioconférence · Lien envoyé par e-mail",
          },
          {
            icon: "👤",
            label: "Avec",
            value: "L'équipe Brikx Consulting",
          },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-start gap-[18px] py-3 ${
              i < arr.length - 1 ? "border-b border-border" : ""
            } ${i === 0 ? "pt-0" : ""} ${i === arr.length - 1 ? "pb-0" : ""}`}
          >
            <span className="text-lg shrink-0 mt-px">{row.icon}</span>
            <div>
              <div className="font-[family-name:var(--font-barlow-condensed)] text-[10px] font-bold tracking-[2px] uppercase text-grey-light mb-[3px]">
                {row.label}
              </div>
              <div className="text-[15px] font-semibold">{row.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Email notice */}
      <div className="border border-border py-5 px-6 text-left mb-8 flex gap-4 items-start">
        <span className="text-xl shrink-0">✉️</span>
        <p className="text-[13px] text-white/60 leading-[1.6] font-light">
          <strong className="text-white font-semibold">
            Un e-mail de confirmation vient de vous être envoyé.
          </strong>{" "}
          Il contient le lien d&apos;accès à la visioconférence ainsi que les
          informations pratiques pour notre échange.
        </p>
      </div>

      <div className="w-full h-px bg-border my-8" />

      {/* Questionnaire CTA */}
      <div className="text-center">
        <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[2.5px] uppercase text-white/35 mb-[18px]">
          Pour préparer au mieux notre rendez-vous
        </p>
        <PrimaryButton onClick={() => goTo(6)} className="max-w-100">
          Répondre au questionnaire
        </PrimaryButton>
        <SecondaryButton onClick={() => goTo(7)}>
          Passer cette étape
        </SecondaryButton>
      </div>
    </div>
  );
}
