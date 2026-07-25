# Sécurité — état des lieux et recommandations

## À lire en premier

Il n'existe **aucun site "impossible à pirater"** — quiconque vous promet une sécurité absolue
vous vend quelque chose. L'objectif réaliste et atteignable est de fermer les portes d'entrée
les plus courantes, de limiter les dégâts si un incident survient, et de pouvoir réagir vite.
C'est ce que couvre ce document : ce qui est déjà en place dans le code livré, et ce qu'il vous
reste à faire côté compte/opérationnel (aucune ligne de code ne peut le faire à votre place).

## 1. Ce qui est déjà implémenté dans le code

| Risque | Mesure |
|---|---|
| Mot de passe admin lisible dans le navigateur | Vérifié uniquement côté serveur, jamais dans le bundle client (voir `app/api/admin/auth/route.js`) |
| Mot de passe admin en clair en base ou dans le code | Haché avec bcrypt (12 rounds) ; seul le hash vit dans une variable d'environnement serveur |
| Accès à `/admin` sans authentification | Bloqué à deux niveaux : `middleware.js` (avant même de charger la page) et la page elle-même (défense en profondeur) |
| Vol de cookie de session admin | Cookie `httpOnly` (invisible en JavaScript), `secure` (HTTPS uniquement), `sameSite=strict`, expiration 2h |
| Brute-force du mot de passe admin | Limiteur de tentatives (5 / 10 min par IP) sur `/api/admin/auth` |
| Faux webhook de paiement (débloquer un rapport sans payer) | Vérification de signature HMAC obligatoire avant toute mise à jour de transaction, comparaison à temps constant |
| Rejeu d'un webhook de paiement déjà traité | Mise à jour conditionnée à `statut = 'en_attente'` (idempotence) |
| Données malformées ou hostiles envoyées aux API | Validation stricte de schéma (`zod`) sur toutes les routes qui acceptent des entrées utilisateur |
| Fuite de la clé Supabase "service role" | Isolée dans `lib/supabaseClient.js`, jamais utilisée dans un composant `'use client'` |
| Accès direct aux tables sensibles depuis le navigateur | Row Level Security activée sur toutes les tables (voir `database/schema.sql`) ; aucune écriture cliente autorisée par défaut |
| Clickjacking (site iframé sur un autre site pour piéger un clic) | En-tête `X-Frame-Options: DENY` + `frame-ancestors 'none'` (CSP) |
| Injection de script / XSS via en-têtes | `Content-Security-Policy` restrictive dans `middleware.js` |
| Détournement du navigateur (caméra, micro, géoloc) par un script tiers | `Permissions-Policy` désactivée par défaut |
| Interception réseau (HTTP non chiffré) | `Strict-Transport-Security` (HSTS) dans `next.config.js` |
| Fuite de la nature du framework (facilite la recherche de failles connues) | `poweredByHeader: false` |
| Spam / abus sur les formulaires publics (score, contact, paiement) | Limiteur de débit (`lib/rateLimit.js`) sur chaque route |

## 2. Ce qui reste à faire de votre côté (ce sont des actions, pas du code)

- **Ne jamais committer `.env.local`** (déjà exclu par `.gitignore`) et ne le partager par aucun canal non chiffré (pas d'email, pas de WhatsApp en clair pour les vraies clés de production).
- **Générer des secrets forts** : `ADMIN_JWT_SECRET` et `KKIAPAY_SECRET` doivent être de longues chaînes aléatoires, jamais des mots simples.
- **Changer le mot de passe admin périodiquement** (le hash dans `.env` peut être régénéré à tout moment sans toucher au code).
- **Activer l'authentification à deux facteurs** sur vos comptes Vercel, Supabase, GitHub, KKiaPay/FedaPay et votre boîte email — c'est souvent le point d'entrée réel des piratages, pas le code de l'application.
- **Sauvegardes régulières** de la base Supabase (Point-in-Time Recovery si le plan le permet), et testez au moins une fois une restauration.
- **Surveillance** : activez les alertes Supabase et Vercel sur les pics d'erreurs ou de trafic anormal.
- **Mises à jour de dépendances** : lancez `npm audit` régulièrement et mettez à jour Next.js/les librairies dès qu'une faille de sécurité est publiée.
- **Limiteur de débit en production réelle** : la version incluse (`lib/rateLimit.js`) est un filet minimal en mémoire ; à volume important, remplacez-la par Upstash Ratelimit (Redis) ou activez le pare-feu applicatif de Vercel.
- **Journal des accès admin** : envisagez de journaliser chaque connexion réussie à `/admin` (IP, horodatage) dans une table dédiée pour détecter une utilisation suspecte.
- **Vérification du webhook KKiaPay** : le nom exact de l'en-tête de signature et l'algorithme peuvent changer selon leur documentation — reconfirmez-le à l'intégration (`docs.kkiapay.me`) avant mise en production.

## 3. Que faire en cas d'incident (piratage suspecté)

1. Révoquer immédiatement le cookie de session admin en changeant `ADMIN_JWT_SECRET` (toutes les sessions existantes deviennent invalides).
2. Changer le mot de passe admin (nouveau hash bcrypt).
3. Régénérer les clés Supabase (service role) et KKiaPay si une fuite est suspectée.
4. Consulter les journaux Vercel/Supabase pour identifier l'origine.
5. Si des données personnelles ont pu être exposées, vous avez une obligation de notification auprès de l'**APDP** (Autorité de Protection des Données Personnelles du Bénin) — voir `CONFORMITE-LEGALE.md`.
