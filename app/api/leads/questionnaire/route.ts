import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { questionnaireSchema } from "@/lib/validation";
import { verifyLeadToken } from "@/lib/lead-token";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = questionnaireSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides.", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { lead_id, lead_token, domaineActivite, entreprise, defi, motivation } = result.data;

    if (!verifyLeadToken(lead_id, lead_token)) {
      return NextResponse.json(
        { error: "Token invalide." },
        { status: 403 }
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
