import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getResend } from "@/lib/resend";
import { leadCreateSchema } from "@/lib/validation";
import { escapeHtml } from "@/lib/sanitize";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { generateLeadToken } from "@/lib/lead-token";

async function resolveCalendlyEvent(eventUri: string) {
  const token = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
  if (!token || !eventUri.startsWith("https://api.calendly.com/")) {
    return { booking_date: null, booking_time: null, booking_start: null };
  }

  try {
    const res = await fetch(eventUri, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Calendly API error:", res.status);
      return { booking_date: null, booking_time: null, booking_start: null };
    }

    const data = await res.json();
    const startTime = data.resource?.start_time;

    if (!startTime) return { booking_date: null, booking_time: null, booking_start: null };

    const d = new Date(startTime);
    return {
      booking_date: d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      booking_time: d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      booking_start: startTime,
    };
  } catch (err) {
    console.error("Calendly event resolution error:", err);
    return { booking_date: null, booking_time: null, booking_start: null };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = leadCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides.", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prenom, email, telephone, calendly_event_uri, turnstile_token, pain_points } = result.data;

    const turnstileValid = await verifyTurnstileToken(turnstile_token);
    if (!turnstileValid) {
      return NextResponse.json(
        { error: "Vérification anti-bot échouée." },
        { status: 403 }
      );
    }

    const { booking_date, booking_time, booking_start } = calendly_event_uri
      ? await resolveCalendlyEvent(calendly_event_uri)
      : { booking_date: null, booking_time: null, booking_start: null };

    const { data, error } = await getSupabase()
      .from("leads")
      .insert({
        prenom,
        email,
        telephone,
        calendly_event_uri,
        booking_date,
        booking_time,
        booking_start,
        pain_points,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement." },
        { status: 500 }
      );
    }

    const lead_token = generateLeadToken(data.id);

    const safePrenom = escapeHtml(prenom);
    const safeDate = booking_date ? escapeHtml(booking_date) : null;
    const safeTime = booking_time ? escapeHtml(booking_time) : null;

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Brikx Consulting <noreply@karlduponchel.fr>",
        to: email,
        subject: "Votre appel découverte est confirmé — brikx.",
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 48px 32px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: -0.5px; margin: 0;">
                Votre appel est confirmé.
              </h1>
              <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">
                Félicitations, ${safePrenom} !
              </p>
            </div>

            <div style="border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 24px;">
              ${safeDate ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>📅 Date :</strong> ${safeDate}</p>` : ""}
              ${safeTime ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>🕙 Heure :</strong> ${safeTime} · Durée : 30 min</p>` : ""}
              <p style="margin: 0 0 12px; font-size: 14px;"><strong>💻 Format :</strong> Visioconférence</p>
              <p style="margin: 0; font-size: 14px;"><strong>👤 Avec :</strong> L'équipe Brikx Consulting</p>
            </div>

            <p style="color: #888; font-size: 13px; line-height: 1.6;">
              Vous recevrez un rappel 24h avant votre rendez-vous avec le lien de connexion à la visioconférence.
            </p>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;">
              <p style="color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                brikxconsulting — Santé & Performance du Dirigeant
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend email error:", emailError);
    }

    return NextResponse.json(
      { success: true, id: data.id, lead_token, booking_date, booking_time },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
