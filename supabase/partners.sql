-- AKAL — Partners table + opportunities.link column.
-- Run in Supabase → SQL Editor → New query → paste → Run.
-- RLS is ON; only the server (service/secret key) reads/writes — nothing from the browser.

-- Partners whose logos scroll on the home page (public site shows published = true).
create table if not exists public.partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  url        text,                              -- official website (optional)
  logo       text,                              -- logo image URL (optional)
  published  boolean not null default true,
  sort       int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;

-- Add the "official announcement" link to opportunities (safe to re-run).
alter table public.opportunities
  add column if not exists link text;
