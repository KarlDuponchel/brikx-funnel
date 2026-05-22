import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getResend } from "@/lib/resend";
import { verifyCronSecret } from "@/lib/cron-auth";

function escapeCsvField(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { data: leads, error } = await getSupabase()
      .from("leads")
      .select("prenom, email, telephone, booking_date, booking_time, domaine_activite, entreprise, defi, motivation, pain_points, created_at, booking_start")
      .not("booking_start", "is", null)
      .gte("booking_start", new Date().toISOString())
      .order("booking_start", { ascending: true });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json({ message: "Aucun lead avec RDV futur.", count: 0 });
    }

    const headers = ["Prénom", "Email", "Téléphone", "Date RDV", "Heure RDV", "Domaine", "Entreprise", "Défi", "Motivation", "Pain Points", "Créé le"];
    const BOM = "﻿";
    const rows = leads.map((l) => [
      escapeCsvField(l.prenom),
      escapeCsvField(l.email),
      escapeCsvField(l.telephone),
      escapeCsvField(l.booking_date),
      escapeCsvField(l.booking_time),
      escapeCsvField(l.domaine_activite),
      escapeCsvField(l.entreprise),
      escapeCsvField(l.defi),
      escapeCsvField(l.motivation != null ? String(l.motivation) : ""),
      escapeCsvField(Array.isArray(l.pain_points) ? l.pain_points.join("; ") : ""),
      escapeCsvField(l.created_at ? formatDate(l.created_at) : ""),
    ].join(","));

    const csv = BOM + headers.join(",") + "\n" + rows.join("\n");
    const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const exportEmail = process.env.LEADS_EXPORT_EMAIL || "contact@karlduponchel.fr";
    const from = process.env.RESEND_FROM_EMAIL || "Brikx Consulting <noreply@karlduponchel.fr>";

    await getResend().emails.send({
      from,
      to: exportEmail,
      subject: `Export leads du ${today} — ${leads.length} RDV à venir — brikx`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #000; color: #fff; padding: 48px 32px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 28px; font-weight: 400; text-transform: uppercase; letter-spacing: -0.5px; margin: 0;">
              Export leads du jour
            </h1>
            <p style="color: #888; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">
              ${today}
            </p>
          </div>

          <div style="border: 1px solid rgba(255,255,255,0.12); padding: 24px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px; font-size: 14px;"><strong>📊 Leads avec RDV à venir :</strong> ${leads.length}</p>
            <p style="margin: 0; font-size: 14px;"><strong>📎 Fichier :</strong> leads-export-${today.replace(/\//g, "-")}.csv</p>
          </div>

          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Le fichier CSV est joint à cet email. Il contient uniquement les leads ayant un rendez-vous planifié dans le futur.
          </p>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); text-align: center;">
            <p style="color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
              brikxconsulting — Santé &amp; Performance du Dirigeant
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `leads-export-${today.replace(/\//g, "-")}.csv`,
          content: Buffer.from(csv, "utf-8").toString("base64"),
          contentType: "text/csv",
        },
      ],
    });

    return NextResponse.json({ message: `Export envoyé avec ${leads.length} lead(s).`, count: leads.length });
  } catch (err) {
    console.error("Erreur export CSV:", err);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
