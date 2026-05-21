import { useMemo } from "react";
import type { LeadData } from "@/lib/types";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";

interface FormScreenProps {
  goTo: (n: number) => void;
  lead: LeadData;
  setLead: React.Dispatch<React.SetStateAction<LeadData>>;
}

function formatPhoneDisplay(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  let normalized: string;
  if (digits.startsWith("33") && digits.length >= 3) {
    normalized = "0" + digits.slice(2);
  } else if (digits.startsWith("0")) {
    normalized = digits;
  } else {
    return null;
  }

  if (normalized.length < 1 || normalized.length > 10) return null;

  const padded = normalized.padEnd(10, "·");
  return `${padded.slice(0, 2)} ${padded.slice(2, 4)} ${padded.slice(4, 6)} ${padded.slice(6, 8)} ${padded.slice(8, 10)}`;
}

function isPhoneComplete(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("33")) return digits.length === 11;
  if (digits.startsWith("0")) return digits.length === 10;
  return false;
}

export default function FormScreen({ goTo, lead, setLead }: FormScreenProps) {
  const phoneComplete = useMemo(() => isPhoneComplete(lead.telephone), [lead.telephone]);
  const phonePreview = useMemo(() => formatPhoneDisplay(lead.telephone), [lead.telephone]);

  const isValid =
    lead.prenom.trim() !== "" &&
    lead.email.trim() !== "" &&
    phoneComplete;

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("+")) {
      if (cleaned.length > 12) return;
    } else {
      if (cleaned.replace(/\D/g, "").length > 10) return;
    }

    setLead((s) => ({ ...s, telephone: cleaned }));
  };

  const handleSubmit = () => {
    if (isValid) goTo(3);
  };

  return (
    <div>
      <BackButton onClick={() => goTo(1)} />
      <div className="max-w-130 mx-auto px-6 pt-6 pb-16">
        <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-3 text-center">
          Étape 1 sur 2 · Accès gratuit
        </p>
        <h2 className="font-(family-name:--font-anton) text-[clamp(26px,6vw,44px)] uppercase text-center mb-3 leading-[1.05]">
          Accédez à la<br />présentation<br />complète
        </h2>
        <p className="text-center text-sm text-white/50 mb-10 leading-[1.6] font-light">
          Renseignez vos informations pour accéder à la vidéo de présentation et
          réserver votre appel découverte.
        </p>

        <div className="mb-5">
          <label className="block font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[2.5px] uppercase text-grey-light mb-2">
            Nom/Prénom*
          </label>
          <input
            type="text"
            value={lead.prenom}
            onChange={(e) => setLead((s) => ({ ...s, prenom: e.target.value }))}
            placeholder="Votre nom et prénom"
            autoComplete="given-name"
            className="form-input w-full bg-grey border border-border text-white font-[family-name:var(--font-barlow)] text-[15px] py-4 px-[18px] outline-none transition-[border-color] duration-200 focus:border-white/50 placeholder:text-white/20"
          />
        </div>

        <div className="mb-5">
          <label className="block font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[2.5px] uppercase text-grey-light mb-2">
            Adresse e-mail*
          </label>
          <input
            type="email"
            value={lead.email}
            onChange={(e) => setLead((s) => ({ ...s, email: e.target.value }))}
            placeholder="votre@email.com"
            autoComplete="email"
            className="form-input w-full bg-grey border border-border text-white font-[family-name:var(--font-barlow)] text-[15px] py-4 px-[18px] outline-none transition-[border-color] duration-200 focus:border-white/50 placeholder:text-white/20"
          />
        </div>

        <div className="mb-5">
          <label className="block font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[2.5px] uppercase text-grey-light mb-2">
            Numéro de téléphone*
          </label>
          <input
            type="tel"
            value={lead.telephone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+33 6 00 00 00 00"
            autoComplete="tel"
            className="form-input w-full bg-grey border border-border text-white font-(family-name:--font-barlow) text-[15px] py-4 px-4.5 outline-none transition-[border-color] duration-200 focus:border-white/50 placeholder:text-white/20"
          />
          {lead.telephone.length > 0 && (
            <div className="mt-2 flex items-center gap-2.5">
              <span
                className={`font-mono text-sm tracking-[2px] transition-colors duration-200 ${
                  phoneComplete ? "text-green-400" : "text-white/30"
                }`}
              >
                {phonePreview ?? lead.telephone}
              </span>
              {phoneComplete && (
                <span className="text-green-400 text-xs">&#10003;</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2.5 mt-4">
            <input
              type="checkbox"
              id="cgv"
              checked={lead.cgvAccepted}
              onChange={(e) =>
                setLead((s) => ({ ...s, cgvAccepted: e.target.checked }))
              }
              className="w-4 h-4 accent-white shrink-0 mt-0.5 cursor-pointer"
            />
            <label
              htmlFor="cgv"
              className="text-[11px] text-white/30 cursor-pointer leading-normal"
            >
              J&apos;accepte de recevoir des informations de Brikx Consulting.
              Aucun spam — uniquement des contenus à forte valeur pour les
              dirigeants ambitieux.
            </label>
          </div>
          <p className="font-(family-name:--font-barlow) text-sm text-white/30">*Champs obligatoires</p>
        </div>

        <div className="mt-6">
          <PrimaryButton onClick={handleSubmit} disabled={!isValid}>
            Accéder à la présentation
          </PrimaryButton>
        </div>

        <p className="mt-5 text-[11px] text-white/25 text-center leading-[1.6]">
          Vos données sont traitées avec confidentialité.
          <br />
          Aucune vente à des tiers — jamais.
        </p>
      </div>
    </div>
  );
}
