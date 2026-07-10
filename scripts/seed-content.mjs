// One-off seed: load the current /content JSON into Supabase.
// Usage: node scripts/seed-content.mjs   (reads creds from .env.local)
import {readFileSync} from 'node:fs';
import {createClient} from '@supabase/supabase-js';

const env = {};
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {persistSession: false}
});

const read = (f) =>
  JSON.parse(readFileSync(new URL(`../content/${f}`, import.meta.url), 'utf8'));
const norm = (s) => (typeof s === 'string' ? {en: s, fr: s, es: s} : s);
const clearAll = (t) =>
  supabase.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000');

async function seed(table, rows) {
  await clearAll(table);
  const {error} = await supabase.from(table).insert(rows);
  console.log(`${table}: ${error ? 'ERROR ' + error.message : rows.length + ' rows'}`);
}

await seed(
  'organizations',
  read('organizations.json').map((o, i) => ({
    name: o.name,
    category: o.category,
    country: o.country,
    mission: o.mission,
    url: o.url ?? null,
    email: o.email ?? null,
    logo: o.logo ?? null,
    status: 'approved',
    sort: i
  }))
);

await seed(
  'news',
  read('news.json').map((n, i) => ({
    day: n.day,
    month: n.month,
    source: norm(n.source),
    title: n.title,
    body: n.body,
    published: true,
    sort: i
  }))
);

await seed(
  'opportunities',
  read('opportunities.json').map((o, i) => ({
    title: o.title,
    body: o.body,
    deadline: o.deadline,
    published: true,
    sort: i
  }))
);

console.log('done');
