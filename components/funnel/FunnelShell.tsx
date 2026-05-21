"use client";

import { useState, useCallback, useRef } from "react";
import type { LeadData, BookingData, QuestionnaireData } from "@/lib/types";
import Stepper from "./Stepper";
import ScreenWrapper from "./ScreenWrapper";
import GrainOverlay from "./shared/GrainOverlay";
import HeroScreen from "./screens/HeroScreen";
import FormScreen from "./screens/FormScreen";
import VideoSocialScreen from "./screens/VideoSocialScreen";
import CalendarScreen from "./screens/CalendarScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import QuestionnaireScreen from "./screens/QuestionnaireScreen";
import FinalScreen from "./screens/FinalScreen";

const TOTAL_SCREENS = 7;

export default function FunnelShell() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [leavingScreen, setLeavingScreen] = useState<number | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const transitionRef = useRef(false);

  const [lead, setLead] = useState<LeadData>({
    prenom: "",
    email: "",
    telephone: "",
    cgvAccepted: true,
  });

  const [booking, setBooking] = useState<BookingData>({
    calendlyEventUri: null,
    date: null,
    time: null,
  });

  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData>({
    domaineActivite: "",
    entreprise: "",
    defi: "",
    motivation: null,
  });

  const goTo = useCallback(
    (target: number) => {
      if (transitionRef.current || target === currentScreen) return;
      transitionRef.current = true;

      setLeavingScreen(currentScreen);
      setCurrentScreen(target);

      window.scrollTo({ top: 0, behavior: "instant" });

      setTimeout(() => {
        setLeavingScreen(null);
        transitionRef.current = false;
      }, 300);
    },
    [currentScreen]
  );

  const handleLeadCreated = useCallback(
    async (bookingData: BookingData) => {
      setBooking(bookingData);
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: lead.prenom,
            email: lead.email,
            telephone: lead.telephone,
            calendly_event_uri: bookingData.calendlyEventUri,
            booking_date: bookingData.date,
            booking_time: bookingData.time,
          }),
        });
        const data = await res.json();
        if (data.id) setLeadId(data.id);
      } catch (err) {
        console.error("Erreur lors de la création du lead:", err);
      }
      goTo(5);
    },
    [lead, goTo]
  );

  const handleQuestionnaireSubmit = useCallback(async () => {
    if (!leadId) {
      goTo(7);
      return;
    }
    try {
      await fetch("/api/leads/questionnaire", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          ...questionnaire,
        }),
      });
    } catch {
      // Silencieux — le questionnaire est facultatif
    }
    goTo(7);
  }, [leadId, questionnaire, goTo]);

  return (
    <>
      <Stepper currentScreen={currentScreen} totalScreens={TOTAL_SCREENS} />

      <ScreenWrapper isActive={currentScreen === 1} isLeaving={leavingScreen === 1}>
        <HeroScreen goTo={goTo} />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 2} isLeaving={leavingScreen === 2}>
        <FormScreen goTo={goTo} lead={lead} setLead={setLead} />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 3} isLeaving={leavingScreen === 3}>
        <VideoSocialScreen goTo={goTo} />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 4} isLeaving={leavingScreen === 4}>
        <CalendarScreen goTo={goTo} lead={lead} onBookingComplete={handleLeadCreated} />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 5} isLeaving={leavingScreen === 5}>
        <ConfirmationScreen lead={lead} booking={booking} goTo={goTo} />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 6} isLeaving={leavingScreen === 6}>
        <QuestionnaireScreen
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
          onSubmit={handleQuestionnaireSubmit}
          goTo={goTo}
        />
      </ScreenWrapper>

      <ScreenWrapper isActive={currentScreen === 7} isLeaving={leavingScreen === 7}>
        <FinalScreen lead={lead} />
      </ScreenWrapper>

      <GrainOverlay />
    </>
  );
}
