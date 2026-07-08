# Prompt de démarrage — à copier-coller dans Claude Code

> Ouvre Claude Code dans un dossier vide (ex. `akal/`) où tu auras placé les deux fichiers
> `PROJET_AKAL.md` et `akal_prototype.html`. Puis colle le message ci-dessous.

---

## Message à coller dans Claude Code

```
Bonjour. Je démarre le projet AKAL, une plateforme web trilingue de référence sur
les peuples autochtones et le pastoralisme.

Dans ce dossier tu trouveras deux fichiers de référence :
- PROJET_AKAL.md : le cahier des charges technique complet. LIS-LE EN ENTIER d'abord.
- akal_prototype.html : un prototype HTML complet et fonctionnel qui sert de
  spécification visuelle vivante (design exact, 8 onglets, trilinguisme, données réelles).

Objectif de cette première session : reconstruire proprement le FRONTEND du prototype
en Next.js, sans backend pour l'instant (on l'ajoutera ensuite, étape 3 du cahier des charges).

Fais dans cet ordre, en t'arrêtant à chaque étape pour vérifier avec `npm run dev` :

1. Initialise un projet Next.js 14 (App Router) + TypeScript dans ce dossier.
2. Configure next-intl pour 3 langues : EN par défaut, FR, ES, avec routing localisé
   (/en, /fr, /es) et détection de la langue du navigateur au premier accès.
3. Reproduis FIDÈLEMENT l'identité visuelle du prototype (mêmes couleurs, même
   typographie, même mise en page). Les variables de couleur sont dans PROJET_AKAL.md §3.
4. Crée le layout commun : header avec logo tifinagh + navigation des 8 onglets + sélecteur
   de langue + bouton recherche ; footer avec réseaux sociaux et newsletter.
5. Migre TOUT le contenu du prototype (8 peuples, 13 organisations, actualités,
   opportunités, instruments juridiques, jurisprudences) vers des fichiers dans /content
   (JSON ou MDX). NE code AUCUN contenu en dur dans les composants.
6. Crée les 8 pages avec leur contenu, en respectant les routes localisées du §4.
7. Intègre la carte Leaflet via react-leaflet en composant client (ssr: false).
8. Implémente les filtres des organisations (catégorie + pays) et la recherche globale.

Contraintes importantes (détaillées dans PROJET_AKAL.md §7) :
- Respecte les principes de souveraineté des données autochtones : le champ `visibility`
  des fiches doit être filtré côté serveur ; jamais de fuite de contenu restreint.
- Endonymes affichés en premier, population toujours en fourchette, coordonnées
  volontairement approximatives.
- Le trilinguisme est structurel : pense i18n dès le départ.

Avant de commencer à coder, dis-moi ta compréhension du projet et le plan des fichiers
que tu vas créer, pour qu'on valide ensemble. Ne code pas encore.
```

---

## Conseils d'usage

- **Laisse Claude Code lire les deux fichiers d'abord.** Le premier message lui demande
  volontairement de te présenter son plan AVANT de coder — valide-le ou corrige-le.
- **Avance étape par étape.** Ne demande pas tout d'un coup. Après chaque étape, demande
  « lance le serveur et montre-moi le résultat » avant de passer à la suite.
- **En cas de bug**, laisse Claude Code lire l'erreur du terminal et corriger lui-même —
  c'est tout l'intérêt de l'outil par rapport au chat classique.
- **Quand le front est bon**, ouvre une nouvelle session (ou enchaîne) avec :
  « Le front est validé. Passe à l'étape 3 du cahier des charges : backend du formulaire
  d'adhésion et de la newsletter. » Il te demandera ton e-mail de réception et tes URLs
  de réseaux sociaux à ce moment-là.

## Ce que tu devras fournir plus tard (backend)
- Ton adresse e-mail de réception des demandes d'adhésion et inscriptions newsletter.
- Tes URLs de pages LinkedIn / WhatsApp / Facebook.
- Un choix d'hébergement de base de données (SQLite local pour tester, ou Supabase gratuit
  pour un vrai déploiement). Claude Code peut te conseiller selon ton besoin.
