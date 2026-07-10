import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getSupabaseAdmin} from '@/lib/supabase';
import {clientIp, rateLimit} from '@/lib/rate-limit';

const schema = z.object({
  email: z.string().trim().email().max(200),
  locale: z.enum(['en', 'fr', 'es']).optional()
});

/**
 * Newsletter sign-up handler. Stores the subscriber (idempotent on email — a
 * repeated sign-up is treated as success, not an error). No email is sent to
 * subscribers yet (that needs a verified sending domain — later phase).
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

  return NextResponse.json({ok: true});
}
