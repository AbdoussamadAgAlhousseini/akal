// Generate seed SQL from the /content JSON (run: node scripts/gen-seed-sql.mjs)
import {readFileSync} from 'node:fs';

const read = (f) =>
  JSON.parse(readFileSync(new URL(`../content/${f}`, import.meta.url), 'utf8'));
const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const j = (o) => q(JSON.stringify(o)) + '::jsonb';
const norm = (s) => (typeof s === 'string' ? {en: s, fr: s, es: s} : s);

const orgs = read('organizations.json');
const news = read('news.json');
const opps = read('opportunities.json');

let out = '';

out += 'delete from public.organizations;\n';
out +=
  'insert into public.organizations (name,category,country,mission,url,email,logo,status,sort) values\n';
out +=
  orgs
    .map(
      (o, i) =>
        `(${q(o.name)},${q(o.category)},${q(o.country)},${j(o.mission)},${
          o.url ? q(o.url) : 'null'
        },${o.email ? q(o.email) : 'null'},null,'approved',${i})`
    )
    .join(',\n') + ';\n\n';

out += 'delete from public.news;\n';
out +=
  'insert into public.news (day,month,source,title,body,published,sort) values\n';
out +=
  news
    .map(
      (n, i) =>
        `(${q(n.day)},${j(n.month)},${j(norm(n.source))},${j(n.title)},${j(
          n.body
        )},true,${i})`
    )
    .join(',\n') + ';\n\n';

out += 'delete from public.opportunities;\n';
out +=
  'insert into public.opportunities (title,body,deadline,published,sort) values\n';
out +=
  opps
    .map((o, i) => `(${j(o.title)},${j(o.body)},${j(o.deadline)},true,${i})`)
    .join(',\n') + ';\n';

process.stdout.write(out);
