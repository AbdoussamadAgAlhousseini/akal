-- AKAL — contributions table (from the /contribuer form).
-- Run in Supabase → SQL Editor → New query → paste → Run.
create table if not exists public.contributions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  type       text not null,                 -- correction | fact_sheet | translation | organization | other
  message    text not null,
  status     text not null default 'new',   -- new | reviewed | done
  created_at timestamptz not null default now()
);

alter table public.contributions enable row level security;
