-- AKAL — 9 Indigenous & pastoralist organizations for the directory.
-- Run in Supabase → SQL Editor → New query → paste → Run.
-- Idempotent (skips a row if an org with the same name already exists).
-- status = 'approved' so they appear on the public /organisations page.
-- AI-drafted from public sources — review/adjust in the admin.

insert into public.organizations (name, category, country, mission, url, status, sort)
select v.name, v.category, v.country, v.mission::jsonb, v.url, 'approved', v.sort
from (values
  ($$IWGIA — International Work Group for Indigenous Affairs$$, $$gen$$, $$dk$$,
   $${"en":"A global human-rights organisation that documents and defends the rights of Indigenous Peoples worldwide, best known for its annual report The Indigenous World.","fr":"Organisation mondiale de défense des droits humains qui documente et défend les droits des peuples autochtones dans le monde, connue pour son rapport annuel The Indigenous World.","es":"Organización mundial de derechos humanos que documenta y defiende los derechos de los pueblos indígenas en el mundo, conocida por su informe anual The Indigenous World."}$$,
   $$https://www.iwgia.org$$, 0),

  ($$Cultural Survival$$, $$gen$$, $$us$$,
   $${"en":"A US-based organisation advancing Indigenous Peoples' rights and cultures, with a focus on community media, self-determination and free, prior and informed consent.","fr":"Organisation basée aux États-Unis qui défend les droits et les cultures des peuples autochtones, avec un accent sur les médias communautaires, l'autodétermination et le consentement libre, préalable et éclairé.","es":"Organización con sede en EE. UU. que promueve los derechos y las culturas de los pueblos indígenas, con énfasis en los medios comunitarios, la autodeterminación y el consentimiento libre, previo e informado."}$$,
   $$https://www.culturalsurvival.org$$, 1),

  ($$IPACC — Indigenous Peoples of Africa Co-ordinating Committee$$, $$gen$$, $$za$$,
   $${"en":"A network of Indigenous peoples' organisations across Africa, advocating for the recognition, land rights and self-determination of the continent's Indigenous communities.","fr":"Réseau d'organisations de peuples autochtones à travers l'Afrique, œuvrant pour la reconnaissance, les droits fonciers et l'autodétermination des communautés autochtones du continent.","es":"Red de organizaciones de pueblos indígenas de toda África que aboga por el reconocimiento, los derechos territoriales y la autodeterminación de las comunidades indígenas del continente."}$$,
   $$https://www.ipacc.org.za$$, 2),

  ($$Asia Indigenous Peoples Pact (AIPP)$$, $$gen$$, $$th$$,
   $${"en":"A regional organisation of Indigenous peoples' movements in Asia, promoting their rights, cultures and the sustainable management of their lands and resources.","fr":"Organisation régionale des mouvements de peuples autochtones d'Asie, promouvant leurs droits, leurs cultures et la gestion durable de leurs terres et ressources.","es":"Organización regional de los movimientos de pueblos indígenas de Asia, que promueve sus derechos, culturas y la gestión sostenible de sus tierras y recursos."}$$,
   $$https://www.aippnet.org$$, 3),

  ($$COICA — Coordinadora de las Organizaciones Indígenas de la Cuenca Amazónica$$, $$gen$$, $$ec$$,
   $${"en":"The umbrella organisation of Indigenous peoples of the Amazon, uniting national federations across nine countries to defend the rainforest and Indigenous rights.","fr":"Organisation faîtière des peuples autochtones d'Amazonie, réunissant les fédérations nationales de neuf pays pour défendre la forêt et les droits autochtones.","es":"Organización que agrupa a los pueblos indígenas de la Amazonía, uniendo a las federaciones nacionales de nueve países para defender la selva y los derechos indígenas."}$$,
   null, 4),

  ($$Réseau Billital Maroobé (RBM)$$, $$pastoral$$, $$ne$$,
   $${"en":"A West African network of pastoralist and livestock-farmer organisations defending the rights, mobility and livelihoods of Sahelian herders.","fr":"Réseau ouest-africain d'organisations d'éleveurs et de pasteurs, défendant les droits, la mobilité et les moyens d'existence des pasteurs sahéliens.","es":"Red de África Occidental de organizaciones de pastores y ganaderos que defiende los derechos, la movilidad y los medios de vida de los pastores del Sahel."}$$,
   $$https://maroobe.com$$, 5),

  ($$Saami Council$$, $$pastoral$$, $$no$$,
   $${"en":"A voluntary organisation of Sámi associations across Norway, Sweden, Finland and Russia, promoting Sámi rights, culture and reindeer-herding livelihoods.","fr":"Organisation regroupant des associations sámi de Norvège, Suède, Finlande et Russie, promouvant les droits, la culture et l'élevage de rennes des Sámi.","es":"Organización que reúne a asociaciones sámi de Noruega, Suecia, Finlandia y Rusia, y promueve los derechos, la cultura y el pastoreo de renos de los sámi."}$$,
   $$https://www.saamicouncil.net$$, 6),

  ($$AFPAT — Association des Femmes Peules Autochtones du Tchad$$, $$women$$, $$td$$,
   $${"en":"A Chadian organisation of Indigenous Fulani (Peul) women working on climate adaptation, women's rights and traditional pastoralist knowledge.","fr":"Association tchadienne de femmes peules autochtones œuvrant sur l'adaptation climatique, les droits des femmes et les savoirs pastoraux traditionnels.","es":"Organización chadiana de mujeres indígenas fulani (peul) que trabaja en la adaptación al clima, los derechos de las mujeres y los saberes pastoriles tradicionales."}$$,
   null, 7),

  ($$Global Indigenous Youth Caucus (GIYC)$$, $$youth$$, $$int$$,
   $${"en":"The global platform for Indigenous youth to organise and advocate within the UN and international processes on the rights of Indigenous Peoples.","fr":"Plateforme mondiale de la jeunesse autochtone pour s'organiser et plaider au sein de l'ONU et des processus internationaux sur les droits des peuples autochtones.","es":"Plataforma mundial de la juventud indígena para organizarse e incidir en la ONU y los procesos internacionales sobre los derechos de los pueblos indígenas."}$$,
   null, 8)
) as v(name, category, country, mission, url, sort)
where not exists (select 1 from public.organizations o where o.name = v.name);
