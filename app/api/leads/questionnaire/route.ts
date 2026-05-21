import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { lead_id, domaineActivite, entreprise, defi, motivation } = body;

    if (!lead_id) {
      return NextResponse.json(
        { error: "lead_id est requis." },
        { status: 400 }
      );
    }

    const { error } = await getSupabase()
      .from("leads")
      .update({
        domaine_activite: domaineActivite,
        entreprise,
        defi,
        motivation,
      })
      .eq("id", lead_id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
