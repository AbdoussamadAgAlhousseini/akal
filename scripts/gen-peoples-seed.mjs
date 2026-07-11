// Generate peoples seed SQL from content/peoples.json.
import {readFileSync} from 'node:fs';

const peoples = JSON.parse(
  readFileSync(new URL('../content/peoples.json', import.meta.url), 'utf8')
);

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const j = (o) => q(JSON.stringify(o)) + '::jsonb';
const arr = (a) =>
  a && a.length ? 'ARRAY[' + a.map(q).join(',') + ']::text[]' : "'{}'::text[]";

const cols =
  'slug,name,endonym,region,pastoral,population,lat,lng,radius,recognition,countries,language,summary,sections,visibility,consent_status,sources,featured,sort';

const rows = peoples
  .map((p, i) =>
    `(${q(p.slug)},${q(p.name)},${q(p.endonym)},${q(p.region)},${p.pastoral === true},${q(
      p.population
    )},${p.coords[0]},${p.coords[1]},${p.radius},${arr(p.recognition)},${j(
      p.countries
    )},${j(p.language)},${j(p.summary)},${p.sections ? j(p.sections) : 'null'},${q(
      p.visibility || 'public'
    )},${p.consentStatus ? q(p.consentStatus) : 'null'},${arr(p.sources)},${
      p.slug === 'kel-tamasheq'
    },${i})`
  )
  .join(',\n');

process.stdout.write(
  `delete from public.peoples;\ninsert into public.peoples (${cols}) values\n${rows};\n`
);
