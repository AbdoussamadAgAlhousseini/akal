import {NextResponse} from 'next/server';
import {z} from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import {
  getAboutBlocks,
  getInstruments,
  getJurisprudence,
  getNews,
  getOpportunities,
  getOrganizations,
  getPastoralismBlocks,
  getPeoples,
  getResourcesBlocks
} from '@/lib/content';
import {localize} from '@/lib/localize';
import type {ContentBlock, Locale, People} from '@/lib/types';
import {clientIp, rateLimit} from '@/lib/rate-limit';

const schema = z.object({
  question: z.string().trim().min(3).max(500),
  locale: z.enum(['en', 'fr', 'es']).optional()
});

const LANG: Record<Locale, string> = {en: 'English', fr: 'French', es: 'Spanish'};

function peopleBlock(p: People, locale: Locale): string {
  const parts = [
    `### ${p.name} (${p.endonym}) — ${localize(p.countries, locale)}`,
    `Language: ${localize(p.language, locale)}. Population: ${p.population}. ${p.pastoral ? 'Pastoralist people.' : ''}`,
    `Summary: ${localize(p.summary, locale)}`
  ];
  const sec = p.sections?.[locale] ?? p.sections?.en;
  if (sec?.identity) parts.push(`Identity: ${sec.identity}`);
  if (sec?.livelihoods) parts.push(`Livelihoods: ${sec.livelihoods}`);
  if (sec?.rights) parts.push(`Rights: ${sec.rights}`);
  if (sec?.threats) parts.push(`Threats: ${sec.threats}`);
  if (p.sources.length) parts.push(`Sources: ${p.sources.join(' ; ')}`);
  return parts.join('\n');
}

const blocks = (arr: ContentBlock[], locale: Locale) =>
  arr.map((b) => `- ${localize(b.heading, locale)}: ${localize(b.body, locale)}`).join('\n');

/** Everything on the AKAL site, condensed for grounding (PUBLIC content only). */
async function buildContext(locale: Locale): Promise<string> {
  const [peoples, orgs, news, opps] = await Promise.all([
    getPeoples(),
    getOrganizations(),
    getNews(),
    getOpportunities()
  ]);
  const instruments = getInstruments();
  const jurisprudence = getJurisprudence();

  const sections: string[] = [];

  sections.push(
    `# ABOUT AKAL — the platform, its mission, ethics and how to use/contribute\nAKAL is a trilingual (EN/FR/ES) reference platform documenting Indigenous Peoples and pastoralism worldwide, built with and for the communities it represents. It offers people fact sheets, an interactive world map, a rights section, a directory of organizations, news and opportunities.\n${blocks(getAboutBlocks(), locale)}`
  );

  sections.push(`# PASTORALISM\n${blocks(getPastoralismBlocks(), locale)}`);
  sections.push(`# RESOURCES & METHODOLOGY\n${blocks(getResourcesBlocks(), locale)}`);

  sections.push(
    `# INDIGENOUS RIGHTS — international legal instruments\n${instruments
      .map((i) => `- ${localize(i.name, locale)} (${i.binding ? 'binding' : 'non-binding'}): ${localize(i.scope, locale)}`)
      .join('\n')}\n\n# INDIGENOUS RIGHTS — case law\n${jurisprudence
      .map((j) => `- ${j.title}: ${localize(j.body, locale)}`)
      .join('\n')}`
  );

  sections.push(
    `# PEOPLES — fact sheets\n${peoples.map((p) => peopleBlock(p, locale)).join('\n\n')}`
  );

  if (orgs.length) {
    sections.push(
      `# ORGANIZATIONS — Indigenous & pastoralist organizations listed on AKAL\n${orgs
        .map((o) => `- ${o.name} (${o.country}): ${localize(o.mission, locale)}${o.url ? ` — ${o.url}` : ''}`)
        .join('\n')}`
    );
  }

  if (news.length) {
    sections.push(
      `# NEWS — latest updates on AKAL\n${news
        .map((n) => `- ${localize(n.title, locale)} (${localize(n.source, locale)}): ${localize(n.body, locale)}`)
        .join('\n')}`
    );
  }

  if (opps.length) {
    sections.push(
      `# OPPORTUNITIES — open calls, funding and programmes\n${opps
        .map((o) => `- ${localize(o.title, locale)} — deadline: ${localize(o.deadline, locale)} — ${localize(o.body, locale)}${o.link ? ` — official link: ${o.link}` : ''}`)
        .join('\n')}`
    );
  }

  return sections.join('\n\n');
}

/**
 * AKAL assistant. Answers questions about the whole site — the platform itself,
 * peoples, organizations, rights, news and opportunities — strictly from the
 * site content. No outside knowledge, no speculation; refuses when not covered.
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
    "You are AKAL's assistant. AKAL is a trilingual reference platform documenting Indigenous Peoples and pastoralism worldwide.",
    'You help visitors understand the platform and its content: what AKAL is and how to use it, Indigenous and pastoralist peoples, their rights, the listed organizations, the news, and the open opportunities.',
    '',
    'STRICT RULES:',
    '- Answer ONLY using the AKAL site content provided below. Never use outside knowledge or assumptions.',
    `- If the answer is not clearly supported by this content, say (in ${lang}) that the site doesn't cover it yet, and point the reader to the most relevant section (Peoples, Map, Rights, Organizations, News, Opportunities, or About). Do NOT guess.`,
    '- Be respectful and accurate. Use a people\'s own name (endonym) where relevant. Never speculate about sacred, secret or sensitive matters.',
    `- Reply in ${lang}, in 2–4 sentences MAXIMUM — short, direct and precise. No preamble, no filler. Plain text only.`,
    '',
    'AKAL SITE CONTENT:',
    context
  ].join('\n');

  try {
    const client = new Anthropic({apiKey});
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 400,
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
