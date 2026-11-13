import { Resend, type Attachment } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY doit être configuré dans .env.local");
    }
    _resend = new Resend(key);
  }
  return _resend;
}

/**
 * Liste de destinataires lue dans une variable d'environnement,
 * séparés par des virgules ou des points-virgules (ex : "a@x.fr, b@y.fr").
 * Resend refuse une chaîne contenant plusieurs adresses : il faut un tableau.
 */
export function recipientsFromEnv(name: string): string[] {
  return (process.env[name] ?? "")
    .split(/[,;]/)
    .map((email) => email.trim())
    .filter(Boolean);
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
}

/**
 * Expéditeur et reply-to pilotés par l'environnement.
 * Le SDK Resend ne lève pas d'exception en cas d'échec : on la lève ici
 * pour que les appelants ne considèrent jamais un e-mail non envoyé comme envoyé.
 */
export async function sendEmail(params: SendEmailParams) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL doit être configuré dans .env.local");
  }
  const replyTo = process.env.RESEND_REPLY_TO || undefined;

  const { data, error } = await getResend().emails.send({ ...params, from, replyTo });
  if (error) {
    throw new Error(`Échec d'envoi Resend (${error.name}) : ${error.message}`);
  }
  return data;
}
