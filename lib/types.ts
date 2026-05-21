export interface LeadData {
  prenom: string;
  email: string;
  telephone: string;
  cgvAccepted: boolean;
}

export interface BookingData {
  calendlyEventUri: string | null;
  date: string | null;
  time: string | null;
}

export interface QuestionnaireData {
  domaineActivite: string;
  entreprise: string;
  defi: string;
  motivation: number | null;
}

export interface FunnelState {
  currentScreen: number;
  leavingScreen: number | null;
  lead: LeadData;
  booking: BookingData;
  questionnaire: QuestionnaireData;
  leadId: string | null;
}
