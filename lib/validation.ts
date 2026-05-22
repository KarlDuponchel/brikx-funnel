import { z } from "zod";

const phoneRegex = /^(\+33|0)[1-9]\d{8}$/;

export const leadCreateSchema = z.object({
  prenom: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  telephone: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(phoneRegex, "Numéro de téléphone français invalide")),
  calendly_event_uri: z
    .string()
    .max(500)
    .startsWith("https://api.calendly.com/")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  turnstile_token: z.string().optional(),
  pain_points: z.array(z.string().max(200)).max(10).optional().default([]),
});

export const questionnaireSchema = z.object({
  lead_id: z.string().uuid(),
  lead_token: z.string().min(1),
  domaineActivite: z.string().max(200).optional().default(""),
  entreprise: z.string().max(200).optional().default(""),
  defi: z.string().max(2000).optional().default(""),
  motivation: z.number().int().min(1).max(10).nullable().optional().default(null),
});

export const calendlyEventSchema = z.object({
  eventUri: z.string().max(500).startsWith("https://api.calendly.com/"),
});
