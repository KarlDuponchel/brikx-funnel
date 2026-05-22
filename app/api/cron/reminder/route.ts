import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getResend } from "@/lib/resend";
import { escapeHtml } from "@/lib/sanitize";
import { verifyCronSecret } from "@/lib/cron-auth";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const now = new Date();
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

    const { data: leads, error } = await getSupabase()
      .from("leads")
      .select("id, prenom, email, booking_date, booking_time, booking_start")
      .eq("reminder_sent", false)
      .not("booking_start", "is", null)
      .gte("booking_start", now.toISOString())
      .lte("booking_start", in25h);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "Aucun rappel à envoyer.", count: 0 });
    }

    const from = process.env.RESEND_FROM_EMAIL || "Brikx Consulting <noreply@karlduponchel.fr>";
    let sent = 0;

    for (const lead of leads) {
      const safePrenom = escapeHtml(lead.prenom);
      const safeDate = lead.booking_date ? escapeHtml(lead.booking_date) : null;
      const safeTime = lead.booking_time ? escapeHtml(lead.booking_time) : null;

      try {
        await getResend().emails.send({
          from,
          to: lead.email,
          subject: "Rappel — votre appel découverte est demain — brikx.",
          html: `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 48px 32px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: -0.5px; margin: 0;">
                  Votre appel est demain.
                </h1>
                <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">
                  À demain, ${safePrenom} !
                </p>
              </div>

              <div style="border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 24px;">
                ${safeDate ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>📅 Date :</strong> ${safeDate}</p>` : ""}
                ${safeTime ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>🕙 Heure :</strong> ${safeTime} · Durée : 30 min</p>` : ""}
                <p style="margin: 0 0 12px; font-size: 14px;"><strong>💻 Format :</strong> Visioconférence</p>
                <p style="margin: 0; font-size: 14px;"><strong>👤 Avec :</strong> L'équipe Brikx Consulting</p>
              </div>

              <p style="color: #888; font-size: 13px; line-height: 1.6;">
                Préparez vos questions et vos objectifs — cet appel est conçu pour vous apporter un maximum de valeur en 30 minutes.
              </p>

              <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;">
                <p style="color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                  brikxconsulting — Santé &amp; Performance du Dirigeant
                </p>
              </div>
            </div>
          `,
        });

        await getSupabase()
          .from("leads")
          .update({ reminder_sent: true })
          .eq("id", lead.id);

        sent++;
      } catch (emailError) {
        console.error(`Erreur envoi rappel pour ${lead.id}:`, emailError);
      }
    }

    return NextResponse.json({ message: `${sent} rappel(s) envoyé(s).`, count: sent });
  } catch {
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
