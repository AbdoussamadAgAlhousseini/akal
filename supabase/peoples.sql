-- AKAL — peoples table (fact sheets). Run in Supabase → SQL Editor.
-- Localized fields are jsonb {en,fr,es}. `sections` is nullable jsonb
-- {fr:{identity,livelihoods,rights,threats}, en:{...}, …}. RLS on (server-only).
create table if not exists public.peoples (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,                 -- common endonym (shown first)
  endonym        text not null,                 -- native script
  region         text not null,                 -- africa|americas|arctic|asia
  pastoral       boolean not null default false,
  population     text not null,                 -- always a range
  lat            double precision not null,     -- deliberately approximate
  lng            double precision not null,
  radius         integer not null default 300000,
  recognition    text[]  not null default '{}', -- {state,achpr,self}
  countries      jsonb   not null,
  language       jsonb   not null,
  summary        jsonb   not null,
  sections       jsonb,                          -- null = short fact sheet
  visibility     text    not null default 'public', -- public|restricted|community|unpublished
  consent_status text,
  sources        text[]  not null default '{}',
  featured       boolean not null default false,
  sort           integer not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.peoples enable row level security;
