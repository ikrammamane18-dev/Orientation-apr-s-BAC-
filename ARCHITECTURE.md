# Architecture — Plateforme d'orientation post-BAC (Bénin)

## 1. Stack technique

| Couche | Choix | Raison |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | SSR/SEO pour l'acquisition organique, rendu rapide sur mobile, routing par fichiers |
| État / logique | React Server Components + Client Components ciblés (`'use client'`) | On garde la logique lourde (calcul de score, requêtes DB) côté serveur, on n'hydrate que ce qui est interactif (formulaire, modal) |
| Backend / DB | Supabase (Postgres + Auth + Row Level Security) | Hébergé, RLS natif, SDK JS simple, suffisant pour ce volume |
| Paiement | FedaPay (ou KKiaPay) — MTN MoMo, Moov Money, Wave | Seuls agrégateurs Mobile Money fiables et légaux au Bénin pour un site marchand |
| PDF | `@react-pdf/renderer` (génération serveur) | Génère le rapport complet à la volée après paiement validé |
| Déploiement | Vercel (frontend + API routes) + Supabase (managed) | Aucune infra à gérer, scalable pour un pic de trafic (résultats du BAC) |

## 2. Arborescence

```
/app
  /page.jsx                       → Landing page (hero, réassurance, CTA "Faire le test")
  /test/page.jsx                  → Étape 1 : <BacOrientationForm />
  /resultats/[sessionId]/page.jsx → Étape 2 : teaser + paywall (<PaywallTeaser />)
  /rapport/[sessionId]/page.jsx   → Étape 4 : rapport complet (accès contrôlé par transaction validée)
  /admin/page.jsx                 → Dashboard admin (protégé par cookie de session, cf. §5)
  /api
    /score/route.js               → POST : calcule le score à partir des notes (scoringEngine)
    /payment/initiate/route.js    → POST : crée une transaction FedaPay/KKiaPay, renvoie l'URL de paiement
    /payment/webhook/route.js     → POST : reçoit la confirmation du PSP, vérifie la signature, débloque le rapport
    /admin/auth/route.js          → POST : vérifie le mot de passe admin (hash), pose un cookie de session signé
    /contact-prive/route.js       → POST : enregistre une demande d'accompagnement privé

/components
  BacOrientationForm.jsx          → Formulaire dynamique de saisie des notes (+ zone Easter Egg)
  AdminAccessModal.jsx            → Modal de connexion admin déclenché par les 5 clics
  PrivateOrientationCard.jsx      → Encadré VIP orientation privé (WhatsApp / Appel / Email)
  PaywallTeaser.jsx               → Aperçu partiel + CTA de déblocage (325 FCFA, prix fixé côté serveur)
  SiteChrome.jsx                  → Injecte le footer + le bandeau cookies sur toutes les pages sauf /admin
  SiteFooter.jsx                  → Pied de page (à propos, contact, liens légaux)
  CookieConsentBanner.jsx         → Bandeau de consentement cookies (localStorage)
  ReportPDFDocument.jsx           → Gabarit du PDF téléchargeable (non fourni, voir §7)

/app/mentions-legales, /confidentialite, /cgu, /cgv, /cookies
  → Pages légales — BROUILLONS à compléter et faire valider (voir CONFORMITE-LEGALE.md)

/hooks
  useSecretClicks.js              → Hook générique de déclenchement par clics successifs

/lib
  supabaseClient.js                → Client Supabase (browser + server, clés séparées)
  bacSeries.js                     → Référentiel des séries et coefficients (⚠️ à valider, voir note en §6)
  scoringEngine.js                 → Calcul de moyenne, éligibilité bourse, classement des filières
  payment.js                       → Wrapper SDK FedaPay/KKiaPay (initiation + vérification de signature webhook)

/database
  schema.sql                       → Schéma Postgres/Supabase complet + RLS
```

## 3. Flux de données (parcours utilisateur)

1. **Saisie** — L'utilisateur choisit sa série puis saisit ses notes dans `<BacOrientationForm />`. Aucune donnée sensible n'est encore persistée : on calcule un premier score **côté client** pour un feedback instantané (barre de progression), puis on envoie les notes à `POST /api/score` qui recalcule côté serveur (source de vérité) via `scoringEngine.js` et crée une ligne `etudiants` + `sessions_test` en base, avec un `sessionId` (UUID) renvoyé au client.
2. **Teaser** — `/resultats/[sessionId]` lit en base le résultat calculé et n'affiche que les champs "publics" (nombre de filières compatibles, niveau d'éligibilité qualitatif). Le détail (noms des filières, taux, montants de bourse) reste côté serveur tant que la transaction n'est pas validée.
3. **Paiement** — Le clic sur "Débloquer mon rapport" appelle `POST /api/payment/initiate`, qui crée une transaction `en_attente` et redirige vers la page de paiement FedaPay/KKiaPay (MTN MoMo / Moov / Wave).
4. **Webhook** — Le PSP notifie `POST /api/payment/webhook`. On **vérifie la signature** (secret partagé), on marque la transaction `validee`, puis on autorise l'accès à `/rapport/[sessionId]`.
5. **Rapport complet** — Génération du PDF à la demande via `ReportPDFDocument.jsx` + `@react-pdf/renderer`, téléchargeable depuis la page.
6. **Orientation privé** — À tout moment de l'étape 2 ou 4, si `scoringEngine` renvoie `eligibiliteBourse: "Faible"` ou `filièresPubliquesCompatibles.length === 0`, `<PrivateOrientationCard />` s'affiche automatiquement (voir §4).

## 4. Sécurité — points non négociables

- **RLS Supabase activé sur toutes les tables.** Le rapport détaillé n'est lisible que si `transactions.statut = 'validee'` pour la session correspondante (policy SQL, pas juste une vérification côté front).
- **Aucune clé secrète (Supabase service role, secret webhook FedaPay, secret admin) dans le bundle client.** Tout ce qui est sensible vit dans des variables d'environnement serveur (`.env.local`, jamais commité) et n'est utilisé que dans les Route Handlers (`/app/api/**`).
- **Le mot de passe admin n'est jamais comparé côté client.** Voir §5 — c'est un choix délibéré qui diffère de ce qui serait le plus simple à coder, pour une bonne raison de sécurité.
- **Vérification de signature obligatoire sur le webhook de paiement** — sans ça, n'importe qui peut appeler l'URL du webhook et débloquer un rapport gratuitement.
- **Rate limiting** sur `/api/admin/auth` et `/api/payment/initiate` (protection contre le brute-force et le spam de transactions).

## 5. Espace admin caché — comment ça marche réellement

Le cahier des charges demande un mot de passe fixe (`Réussite2.0`) déclenché par 5 clics. Le composant `AdminAccessModal.jsx` (livré ci-dessous) implémente fidèlement le comportement demandé côté UX (5 clics rapides sur le logo → modal → champ mot de passe), **mais la vérification du mot de passe se fait côté serveur, jamais dans le code React envoyé au navigateur.**

Pourquoi : n'importe quel visiteur peut ouvrir les DevTools et lire l'intégralité du code JavaScript envoyé au navigateur. Si `"Réussite2.0"` est écrit en clair dans un composant client, **il est visible par tout le monde en clair en quelques secondes**, Easter Egg ou pas. Le hook `useSecretClicks` (le "5 clics") est un choix d'UX totalement valable pour cacher l'*entrée* de l'espace admin au grand public — mais il ne doit jamais porter la logique de sécurité elle-même.

La bonne pratique, implémentée dans `app/api/admin/auth/route.js` :
1. Le mot de passe `Réussite2.0` est haché une seule fois (bcrypt) et seul le hash est stocké dans une variable d'environnement serveur `ADMIN_PASSWORD_HASH`.
2. Le formulaire envoie le mot de passe saisi à `POST /api/admin/auth` (HTTPS uniquement).
3. Le serveur compare le hash, et s'il correspond, pose un cookie `httpOnly`, `secure`, signé (JWT courte durée) — le seul moyen d'accéder à `/admin`.
4. `/admin` vérifie ce cookie côté serveur (middleware ou layout) avant de rendre quoi que ce soit.

## 6. Note importante sur les données métier (séries, coefficients, critères de bourse)

Les coefficients par série et les seuils d'éligibilité DBSU évoluent par arrêté ministériel et peuvent varier d'une session à l'autre. `lib/bacSeries.js` contient une structure **fonctionnelle et complète**, mais avec des valeurs d'exemple clairement marquées. Avant mise en production :
- Faites valider les coefficients exacts par une personne ayant accès aux textes officiels du MESRS en vigueur pour la session concernée.
- Une fois validés, saisissez-les dans le Dashboard Admin (tables `matieres_coefficients`, `bourses`, `filieres`) plutôt que de les modifier en dur dans le code — c'est exactement le rôle prévu pour l'espace admin.

## 7. Étapes suivantes non couvertes dans cette livraison

- Intégration effective du SDK FedaPay/KKiaPay (`lib/payment.js` à compléter avec vos clés marchandes).
- Génération du PDF (`ReportPDFDocument.jsx`).
- Page `/resultats` (teaser) et `/rapport` (rapport complet) — la logique de calcul (`scoringEngine.js`) est prête à être consommée par ces deux pages.
