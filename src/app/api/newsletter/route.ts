import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getSupabaseAdmin} from '@/lib/supabase';

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
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
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
