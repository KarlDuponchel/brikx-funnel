import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getResend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prenom, email, telephone, calendly_event_uri, booking_date, booking_time } = body;

    if (!prenom || !email || !telephone) {
      return NextResponse.json(
        { error: "Prénom, email et téléphone sont requis." },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from("leads")
      .insert({
        prenom,
        email,
        telephone,
        calendly_event_uri,
        booking_date,
        booking_time,
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

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Brikx Consulting <noreply@brikx.fr>",
        to: email,
        subject: "Votre appel découverte est confirmé — brikx.",
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 48px 32px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: -0.5px; margin: 0;">
                Votre appel est confirmé.
              </h1>
              <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">
                Félicitations, ${prenom} !
              </p>
            </div>

            <div style="border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 24px;">
              ${booking_date ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>📅 Date :</strong> ${booking_date}</p>` : ""}
              ${booking_time ? `<p style="margin: 0 0 12px; font-size: 14px;"><strong>🕙 Heure :</strong> ${booking_time} · Durée : 30 min</p>` : ""}
              <p style="margin: 0 0 12px; font-size: 14px;"><strong>💻 Format :</strong> Visioconférence</p>
              <p style="margin: 0; font-size: 14px;"><strong>👤 Avec :</strong> L'équipe Brikx Consulting</p>
            </div>

            <p style="color: #888; font-size: 13px; line-height: 1.6;">
              Vous recevrez un rappel 24h avant votre rendez-vous avec le lien de connexion à la visioconférence.
            </p>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;">
              <p style="color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
                brikx. consulting — Santé & Performance du Dirigeant
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend email error:", emailError);
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
