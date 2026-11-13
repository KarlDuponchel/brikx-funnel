import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { recipientsFromEnv, sendEmail } from "@/lib/resend";
import { escapeHtml } from "@/lib/sanitize";
import { verifyCronSecret } from "@/lib/cron-auth";
import { QUESTIONS } from "@/lib/constants";

/**
 * Récap des réponses au questionnaire : un seul e-mail regroupant tous les
 * clients dont le RDV tombe dans les prochaines 24 h, envoyé à QUESTIONNAIRE_RECAP_EMAIL.
 * La fenêtre de 24 h pile, combinée à un déclenchement quotidien, garantit
 * qu'un même RDV n'est récapitulé qu'une seule fois, sans colonne de suivi.
 */
const WINDOW_MS = 24 * 60 * 60 * 1000;

interface RecapLead {
  id: string;
  prenom: string;
  email: string;
  telephone: string;
  booking_date: string | null;
  booking_time: string | null;
  domaine_activite: string | null;
  entreprise: string | null;
  defi: string | null;
  motivation: number | null;
  pain_points: string[] | null;
}

const questionLabel = (field: (typeof QUESTIONS)[number]["field"]) =>
  QUESTIONS.find((q) => q.field === field)!.question.replace(/\n/g, " ");

const EMPTY = `<span style="color: #555; font-style: italic;">Non renseigné</span>`;
const BORDER = "1px solid rgba(255,255,255,0.12)";

function answer(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? escapeHtml(trimmed).replace(/\n/g, "<br>") : EMPTY;
}

function label(text: string): string {
  return `<p style="margin: 0 0 12px; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">${text}</p>`;
}

function qa(question: string, value: string): string {
  return `
    <p style="margin: 0 0 4px; color: #888; font-size: 13px;">${escapeHtml(question)}</p>
    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6;">${value}</p>`;
}

function buildSummary(leads: RecapLead[]): string {
  const rows = leads
    .map(
      (l) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; font-size: 14px; white-space: nowrap; vertical-align: top;">${answer(l.booking_time)}</td>
          <td style="padding: 8px 12px 8px 0; font-size: 14px; vertical-align: top;">${escapeHtml(l.prenom)}</td>
          <td style="padding: 8px 0; font-size: 14px; color: #888; vertical-align: top;">${answer(l.entreprise)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="border: ${BORDER}; padding: 24px; margin-bottom: 40px;">
      ${label("Au programme")}
      <table role="presentation" style="width: 100%; border-collapse: collapse; color: #fff;">${rows}</table>
    </div>`;
}

function buildLeadCard(lead: RecapLead): string {
  const answered = [lead.domaine_activite, lead.entreprise, lead.defi].some((v) => v?.trim()) || lead.motivation != null;
  const questionnaire = answered
    ? qa(questionLabel("domaineActivite"), answer(lead.domaine_activite)) +
      qa(questionLabel("entreprise"), answer(lead.entreprise)) +
      qa(questionLabel("defi"), answer(lead.defi)) +
      qa(questionLabel("motivation"), lead.motivation != null ? `${lead.motivation} / 10` : EMPTY)
    : `<p style="margin: 0 0 16px; font-size: 14px;">${EMPTY} — le client n'a pas complété le questionnaire.</p>`;
  const painPoints = lead.pain_points?.length
    ? `<ul style="margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6;">${lead.pain_points
        .map((p) => `<li>${escapeHtml(p)}</li>`)
        .join("")}</ul>`
    : `<p style="margin: 0; font-size: 14px;">${EMPTY}</p>`;

  return `
    <div style="border: ${BORDER}; padding: 24px; margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 400; text-transform: uppercase; margin: 0 0 4px;">${escapeHtml(lead.prenom)}</h2>
      <p style="margin: 0 0 20px; color: #888; font-size: 13px;">${answer(lead.booking_date)} · ${answer(lead.booking_time)}</p>

      <p style="margin: 0 0 8px; font-size: 14px;"><strong>✉️ Email :</strong> ${escapeHtml(lead.email)}</p>
      <p style="margin: 0 0 24px; font-size: 14px;"><strong>📞 Téléphone :</strong> ${escapeHtml(lead.telephone)}</p>

      <div style="border-top: ${BORDER}; padding-top: 20px;">
        ${label("Questionnaire")}
        ${questionnaire}
      </div>

      <div style="border-top: ${BORDER}; padding-top: 20px;">
        ${label("Situations cochées")}
        ${painPoints}
      </div>
    </div>`;
}

function buildRecapHtml(leads: RecapLead[], today: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 48px 32px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: -0.5px; margin: 0;">
          ${leads.length} RDV à venir
        </h1>
        <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">
          Récap questionnaire du ${escapeHtml(today)}
        </p>
      </div>

      ${buildSummary(leads)}
      ${leads.map(buildLeadCard).join("")}

      <div style="margin-top: 40px; padding-top: 24px; border-top: ${BORDER}; text-align: center;">
        <p style="color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
          BRIKX — 3 sphères. 1 trajectoire.
        </p>
      </div>
    </div>`;
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const recapEmail = recipientsFromEnv("QUESTIONNAIRE_RECAP_EMAIL");
  if (recapEmail.length === 0) {
    console.error("QUESTIONNAIRE_RECAP_EMAIL manquant — récap questionnaire impossible.");
    return NextResponse.json({ error: "Destinataire du récap non configuré." }, { status: 500 });
  }

  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + WINDOW_MS);

    const { data: leads, error } = await getSupabase()
      .from("leads")
      .select("id, prenom, email, telephone, booking_date, booking_time, domaine_activite, entreprise, defi, motivation, pain_points")
      .not("booking_start", "is", null)
      .gte("booking_start", now.toISOString())
      .lt("booking_start", windowEnd.toISOString())
      .order("booking_start", { ascending: true })
      .returns<RecapLead[]>();

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "Aucun RDV dans les prochaines 24 h.", count: 0 });
    }

    const today = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Paris" });

    await sendEmail({
      to: recapEmail,
      subject: `Récap questionnaire du ${today} — ${leads.length} RDV à venir — brikx`,
      html: buildRecapHtml(leads, today),
    });

    return NextResponse.json({ message: `Récap envoyé pour ${leads.length} RDV.`, count: leads.length });
  } catch (err) {
    console.error("Erreur récap questionnaire:", err);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
