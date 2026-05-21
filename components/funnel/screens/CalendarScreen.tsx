import { useEffect, useState, useMemo } from "react";
import type { LeadData, BookingData } from "@/lib/types";
import BackButton from "../shared/BackButton";
import PrimaryButton from "../shared/PrimaryButton";

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
  const [bookingData, setBookingData] = useState<BookingData>({
    calendlyEventUri: null,
    date: null,
    time: null,
  });

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Log TOUS les messages provenant de Calendly pour debug
      if (e.origin?.includes("calendly")) {
        console.log("[Calendly message]", JSON.stringify(e.data, null, 2));
      }

      if (!e.data?.event) return;

      if (e.data.event === "calendly.date_and_time_selected") {
        console.log("[Calendly] date_and_time_selected:", JSON.stringify(e.data, null, 2));
      }

      if (e.data.event === "calendly.event_scheduled") {
        console.log("[Calendly] event_scheduled:", JSON.stringify(e.data, null, 2));

        const payload = e.data.payload ?? {};
        const eventUri = payload.event?.uri ?? payload.uri ?? null;

        const startTime =
          payload.event?.start_time ??
          payload.invitee?.event?.start_time ??
          payload.event_start_time ??
          null;

        let date: string | null = null;
        let time: string | null = null;

        if (startTime) {
          const d = new Date(startTime);
          date = d.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          time = d.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        setBookingData({ calendlyEventUri: eventUri, date, time });
        setBooked(true);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
      // Convertir 06... ou 07... en +336... ou +337...
      if (phone.startsWith("0")) {
        phone = "+33" + phone.slice(1);
      }
      // Ajouter +33 si pas de préfixe international
      if (!phone.startsWith("+")) {
        phone = "+33" + phone;
      }
      params.set("a1", phone);
      params.set("location", phone);
    }
    return `${CALENDLY_URL}?${params.toString()}`;
  }, [lead.prenom, lead.email, lead.telephone]);

  const handleConfirm = () => {
    onBookingComplete(booked ? bookingData : {
      calendlyEventUri: null,
      date: null,
      time: null,
    });
  };

  return (
    <div>
      <BackButton onClick={() => goTo(3)} />
      <div className="max-w-150 mx-auto px-6 pt-6 pb-12">
        <p className="font-(family-name:--font-barlow-condensed) text-[11px] font-bold tracking-[3.5px] uppercase text-grey-light mb-2.5 text-center">
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
            <iframe
              src={calendlySrc}
              className="w-full border-0 min-h-170 rounded-none"
              title="Calendly - Réserver un appel découverte"
            />
            <div className="mt-8 text-center">
              <PrimaryButton onClick={handleConfirm}>
                J&apos;ai réservé mon créneau
              </PrimaryButton>
              <p className="mt-3 text-[11px] text-white/25 leading-[1.6]">
                Cliquez après avoir confirmé votre rendez-vous dans le calendrier ci-dessus.
              </p>
            </div>
          </>
        ) : (
          <div className="border border-border p-12 text-center">
            <p className="text-white/40 font-(family-name:--font-barlow-condensed) text-sm tracking-[1px] uppercase mb-4">
              Calendly non configuré
            </p>
            <p className="text-white/25 text-sm leading-[1.6]">
              Ajoutez <code className="text-white/40">NEXT_PUBLIC_CALENDLY_URL</code> dans votre
              fichier <code className="text-white/40">.env.local</code> pour activer la
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
