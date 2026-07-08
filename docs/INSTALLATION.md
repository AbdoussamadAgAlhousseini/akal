# Checklist d'installation — Node.js + Claude Code

> À suivre une seule fois pour préparer ton poste. Compte 15–30 minutes.
> Si un point bloque, note le message d'erreur exact et demande-moi.

---

## Étape 1 — Installer Node.js (obligatoire)

Node.js fait tourner Next.js. Installe la version **LTS** (support long terme).

- Va sur **https://nodejs.org** et télécharge la version **LTS** pour ton système
  (Windows, macOS ou Linux).
- Installe-la en suivant l'assistant (options par défaut).
- Vérifie l'installation : ouvre un terminal et tape :
  ```
  node --version
  npm --version
  ```
  Tu dois voir deux numéros de version (ex. `v20.x.x` et `10.x.x`).

**Où est le terminal ?**
- Windows : cherche « PowerShell » ou « Terminal » dans le menu Démarrer.
- macOS : Applications → Utilitaires → Terminal.
- Linux : ton terminal habituel.

---

## Étape 2 — Installer Claude Code

Deux voies, choisis selon ton confort :

### Voie A — Application de bureau Claude (la plus simple, sans terminal)
- Télécharge l'app **Claude Desktop** depuis le site d'Anthropic.
- Claude Code y est intégré (onglet Code). Tu ouvres un dossier et tu travailles
  dans une interface graphique. Recommandé si le terminal t'intimide.

### Voie B — Claude Code en ligne de commande
- Dans le terminal, installe Claude Code (commande d'installation officielle fournie
  sur la doc d'Anthropic : https://docs.claude.com).
- Lance-le avec la commande `claude` depuis ton dossier de projet.

> Dans les deux cas, il te faudra te connecter à ton compte Anthropic.
> Pour les détails d'installation à jour, réfère-toi à https://docs.claude.com

---

## Étape 3 — Préparer le dossier du projet

1. Crée un dossier vide pour le projet, par exemple :
   - Windows : `Documents\akal`
   - macOS/Linux : `~/akal`
2. Place dedans les **trois fichiers** que je t'ai fournis :
   - `PROJET_AKAL.md`
   - `akal_prototype.html`
   - `prompt_demarrage.md` (pour t'y référer)
3. Ouvre ce dossier dans Claude Code (Voie A : « Ouvrir un dossier » ; Voie B :
   `cd ~/akal` puis `claude`).

---

## Étape 4 — Lancer le projet

- Ouvre `prompt_demarrage.md`, copie le message encadré, et colle-le dans Claude Code.
- Laisse-le lire les fichiers et te présenter son plan.
- Valide, puis avance étape par étape.

---

## Étape 5 — Voir le site pendant le développement

Quand Claude Code lance `npm run dev`, il te donnera une adresse locale
(généralement **http://localhost:3000**). Ouvre-la dans ton navigateur : tu verras
le site se construire en direct, et se rafraîchir à chaque modification.

---

## Étape 6 — Déployer en ligne (quand tu es prêt)

- Crée un compte gratuit sur **https://vercel.com** (connecté à un compte GitHub).
- Claude Code peut te guider pour publier le projet : il sera alors accessible via une
  vraie URL que tu pourras partager à Tin Hinan et à tes contacts.

---

## Aide-mémoire des commandes utiles (Voie B)

| Commande | Effet |
|---|---|
| `node --version` | Vérifier Node.js |
| `npm install` | Installer les dépendances du projet |
| `npm run dev` | Lancer le serveur de développement (localhost:3000) |
| `npm run build` | Construire la version de production |
| `cd nom-du-dossier` | Entrer dans un dossier |
| `claude` | Lancer Claude Code dans le dossier courant |

---

## Si tu préfères ne pas installer maintenant

Tu peux garder le prototype HTML tel quel comme démo (il s'ouvre dans n'importe quel
navigateur) et le montrer à tes partenaires. L'installation de Claude Code peut attendre
le moment où tu veux vraiment attaquer le backend. Le prototype seul suffit déjà pour
présenter le projet et récolter des soutiens.
