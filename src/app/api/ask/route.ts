import {NextResponse} from 'next/server';
import {z} from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import {getPeoples} from '@/lib/content';
import {localize} from '@/lib/localize';
import type {Locale} from '@/lib/types';
import {clientIp, rateLimit} from '@/lib/rate-limit';

const schema = z.object({
  question: z.string().trim().min(3).max(500),
  locale: z.enum(['en', 'fr', 'es']).optional()
});

const LANG: Record<Locale, string> = {en: 'English', fr: 'French', es: 'Spanish'};

/** Compact, source-grounded fact sheet for every PUBLIC people (§7.1). */
async function buildContext(locale: Locale): Promise<string> {
  const peoples = await getPeoples();
  return peoples
    .map((p) => {
      const parts = [
        `## ${p.name} (${p.endonym}) — ${localize(p.countries, locale)}`,
        `Language: ${localize(p.language, locale)}. Population: ${p.population}.`,
        `Summary: ${localize(p.summary, locale)}`
      ];
      const sec = p.sections?.[locale] ?? p.sections?.en;
      if (sec?.identity) parts.push(`Identity & language: ${sec.identity}`);
      if (sec?.livelihoods) parts.push(`Livelihoods & economy: ${sec.livelihoods}`);
      if (sec?.rights) parts.push(`Recognition & rights: ${sec.rights}`);
      if (sec?.threats) parts.push(`Threats & resilience: ${sec.threats}`);
      if (p.sources.length) parts.push(`Sources: ${p.sources.join(' ; ')}`);
      return parts.join('\n');
    })
    .join('\n\n');
}

/**
 * AKAL cultural assistant. Answers questions about Indigenous peoples strictly
 * from the public fact sheets — no outside knowledge, no speculation. Grounded,
 * cited, and refuses when the answer isn't in the provided material.
 */
export async function POST(req: Request) {
  if (!rateLimit(`ask:${clientIp(req)}`, 8, 60_000)) {
    return NextResponse.json({error: 'rate'}, {status: 429});
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  // Honeypot: bots fill the hidden `website` field.
  if (raw && typeof raw === 'object' && (raw as {website?: string}).website) {
    return NextResponse.json({answer: ''});
  }

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(raw);
  } catch {
    return NextResponse.json({error: 'invalid'}, {status: 400});
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({error: 'unconfigured'}, {status: 503});
  }

  const locale = (data.locale ?? 'en') as Locale;
  const context = await buildContext(locale);
  const lang = LANG[locale];

  const system = [
    "You are AKAL's cultural assistant, answering questions from the public about Indigenous Peoples and pastoralism.",
    '',
    'STRICT RULES:',
    `- Answer ONLY using the fact sheets provided below. Never use outside knowledge or assumptions.`,
    `- If the answer is not clearly supported by the fact sheets, say (in ${lang}) that you don't have that information yet and invite the reader to browse the site. Do NOT guess.`,
    `- Name which people(s) your answer draws on.`,
    '- Be respectful and accurate. Use the endonym (the people\'s own name) where relevant. Never speculate about sacred, secret, or sensitive matters.',
    `- Reply in ${lang}, in 1–3 short paragraphs. Plain text only.`,
    '',
    'FACT SHEETS:',
    context
  ].join('\n');

  try {
    const client = new Anthropic({apiKey});
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system,
      messages: [{role: 'user', content: data.question}]
    });
    const answer = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return NextResponse.json({answer});
  } catch {
    return NextResponse.json({error: 'ai'}, {status: 502});
  }
}
