-- AKAL — Phase 2 content tables (organizations, news, opportunities).
-- Run in Supabase → SQL Editor → New query → paste → Run.
-- Localized fields use jsonb ({"en":..., "fr":..., "es":...}). RLS is ON; only
-- the server (service/secret key) reads/writes — nothing from the browser.

-- Directory of organizations (public site shows status = 'approved').
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text not null,                    -- gen | women | youth | pastoral
  country    text not null,                    -- taxonomy country code
  mission    jsonb not null,                   -- {en,fr,es}
  url        text,
  email      text,
  logo       text,
  status     text not null default 'pending',  -- pending | approved | rejected
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);

-- Curated news (public site shows published = true).
create table if not exists public.news (
  id         uuid primary key default gen_random_uuid(),
  day        text  not null,
  month      jsonb not null,                   -- {en,fr,es}
  source     jsonb not null,                   -- {en,fr,es}
  title      jsonb not null,
  body       jsonb not null,
  published  boolean not null default true,
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);

-- Agenda / opportunities (public site shows published = true).
create table if not exists public.opportunities (
  id         uuid primary key default gen_random_uuid(),
  title      jsonb not null,
  body       jsonb not null,
  deadline   jsonb not null,
  published  boolean not null default true,
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.news          enable row level security;
alter table public.opportunities enable row level security;
