'use server';

import {revalidatePath, revalidateTag} from 'next/cache';
import {redirect} from 'next/navigation';
import {getSupabaseAdmin} from '@/lib/supabase';
import {
  checkPassword,
  clearSession,
  isAuthed,
  setSession
} from '@/lib/admin-auth';
import initialPeoples from '../../../content/peoples.json';

type SeedPerson = {
  slug: string;
  name: string;
  endonym: string;
  region: string;
  pastoral?: boolean;
  population: string;
  coords: [number, number];
  radius: number;
  recognition: string[];
  countries: unknown;
  language: unknown;
  summary: unknown;
  sections?: unknown;
  visibility?: string;
  consentStatus?: string;
  sources: string[];
};

function guard() {
  if (!isAuthed()) throw new Error('Unauthorized');
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function loc(fd: FormData, base: string) {
  return {en: str(fd, `${base}_en`), fr: str(fd, `${base}_fr`), es: str(fd, `${base}_es`)};
}

function num(fd: FormData, key: string): number {
  const n = parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : 0;
}

/** Refresh the admin section AND the public site (content cache tag). */
function refresh() {
  revalidateTag('content');
  revalidatePath('/admin', 'layout');
}

// ---- Auth ----
export async function login(fd: FormData) {
  if (checkPassword(str(fd, 'password'))) {
    setSession();
    redirect('/admin');
  }
  redirect('/admin/login?error=1');
}

export async function logout() {
  clearSession();
  redirect('/admin/login');
}

// ---- Organizations ----
export async function saveOrg(fd: FormData) {
  guard();
  const id = str(fd, 'id');
  const row = {
    name: str(fd, 'name'),
    category: str(fd, 'category'),
    country: str(fd, 'country'),
    mission: loc(fd, 'mission'),
    url: str(fd, 'url') || null,
    email: str(fd, 'email') || null,
    status: str(fd, 'status') || 'pending',
    sort: num(fd, 'sort')
  };
  const db = getSupabaseAdmin();
  if (id) await db.from('organizations').update(row).eq('id', id);
  else await db.from('organizations').insert(row);
  refresh();
  redirect('/admin/organizations');
}

export async function setOrgStatus(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('organizations')
    .update({status: str(fd, 'status')})
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/organizations');
}

export async function deleteOrg(fd: FormData) {
  guard();
  await getSupabaseAdmin().from('organizations').delete().eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/organizations');
}

// ---- News ----
export async function saveNews(fd: FormData) {
  guard();
  const id = str(fd, 'id');
  const row = {
    day: str(fd, 'day'),
    month: loc(fd, 'month'),
    source: loc(fd, 'source'),
    title: loc(fd, 'title'),
    body: loc(fd, 'body'),
    published: str(fd, 'published') === 'on',
    sort: num(fd, 'sort')
  };
  const db = getSupabaseAdmin();
  if (id) await db.from('news').update(row).eq('id', id);
  else await db.from('news').insert(row);
  refresh();
  redirect('/admin/news');
}

export async function deleteNews(fd: FormData) {
  guard();
  await getSupabaseAdmin().from('news').delete().eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/news');
}

// ---- Opportunities ----
export async function saveOpp(fd: FormData) {
  guard();
  const id = str(fd, 'id');
  const row = {
    title: loc(fd, 'title'),
    body: loc(fd, 'body'),
    deadline: loc(fd, 'deadline'),
    published: str(fd, 'published') === 'on',
    sort: num(fd, 'sort')
  };
  const db = getSupabaseAdmin();
  if (id) await db.from('opportunities').update(row).eq('id', id);
  else await db.from('opportunities').insert(row);
  refresh();
  redirect('/admin/opportunities');
}

export async function deleteOpp(fd: FormData) {
  guard();
  await getSupabaseAdmin().from('opportunities').delete().eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/opportunities');
}

// ---- Membership requests ----
export async function setRequestStatus(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('membership_requests')
    .update({status: str(fd, 'status')})
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/requests');
}

export async function deleteRequest(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('membership_requests')
    .delete()
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/requests');
}

// ---- Contributions ----
export async function setContributionStatus(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('contributions')
    .update({status: str(fd, 'status')})
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/contributions');
}

export async function deleteContribution(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('contributions')
    .delete()
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/contributions');
}

// ---- Peoples (fact sheets) ----
const LANGS = ['fr', 'en', 'es'] as const;
const SECTION_KEYS = ['identity', 'livelihoods', 'rights', 'threats'] as const;

export async function savePeople(fd: FormData) {
  guard();
  const id = str(fd, 'id');

  // Long sections: include a language only if at least one of its 4 parts is set.
  const sections: Record<string, Record<string, string>> = {};
  for (const l of LANGS) {
    const parts = SECTION_KEYS.map((k) => str(fd, `sec_${k}_${l}`));
    if (parts.some((v) => v.length > 0)) {
      sections[l] = {
        identity: parts[0],
        livelihoods: parts[1],
        rights: parts[2],
        threats: parts[3]
      };
    }
  }

  const recognition = ['state', 'achpr', 'self'].filter(
    (r) => str(fd, `rec_${r}`) === 'on'
  );
  const sources = str(fd, 'sources')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const featured = str(fd, 'featured') === 'on';

  const row = {
    slug: str(fd, 'slug'),
    name: str(fd, 'name'),
    endonym: str(fd, 'endonym'),
    region: str(fd, 'region'),
    pastoral: str(fd, 'pastoral') === 'on',
    population: str(fd, 'population'),
    lat: Number(str(fd, 'lat')) || 0,
    lng: Number(str(fd, 'lng')) || 0,
    radius: num(fd, 'radius') || 300000,
    recognition,
    countries: loc(fd, 'countries'),
    language: loc(fd, 'language'),
    summary: loc(fd, 'summary'),
    sections: Object.keys(sections).length ? sections : null,
    visibility: str(fd, 'visibility') || 'public',
    consent_status: str(fd, 'consent_status') || null,
    sources,
    featured,
    sort: num(fd, 'sort')
  };

  const db = getSupabaseAdmin();
  // Only one people can be featured at a time.
  if (featured) {
    await db
      .from('peoples')
      .update({featured: false})
      .neq('id', id || '00000000-0000-0000-0000-000000000000');
  }
  if (id) await db.from('peoples').update(row).eq('id', id);
  else await db.from('peoples').insert(row);
  refresh();
  redirect('/admin/peoples');
}

export async function deletePeople(fd: FormData) {
  guard();
  await getSupabaseAdmin().from('peoples').delete().eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/peoples');
}

/** One-time import of the bundled starter fact sheets (only if the table is empty). */
export async function seedInitialPeoples() {
  guard();
  const db = getSupabaseAdmin();
  const {count} = await db
    .from('peoples')
    .select('id', {count: 'exact', head: true});
  if (!count) {
    const rows = (initialPeoples as unknown as SeedPerson[]).map((p, i) => ({
      slug: p.slug,
      name: p.name,
      endonym: p.endonym,
      region: p.region,
      pastoral: p.pastoral === true,
      population: p.population,
      lat: p.coords[0],
      lng: p.coords[1],
      radius: p.radius,
      recognition: p.recognition,
      countries: p.countries,
      language: p.language,
      summary: p.summary,
      sections: p.sections ?? null,
      visibility: p.visibility ?? 'public',
      consent_status: p.consentStatus ?? null,
      sources: p.sources,
      featured: p.slug === 'kel-tamasheq',
      sort: i
    }));
    await db.from('peoples').insert(rows);
  }
  refresh();
  redirect('/admin/peoples');
}

// ---- Subscribers ----
export async function deleteSubscriber(fd: FormData) {
  guard();
  await getSupabaseAdmin()
    .from('newsletter_subscribers')
    .delete()
    .eq('id', str(fd, 'id'));
  refresh();
  redirect('/admin/subscribers');
}
