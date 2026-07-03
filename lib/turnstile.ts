export async function verifyTurnstileToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail-closed en production : pas de clé = pas d'insertion (jamais de bypass silencieux).
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY manquant en production — vérification anti-bot rejetée."
      );
      return false;
    }
    // En développement, on autorise sans captcha pour le confort local.
    return true;
  }

  if (!token) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );

  const data = await res.json();
  return data.success === true;
}
