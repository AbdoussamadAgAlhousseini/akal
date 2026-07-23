import {NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';
import {getSupabaseAdmin} from '@/lib/supabase';
import {clientIp, rateLimit} from '@/lib/rate-limit';

const schema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  type: z.enum([
    'correction',
    'fact_sheet',
    'translation',
    'organization',
    'other'
  ]),
  message: z.string().trim().min(2).max(4000)
});

/**
 * Contribution handler. Validates input, stores it (status `new`), then emails
 * a notification (best-effort). Honeypot + rate limit guard against spam.
 */
export async function POST(req: Request) {
  if (!rateLimit(`contrib:${clientIp(req)}`)) {
    return NextResponse.json({error: 'rate'}, {status: 429});
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  if (raw && typeof raw === 'object' && (raw as {website?: string}).website) {
    return NextResponse.json({ok: true});
  }

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(raw);
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  const {error} = await getSupabaseAdmin().from('contributions').insert({
    name: data.name,
    email: data.email,
    type: data.type,
    message: data.message,
    status: 'new'
  });

  if (error) {
    return NextResponse.json({error: 'db'}, {status: 500});
  }

  try {
    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFICATION_EMAIL;
    if (resendKey && to) {
      await new Resend(resendKey).emails.send({
        from: 'AKAL <notifications@akal-indigenous.org>',
        to,
        replyTo: data.email,
        subject: `Nouvelle contribution (${data.type}) — ${data.name}`,
        text: [
          `Nom : ${data.name}`,
          `E-mail : ${data.email}`,
          `Type : ${data.type}`,
          '',
          data.message
        ].join('\n')
      });
    }
  } catch {
    // ignore email failures
  }

  return NextResponse.json({ok: true});
}
