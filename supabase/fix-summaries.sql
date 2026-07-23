-- AKAL — fix 2: Fulɓe had the Maasai summary; Kel Tamasheq's short summary had
-- been replaced by its long "identity" section text. Restores the originals.
-- The long sections of Kel Tamasheq are NOT touched. Safe to re-run.

update public.peoples
set summary = $${"en":"One of the world's largest pastoral peoples; the Mbororo branch is recognized as indigenous by the ACHPR.","fr":"L'un des plus grands peuples pasteurs du monde ; la branche Mbororo est reconnue autochtone par la CADHP.","es":"Uno de los mayores pueblos pastores del mundo; la rama Mbororo es reconocida como indígena por la CADHP."}$$::jsonb
where slug = 'fulbe';

update public.peoples
set summary = $${"en":"Berber-speaking pastoralists of the central Sahara and Sahel, masters of dromedary husbandry and caravan trade, bearers of the Tifinagh script.","fr":"Pasteurs berbérophones du Sahara central et du Sahel, maîtres de l'élevage du dromadaire et du commerce caravanier, porteurs de l'écriture tifinagh.","es":"Pastores de habla bereber del Sahara central y el Sahel, maestros de la cría de dromedarios y del comercio caravanero, portadores de la escritura tifinagh."}$$::jsonb
where slug = 'kel-tamasheq';
