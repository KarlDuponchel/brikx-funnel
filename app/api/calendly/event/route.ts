import { NextResponse } from "next/server";
import { calendlyEventSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = calendlyEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "URI invalide.", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { eventUri } = result.data;

    const token = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN;
    if (!token) {
      console.error("CALENDLY_PERSONAL_ACCESS_TOKEN non configuré");
      return NextResponse.json(
        { error: "API Calendly non configurée." },
        { status: 500 }
      );
    }

    const res = await fetch(eventUri, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Calendly API error:", res.status);
      return NextResponse.json(
        { error: "Erreur API Calendly." },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      start_time: data.resource?.start_time ?? null,
      end_time: data.resource?.end_time ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
