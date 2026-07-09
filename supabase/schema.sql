-- AKAL — backend schema (Phase 1)
-- Run this in Supabase → SQL Editor → New query → paste → Run.
-- Creates the two tables for the membership + newsletter forms.
-- Row Level Security is ON with NO public policies: the tables are private.
-- Our server-side API routes use the service_role key (which bypasses RLS),
-- so nothing is readable or writable from the browser. (Data sovereignty §7.)

-- 1) Membership requests — NEVER auto-published; reviewed by hand.
create table if not exists public.membership_requests (
  id          uuid primary key default gen_random_uuid(),
  organization text not null,
  email       text not null,
  country     text,
  category    text not null,                 -- gen | women | youth | pastoral
  message     text,
  status      text not null default 'pending', -- pending | reviewed | approved | rejected
  created_at  timestamptz not null default now()
);

-- 2) Newsletter subscribers.
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  locale      text,                          -- en | fr | es
  created_at  timestamptz not null default now()
);

-- Lock both tables down (server-only access).
alter table public.membership_requests   enable row level security;
alter table public.newsletter_subscribers enable row level security;
