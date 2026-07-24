-- AKAL — log of questions asked to the cultural AI assistant (admin insight only).
-- No IP, no personal data — just question, answer, language and time.
-- Run in Supabase → SQL Editor → New query → paste → Run.

create table if not exists public.assistant_logs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  locale     text,
  created_at timestamptz not null default now()
);

alter table public.assistant_logs enable row level security;
