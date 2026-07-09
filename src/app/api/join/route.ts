import {NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';
import {getSupabaseAdmin} from '@/lib/supabase';

const schema = z.object({
  organization: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(100).optional(),
  category: z.enum(['gen', 'women', 'youth', 'pastoral']),
  message: z.string().trim().max(2000).optional()
});

/**
 * Membership request handler. Validates input, stores it as `pending` (never
 * auto-published — §7.6), then emails a notification (best-effort). Any DB
 * error fails the request; an email error does not.
 */
export async function POST(req: Request) {
  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await req.json());
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  const supabase = getSupabaseAdmin();
  const {error} = await supabase.from('membership_requests').insert({
    organization: data.organization,
    email: data.email,
    country: data.country || null,
    category: data.category,
    message: data.message || null,
    status: 'pending'
  });

  if (error) {
    return NextResponse.json({error: 'db'}, {status: 500});
  }

  // Notify the platform inbox — never blocks the user's submission.
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFICATION_EMAIL;
    if (resendKey && to) {
      await new Resend(resendKey).emails.send({
        from: 'AKAL <onboarding@resend.dev>',
        to,
        replyTo: data.email,
        subject: `Nouvelle demande d'adhésion — ${data.organization}`,
        text: [
          `Organisation : ${data.organization}`,
          `E-mail : ${data.email}`,
          `Pays : ${data.country || '—'}`,
          `Catégorie : ${data.category}`,
          `Message : ${data.message || '—'}`,
          '',
          'Statut : en attente. À valider dans le tableau de bord Supabase.'
        ].join('\n')
      });
    }
  } catch {
    // ignore email failures
  }

  return NextResponse.json({ok: true});
}
