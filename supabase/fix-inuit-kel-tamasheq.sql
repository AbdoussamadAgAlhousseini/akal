-- AKAL — fix: Inuit had the Maasai summary (all 3 languages) and both Inuit and
-- Kel Tamasheq had an empty `recognition`. Restores the original project values.
-- Run in Supabase → SQL Editor → New query → paste → Run. Safe to re-run.

update public.peoples
set summary = $${"en":"Circumpolar people of the Arctic; self-government achievements include Nunavut and Greenland's autonomy.","fr":"Peuple circumpolaire de l'Arctique ; parmi ses acquis d'autonomie : le Nunavut et l'autonomie du Groenland.","es":"Pueblo circumpolar del Ártico; entre sus logros de autogobierno: Nunavut y la autonomía de Groenlandia."}$$::jsonb,
    recognition = ARRAY['state','self']
where slug = 'inuit';

update public.peoples
set recognition = ARRAY['achpr','self']
where slug = 'kel-tamasheq';
