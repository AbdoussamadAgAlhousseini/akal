-- AKAL — 6 additional people fact sheets (batch 1).
-- Run in Supabase → SQL Editor → New query → paste → Run.
-- AI-drafted from public sources (IWGIA, Minority Rights Group, Cultural Survival) —
-- review/adjust in the admin, and validate with the communities where possible.
-- Short fact sheets (summary only); `sections` left null. Coordinates deliberately approximate.

insert into public.peoples
  (slug, name, endonym, region, pastoral, population, lat, lng, radius,
   recognition, countries, language, summary, visibility, sources, sort)
values
  ($$mapuche$$, $$Mapuche$$, $$Mapuche$$, $$americas$$, false, $$1,7 – 2 M$$, -38.7, -72.6, 400000,
   ARRAY['state','self'],
   $${"en":"Chile, Argentina","fr":"Chili, Argentine","es":"Chile, Argentina"}$$::jsonb,
   $${"en":"Mapudungun","fr":"Mapudungun","es":"Mapudungun"}$$::jsonb,
   $${"en":"The Mapuche are the largest Indigenous people of the Southern Cone, living in south-central Chile and Argentina. Farmers and warriors who resisted Spanish and then Chilean expansion for centuries, they continue to defend their lands, their language (Mapudungun) and their self-determination.","fr":"Les Mapuche sont le plus grand peuple autochtone du Cône Sud, vivant dans le centre-sud du Chili et en Argentine. Agriculteurs et guerriers qui ont résisté des siècles à l'expansion espagnole puis chilienne, ils continuent de défendre leurs terres, leur langue (le mapudungun) et leur autodétermination.","es":"Los Mapuche son el mayor pueblo indígena del Cono Sur, y viven en el centro-sur de Chile y Argentina. Agricultores y guerreros que resistieron durante siglos la expansión española y luego chilena, siguen defendiendo sus tierras, su lengua (el mapudungun) y su autodeterminación."}$$::jsonb,
   $$public$$,
   ARRAY[$$IWGIA — The Indigenous World$$, $$Minority Rights Group — World Directory$$],
   8),

  ($$aymara$$, $$Aymara$$, $$Aymara$$, $$americas$$, true, $$2 – 3 M$$, -16.5, -68.5, 350000,
   ARRAY['state','self'],
   $${"en":"Bolivia, Peru, Chile","fr":"Bolivie, Pérou, Chili","es":"Bolivia, Perú, Chile"}$$::jsonb,
   $${"en":"Aymara","fr":"Aymara","es":"Aymara"}$$::jsonb,
   $${"en":"The Aymara are an Andean people of the high plateau (Altiplano) around Lake Titicaca, herding llamas and alpacas at altitude and farming potatoes and quinoa. Their language is co-official in Bolivia and Peru, and Aymara identity is central to Bolivia's plurinational state.","fr":"Les Aymara sont un peuple andin des hauts plateaux (l'Altiplano) autour du lac Titicaca, élevant lamas et alpagas en altitude et cultivant pomme de terre et quinoa. Leur langue est co-officielle en Bolivie et au Pérou, et l'identité aymara est au cœur de l'État plurinational bolivien.","es":"Los Aymara son un pueblo andino del altiplano en torno al lago Titicaca, que pastorea llamas y alpacas en altura y cultiva papa y quinua. Su lengua es cooficial en Bolivia y Perú, y la identidad aymara es central en el Estado plurinacional de Bolivia."}$$::jsonb,
   $$public$$,
   ARRAY[$$IWGIA — The Indigenous World$$, $$Cultural Survival$$],
   9),

  ($$navajo$$, $$Navajo$$, $$Diné$$, $$americas$$, true, $$300 000 – 400 000$$, 36.1, -109.5, 260000,
   ARRAY['state','self'],
   $${"en":"United States","fr":"États-Unis","es":"Estados Unidos"}$$::jsonb,
   $${"en":"Diné bizaad (Navajo)","fr":"Diné bizaad (navajo)","es":"Diné bizaad (navajo)"}$$::jsonb,
   $${"en":"The Diné, known as Navajo, are the largest Native American nation in the United States, with a self-governing Navajo Nation across the Four Corners region. Sheep herding and weaving have been central to Diné life and economy since the 17th century.","fr":"Les Diné, appelés Navajos, forment la plus grande nation amérindienne des États-Unis, avec une Nation Navajo autonome dans la région des Four Corners. L'élevage de moutons et le tissage sont au cœur de la vie et de l'économie diné depuis le XVIIᵉ siècle.","es":"Los Diné, conocidos como Navajos, son la mayor nación nativa de los Estados Unidos, con una Nación Navajo autónoma en la región de los Four Corners. El pastoreo de ovejas y el tejido son centrales en la vida y la economía diné desde el siglo XVII."}$$::jsonb,
   $$public$$,
   ARRAY[$$Navajo Nation Government$$, $$Cultural Survival$$],
   10),

  ($$ainu$$, $$Ainu$$, $$Aynu$$, $$asia$$, false, $$13 000 – 200 000$$, 43.5, 143.0, 220000,
   ARRAY['state','self'],
   $${"en":"Japan","fr":"Japon","es":"Japón"}$$::jsonb,
   $${"en":"Ainu","fr":"Aïnou","es":"Ainu"}$$::jsonb,
   $${"en":"The Ainu are the Indigenous people of Hokkaido and the northern islands, traditionally fishers, hunters and gatherers with a rich oral and spiritual tradition. Japan officially recognised the Ainu as an Indigenous people in 2019, after long assimilation policies.","fr":"Les Aïnous sont le peuple autochtone de Hokkaidō et des îles du Nord, traditionnellement pêcheurs, chasseurs et cueilleurs, avec une riche tradition orale et spirituelle. Le Japon a officiellement reconnu les Aïnous comme peuple autochtone en 2019, après de longues politiques d'assimilation.","es":"Los Ainu son el pueblo indígena de Hokkaidō y las islas del norte, tradicionalmente pescadores, cazadores y recolectores, con una rica tradición oral y espiritual. Japón reconoció oficialmente a los Ainu como pueblo indígena en 2019, tras largas políticas de asimilación."}$$::jsonb,
   $$public$$,
   ARRAY[$$IWGIA — The Indigenous World$$, $$Minority Rights Group — World Directory$$],
   11),

  ($$nenets$$, $$Nenets$$, $$ненэй ненэче$$, $$arctic$$, true, $$40 000 – 50 000$$, 68.0, 72.0, 550000,
   ARRAY['state','self'],
   $${"en":"Russia","fr":"Russie","es":"Rusia"}$$::jsonb,
   $${"en":"Nenets","fr":"Nénètse","es":"Nenets"}$$::jsonb,
   $${"en":"The Nenets are reindeer-herding nomads of the Arctic tundra of northern Russia, migrating with their herds across the Yamal Peninsula and beyond. Their mobile way of life is increasingly pressured by gas and oil extraction and a warming climate.","fr":"Les Nénètses sont des nomades éleveurs de rennes de la toundra arctique du nord de la Russie, migrant avec leurs troupeaux à travers la péninsule de Yamal et au-delà. Leur mode de vie mobile est de plus en plus menacé par l'extraction gazière et pétrolière et le réchauffement climatique.","es":"Los Nenets son nómadas pastores de renos de la tundra ártica del norte de Rusia, que migran con sus rebaños por la península de Yamal y más allá. Su modo de vida móvil está cada vez más presionado por la extracción de gas y petróleo y el calentamiento del clima."}$$::jsonb,
   $$public$$,
   ARRAY[$$IWGIA — The Indigenous World$$, $$Arctic Council — permanent participants$$],
   12),

  ($$turkana$$, $$Turkana$$, $$Ngiturkana$$, $$africa$$, true, $$1 – 1,5 M$$, 3.5, 35.8, 260000,
   ARRAY['state','achpr','self'],
   $${"en":"Kenya, Ethiopia, South Sudan","fr":"Kenya, Éthiopie, Soudan du Sud","es":"Kenia, Etiopía, Sudán del Sur"}$$::jsonb,
   $${"en":"Ng'aturk(w)ana (Turkana)","fr":"Turkana","es":"Turkana"}$$::jsonb,
   $${"en":"The Turkana are nomadic pastoralists of Kenya's arid north-west, herding camels, cattle, goats and sheep around Lake Turkana. Resilient in one of Africa's harshest environments, they face drought, marginalisation and pressures from large-scale energy and water projects.","fr":"Les Turkana sont des pasteurs nomades du nord-ouest aride du Kenya, élevant chameaux, bovins, chèvres et moutons autour du lac Turkana. Résilients dans l'un des environnements les plus rudes d'Afrique, ils font face à la sécheresse, à la marginalisation et aux pressions de grands projets énergétiques et hydrauliques.","es":"Los Turkana son pastores nómadas del árido noroeste de Kenia, que crían camellos, vacas, cabras y ovejas en torno al lago Turkana. Resilientes en uno de los entornos más duros de África, enfrentan la sequía, la marginación y las presiones de grandes proyectos energéticos e hídricos."}$$::jsonb,
   $$public$$,
   ARRAY[$$IWGIA — The Indigenous World$$, $$Minority Rights Group — World Directory$$],
   13)

on conflict (slug) do nothing;
