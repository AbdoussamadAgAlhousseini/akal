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

/** Who created AKAL — used when visitors ask about the founder or the assistant. */
const FOUNDER: Record<Locale, string> = {
  fr: "Abdoussamad Ag Alhousseini est un jeune informaticien et militant autochtone touareg, créateur d'AKAL — plateforme web trilingue (FR/EN/ES) dédiée aux peuples autochtones et au pastoralisme. Profondément engagé auprès des communautés nomades sahéliennes, il met le numérique au service de leurs droits, de leurs savoirs et de leur souveraineté sur leurs données.",
  en: 'Abdoussamad Ag Alhousseini is a young Tuareg computer scientist and Indigenous advocate, the creator of AKAL — a trilingual web platform (EN/FR/ES) dedicated to Indigenous Peoples and pastoralism. Deeply committed to the nomadic communities of the Sahel, he puts digital technology at the service of their rights, their knowledge and their sovereignty over their data.',
  es: 'Abdoussamad Ag Alhousseini es un joven informático y activista indígena tuareg, creador de AKAL — una plataforma web trilingüe (ES/FR/EN) dedicada a los pueblos indígenas y al pastoralismo. Profundamente comprometido con las comunidades nómadas del Sahel, pone la tecnología digital al servicio de sus derechos, sus saberes y su soberanía sobre sus datos.'
};

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

  sections.push(
    `# WHO CREATED AKAL — founder & coordinator\n${FOUNDER[locale]}\nAKAL and this assistant were created by him; he is AKAL's founder and coordinator. Use this whenever someone asks who created AKAL, who created this assistant, or who Abdoussamad Ag Alhousseini is.`
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
