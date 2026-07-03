import { useEffect, useState, useMemo, useRef } from "react";
import type { LeadData, BookingData } from "@/lib/types";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

interface CalendarScreenProps {
  goTo: (n: number) => void;
  lead: LeadData;
  onBookingComplete: (booking: BookingData) => void;
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export default function CalendarScreen({
  goTo,
  lead,
  onBookingComplete,
}: CalendarScreenProps) {
  const [booked, setBooked] = useState(false);
  const [eventUri, setEventUri] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calendlySrc = useMemo(() => {
    if (!CALENDLY_URL) return null;
    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      background_color: "000000",
      text_color: "ffffff",
      primary_color: "ffffff",
    });
    if (lead.prenom) params.set("name", lead.prenom);
    if (lead.email) params.set("email", lead.email);
    if (lead.telephone) {
      let phone = lead.telephone.replace(/\s+/g, "");
      if (phone.startsWith("0")) phone = "+33" + phone.slice(1);
      if (!phone.startsWith("+")) phone = "+33" + phone;
      params.set("a1", phone);
      params.set("location", phone);
    }
    return `${CALENDLY_URL}?${params.toString()}`;
  }, [lead.prenom, lead.email, lead.telephone]);

  useEffect(() => {
    if (!calendlySrc || !containerRef.current) return;

    const container = containerRef.current;

    const initWidget = () => {
      if (!window.Calendly || !container) return;
      container.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: calendlySrc,
        parentElement: container,
      });
    };

    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    );

    if (existing && window.Calendly) {
      initWidget();
    } else if (!existing) {
      const script = document.createElement("script");
      script.src =
        "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }
  }, [calendlySrc]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?.event) return;

      if (e.data.event === "calendly.event_scheduled") {
        const payload = e.data.payload ?? {};
        const uri: string | null = payload.event?.uri ?? null;
        setEventUri(uri);
        setBooked(true);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleConfirm = () => {
    // Le bouton n'est rendu que lorsque booked === true, donc eventUri est fiable.
    onBookingComplete({
      calendlyEventUri: eventUri,
      date: null,
      time: null,
    });
  };

  return (
    <div>
      <BackButton onClick={() => goTo(3)} />
      <div className="max-w-150 mx-auto px-6 pt-6 pb-12">
        <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-primary mb-2.5 text-center">
          Appel découverte · 30 minutes
        </p>
        <h2 className="font-(family-name:--font-anton) text-[clamp(24px,5vw,40px)] uppercase text-center mb-8 leading-[1.05]">
          Choisissez<br />votre créneau
        </h2>

        <div className="border border-border py-4 px-5 mb-9 flex items-center gap-3.5">
          <span className="text-xl shrink-0">📋</span>
          <p className="text-[13px] text-white/60 leading-normal font-light">
            <strong className="text-white font-semibold">
              1 créneau disponible par semaine.
            </strong>{" "}
            Les places sont limitées pour garantir un suivi de qualité.
            Choisissez le créneau qui vous convient le mieux.
          </p>
        </div>

        {calendlySrc ? (
          <>
            <div
              ref={containerRef}
              style={{ minWidth: 320, height: 700 }}
              className="w-full"
            />
            <div className="mt-8 text-center">
              {booked ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2 text-primary font-(family-name:--font-barlow-condensed) text-sm font-semibold tracking-[1.5px] uppercase">
                    <span>&#10003;</span>
                    Créneau réservé
                  </div>
                  <PrimaryButton onClick={handleConfirm}>
                    Continuer
                  </PrimaryButton>
                </>
              ) : (
                <p className="text-[13px] text-white/40 leading-[1.6] font-light">
                  Confirmez votre rendez-vous dans le calendrier ci-dessus.
                  <br />
                  L&apos;étape suivante s&apos;affichera une fois votre créneau
                  réservé.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="border border-border p-12 text-center">
            <p className="text-white/40 font-(family-name:--font-barlow-condensed) text-sm tracking-[1px] uppercase mb-4">
              Calendly non configuré
            </p>
            <p className="text-white/25 text-sm leading-[1.6]">
              Ajoutez{" "}
              <code className="text-white/40">NEXT_PUBLIC_CALENDLY_URL</code>{" "}
              dans votre fichier{" "}
              <code className="text-white/40">.env.local</code> pour activer la
              prise de rendez-vous.
            </p>
            <button
              onClick={() =>
                onBookingComplete({
                  calendlyEventUri: "test-event",
                  date: "Mercredi 21 mai 2026",
                  time: "10h00",
                })
              }
              className="mt-6 text-xs text-white/30 border border-white/15 px-4 py-2 cursor-pointer hover:text-white/60 hover:border-white/30 transition-all"
            >
              Mode test : simuler une réservation →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
