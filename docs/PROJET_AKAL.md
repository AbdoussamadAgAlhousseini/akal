# PROJET AKAL — Cahier des charges technique

> Document de référence pour la reconstruction de la plateforme AKAL en Next.js.
> À lire en premier par Claude Code avant toute génération de code.
> Le fichier `akal_prototype.html` fourni est la **spécification visuelle vivante** : il montre l'apparence exacte, les 8 onglets, le trilinguisme et les données à reproduire.

---

## 1. Vision du projet

**AKAL** (« la terre » en tamasheq/tamazight) est la plateforme mondiale de référence sur les **peuples autochtones** et le **pastoralisme autochtone**. Sous-titre officiel, traduit selon la langue : *Indigenous Peoples of the World / Peuples autochtones du monde / Pueblos indígenas del mundo*.

Positionnement unique : la seule plateforme qui combine peuples autochtones **et** pastoralisme, construite avec les communautés, sous principes de souveraineté des données autochtones.

Public visé : chercheurs, journalistes, communautés autochtones, jeunes, bailleurs de fonds, organisations internationales.

---

## 2. Stack technique cible

- **Framework** : Next.js 14 (App Router)
- **Langue de dev** : TypeScript
- **Internationalisation** : `next-intl` — 3 langues, **EN par défaut**, FR, ES
- **Styles** : reproduire fidèlement le CSS du prototype (variables de couleur ci-dessous). Tailwind CSS acceptable si la fidélité visuelle est conservée, sinon CSS Modules.
- **Carte** : Leaflet via `react-leaflet` (chargement dynamique côté client, `ssr: false`)
- **Contenu** : fichiers Markdown/MDX ou JSON par entité (voir §6) — PAS de contenu codé en dur dans les composants
- **Base de données (phase backend)** : commencer simple — SQLite + Prisma, ou Supabase (PostgreSQL managé + gratuit) si hébergement cloud souhaité
- **Formulaires** : envoi réel via Resend (e-mail) ou enregistrement en base ; validation avec Zod
- **Déploiement** : Vercel (natif Next.js, gratuit pour ce volume)

---

## 3. Identité visuelle (à conserver à l'identique)

Variables de couleur (déjà dans le prototype) :
```
--indigo:      #1F2A5E   /* couleur institutionnelle — bleu du tagelmust */
--indigo-deep: #141C42
--sable:       #FAF7F1   /* fond */
--sable-2:     #F1EBDD
--laterite:    #B45E23   /* accent — terre du Sahel */
--laterite-soft:#E8D9C8
--or:          #E9C46A   /* doré — endonymes, accents */
--encre:       #1D1B17
--gris:        #6B675E
--ligne:       #DDD5C4
--ok:          #2F6B4F
```
Typographie : serif (Georgia) pour les titres et endonymes ; sans-serif système pour le corps.
Signature graphique : tifinagh (ⴰⴾⴰⵍ) dans le header, endonymes en doré sur chaque fiche.
**Règle éthique de design** : montrer des peuples contemporains, jamais folkloriser. Endonymes affichés en premier (Kel Tamasheq, pas « Touaregs »).

---

## 4. Architecture — 8 onglets

Routes localisées (next-intl génère `/en/...`, `/fr/...`, `/es/...`) :

| Onglet | Route EN | Route FR | Route ES | Contenu |
|---|---|---|---|---|
| Accueil | `/en` | `/fr` | `/es` | Hero, slider, peuple à la une, actus, partenaires, stats |
| Peuples | `/en/peoples` | `/fr/peuples` | `/es/pueblos` | Grille filtrable par région + fiches détaillées |
| Carte | `/en/map` | `/fr/carte` | `/es/mapa` | Carte Leaflet, cercles approximatifs |
| Pastoralisme | `/en/pastoralism` | `/fr/pastoralisme` | `/es/pastoreo` | Slider + 4 blocs thématiques |
| Droits | `/en/rights` | `/fr/droits` | `/es/derechos` | Tableau instruments + jurisprudences |
| Actualités | `/en/news` | `/fr/actualites` | `/es/noticias` | News + Agenda/Opportunités |
| Organisations | `/en/organizations` | `/fr/organisations` | `/es/organizaciones` | Annuaire filtrable + formulaire d'adhésion |
| Ressources | `/en/resources` | `/fr/ressources` | `/es/recursos` | Bibliothèque + glossaire (à venir) |
| À propos | `/en/about` | `/fr/a-propos` | `/es/acerca-de` | Éthique, gouvernance, contribuer, feuille de route |

Fiche peuple : `/{lang}/peoples/{slug}` — ex. `/fr/peuples/kel-tamasheq`. **URLs profondes partageables** (c'est ce qui manquait au prototype à cause du sandbox).

---

## 5. Fonctionnalités déjà spécifiées dans le prototype

- **Trilinguisme** : détection auto de la langue navigateur au premier accès, EN par défaut ; sélecteur EN/FR/ES mémorisé ; interface 100 % traduite ; fiches traduites progressivement avec fallback EN + bandeau « traduction à venir ».
- **Recherche globale** : bouton header + raccourci `/` ; indexe peuples, organisations, actus, opportunités.
- **Organisations** : filtre par **catégorie** (autochtones / femmes / jeunes / pastorales) ET par **pays** (double filtre croisé).
- **Formulaire d'adhésion** : nom, e-mail, pays, catégorie, message ; validation ; à connecter à un envoi réel côté backend.
- **Sliders** : 2 seulement (accueil + pastoralisme), illustrations SVG légères, glissement tactile, pause au survol, respect de `prefers-reduced-motion`.
- **Fiche imprimable** : bouton Imprimer/PDF, feuille de style print dédiée.
- **Newsletter** : formulaire footer, à connecter à un service (ex. Resend/Mailchimp).
- **Réseaux sociaux** : LinkedIn, WhatsApp, Facebook dans le footer (URLs à renseigner).
- **Carte** : cercles volontairement approximatifs (sécurité + souveraineté des données). Ocre = peuples pasteurs, indigo = autres.

---

## 6. Schéma de données

### Entité `People` (fiche peuple)
```ts
type People = {
  slug: string;                 // "kel-tamasheq"
  name: string;                 // endonyme d'usage courant
  endonym: string;              // en écriture native (tifinagh, etc.)
  region: "africa"|"americas"|"arctic"|"asia";
  pastoral: boolean;
  population: string;           // fourchette, ex. "2,5 – 4 M" (jamais un chiffre unique)
  coords: [number, number];     // approximatifs — voir règle éthique
  radius: number;               // rayon du cercle carte (flou volontaire)
  recognition: ("state"|"achpr"|"self")[];  // statuts multiples possibles
  // Contenu trilingue :
  countries: { en:string; fr:string; es:string };
  language:  { en:string; fr:string; es:string };
  summary:   { en:string; fr:string; es:string };  // description courte (carte)
  // Sections longues de la fiche (peuvent manquer dans certaines langues -> fallback EN) :
  sections?: {
    [lang: string]: {
      identity: string;    // identité & langue
      livelihoods: string; // mode de vie & économie pastorale
      rights: string;      // reconnaissance & droits
      threats: string;     // menaces & résilience
    }
  };
  visibility: "public"|"restricted"|"community"|"unpublished"; // niveau CARE
  consentStatus?: string;   // statut du consentement communautaire (CLPE/FPIC)
  sources: string[];        // références
};
```

### Entité `Organization`
```ts
type Organization = {
  name: string;
  category: "gen"|"women"|"youth"|"pastoral";
  country: string;          // code : "bf","td","ne","int",...
  mission: { en:string; fr:string; es:string };
  url?: string;
  logo?: string;
};
```

### Entités `NewsItem`, `Opportunity`, `Instrument`, `Jurisprudence`
Voir leur structure exacte dans le prototype (objets `NEWS`, `OPPS`, `INSTRUMENTS`, `JURIS`). Migrer ces données vers `/content/*.json` ou `/content/*.mdx`.

### Entité `MembershipRequest` (nouveau — backend)
```ts
type MembershipRequest = {
  id: string;
  organization: string;
  email: string;
  country?: string;
  category: "gen"|"women"|"youth"|"pastoral";
  message?: string;
  status: "pending"|"reviewed"|"approved"|"rejected";
  createdAt: Date;
};
```
Une demande d'adhésion n'est JAMAIS publiée automatiquement : elle entre en `pending` et attend une validation humaine.

---

## 7. Principes éthiques à respecter DANS LE CODE

Ce ne sont pas des options — ce sont des exigences de crédibilité de la plateforme.

1. **Souveraineté des données (CARE + CLPE/FPIC)** : le champ `visibility` doit être respecté partout. Un contenu `restricted`/`community`/`unpublished` ne doit jamais fuiter côté client (pas dans le HTML, pas dans le JSON exposé, pas dans l'API). Filtrer côté serveur.
2. **Sites sacrés & sécurité** : coordonnées volontairement approximatives ; aucune géolocalisation précise de communauté vulnérable.
3. **Auto-identification** : le champ `recognition` accepte des statuts nuancés et multiples, jamais un booléen « autochtone oui/non ».
4. **Population en fourchette** : jamais un chiffre unique, toujours une plage avec sources multiples.
5. **Endonymes d'abord** : afficher le nom natif avant l'exonyme.
6. **Modération humaine** : formulaires (adhésion, contributions) → file d'attente `pending`, jamais de publication automatique.
7. **TK Labels** : prévoir l'affichage d'étiquettes de savoirs traditionnels sur les fiches et ressources.

---

## 8. Feuille de route backend (ordre recommandé)

**Étape 1 — Fondation front (reproduire le prototype en Next.js)**
- Projet Next.js 14 + TypeScript + next-intl configuré (EN/FR/ES)
- Structure de dossiers, layout, header/nav/footer trilingues
- Les 8 pages avec le design du prototype
- Données migrées en `/content` (JSON ou MDX)
- Carte Leaflet en composant client
- Déploiement Vercel de test

**Étape 2 — Interactivité réelle**
- Recherche globale (côté client sur les données statiques, ou API route)
- Filtres organisations (catégorie + pays)
- Fiches dynamiques `/[lang]/peoples/[slug]` avec fallback de traduction

**Étape 3 — Backend & données**
- Base de données (SQLite+Prisma en local, ou Supabase)
- API route pour le **formulaire d'adhésion** → enregistrement en base (statut `pending`) + notification e-mail (Resend)
- API route pour la **newsletter** → enregistrement / service e-mail
- Respect du champ `visibility` : filtrage serveur

**Étape 4 — Administration (plus tard)**
- Interface minimale de modération : valider/rejeter les demandes d'adhésion et contributions
- Éventuellement un CMS léger (Sanity, ou simple édition des fichiers `/content`)

**Étape 5 — Qualité & lancement**
- SEO : balises hreflang par langue, sitemap, Open Graph, Schema.org
- Accessibilité (WCAG AA), performance (Lighthouse)
- Tests, puis domaine définitif

---

## 9. Contenu déjà prêt dans le prototype

À migrer tel quel (déjà rédigé en 3 langues sauf mention) :
- **8 peuples** : Kel Tamasheq (fiche complète FR+EN), Fulɓe, Amazigh, Maasai, San, Sámi, Quechua, Inuit
- **13 organisations** réparties dans les 4 catégories
- **3 actualités** + **4 opportunités** (New Commons, UNGIYF, Formation Patrimoine mondial, Pawanka)
- **5 instruments** juridiques + **2 jurisprudences** (Endorois, Ogiek)
- Blocs Pastoralisme, Ressources, À propos

---

## 10. Notes finales pour Claude Code

- Priorité absolue : **fidélité visuelle** au prototype et **robustesse** (le prototype précédent avait souffert de correctifs empilés — repartir propre, tester à chaque étape).
- Le trilinguisme est structurel, pas cosmétique : penser i18n dès la première ligne.
- Ne pas coder le contenu en dur : tout dans `/content`, éditable sans toucher aux composants.
- Avancer par étapes (§8), lancer `npm run dev` et vérifier après chaque étape.
- Demander à l'utilisateur (Abdou) ses URLs de réseaux sociaux et son adresse e-mail de réception des formulaires au moment de brancher le backend.
