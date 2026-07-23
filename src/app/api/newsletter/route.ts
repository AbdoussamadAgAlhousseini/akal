import {NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';
import {getSupabaseAdmin} from '@/lib/supabase';
import {clientIp, rateLimit} from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(['en', 'fr', 'es']).optional()
});

const FROM = 'AKAL <infolettre@akal-indigenous.org>';

// Localized welcome email sent to a new subscriber.
const WELCOME: Record<'en' | 'fr' | 'es', {subject: string; body: string}> = {
  fr: {
    subject: "Bienvenue à l'infolettre AKAL",
    body: "Merci de votre inscription à l'infolettre d'AKAL. Vous recevrez nos actualités sur les peuples autochtones et le pastoralisme — droits, opportunités et fiches de peuples.\n\nÀ bientôt,\nL'équipe AKAL\nhttps://akal-indigenous.org"
  },
  en: {
    subject: 'Welcome to the AKAL newsletter',
    body: "Thank you for subscribing to the AKAL newsletter. You'll receive our news on Indigenous Peoples and pastoralism — rights, opportunities and people fact sheets.\n\nSee you soon,\nThe AKAL team\nhttps://akal-indigenous.org"
  },
  es: {
    subject: 'Bienvenido al boletín de AKAL',
    body: 'Gracias por suscribirse al boletín de AKAL. Recibirá nuestras noticias sobre los pueblos indígenas y el pastoralismo: derechos, oportunidades y fichas de pueblos.\n\nHasta pronto,\nEl equipo AKAL\nhttps://akal-indigenous.org'
  }
};

/**
 * Newsletter sign-up: stores the subscriber (idempotent on email), adds them to
 * the Resend audience so they receive future broadcasts, and sends a welcome
 * email. The DB write is authoritative — audience/email failures never block the
 * user's sign-up (they are best-effort and swallowed).
 */
export async function POST(req: Request) {
  if (!rateLimit(`nl:${clientIp(req)}`)) {
    return NextResponse.json({error: 'rate'}, {status: 429});
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  // Honeypot: bots fill the hidden `website` field — pretend success, store nothing.
  if (raw && typeof raw === 'object' && (raw as {website?: string}).website) {
    return NextResponse.json({ok: true});
  }

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(raw);
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  const supabase = getSupabaseAdmin();
  const {error} = await supabase
    .from('newsletter_subscribers')
    .upsert({email: data.email, locale: data.locale ?? null}, {onConflict: 'email'});

  if (error) {
    return NextResponse.json({error: 'db'}, {status: 500});
  }

  // Best-effort: sync to Resend audience + send a welcome email. Never blocks.
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const locale = (data.locale ?? 'en') as 'en' | 'fr' | 'es';

      if (audienceId) {
        await resend.contacts.create({
          audienceId,
          email: data.email,
          unsubscribed: false
        });
      }

      const {subject, body} = WELCOME[locale];
      await resend.emails.send({
        from: FROM,
        to: data.email,
        subject,
        text: body
      });
    }
  } catch {
    // ignore audience / email failures — the subscriber is already saved
  }

  return NextResponse.json({ok: true});
}
