import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const secret = process.env.LEAD_TOKEN_SECRET;
  if (!secret) throw new Error("LEAD_TOKEN_SECRET doit être configuré");
  return secret;
}

export function generateLeadToken(leadId: string): string {
  return createHmac("sha256", getSecret()).update(leadId).digest("hex");
}

export function verifyLeadToken(leadId: string, token: string): boolean {
  const expected = generateLeadToken(leadId);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}
