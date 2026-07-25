# Trouve ta voie après le BAC — Bénin

Plateforme d'orientation post-BAC : bourse d'État, filières publiques compatibles, et mise en
relation vers l'enseignement privé. Voir `ARCHITECTURE.md` pour le détail technique complet,
`SECURITY.md` pour la sécurité, `CONFORMITE-LEGALE.md` pour les obligations légales au Bénin.

## Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer un projet Supabase
1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL de Supabase, exécutez le contenu de `database/schema.sql`.
3. Récupérez l'URL du projet et les clés `anon` / `service_role` dans
   *Project Settings → API*.

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```
Remplissez `.env.local` (jamais commité) :
- Les 3 valeurs Supabase récupérées à l'étape précédente.
- Le hash du mot de passe admin :
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('Réussite2.0', 12))"
  ```
  Copiez le résultat dans `ADMIN_PASSWORD_HASH`.
- Un secret aléatoire pour `ADMIN_JWT_SECRET` :
  ```bash
  openssl rand -base64 48
  ```
- Laissez `PAYMENT_MODE=manuel` tant que vous n'avez pas de compte KKiaPay (voir §4). Le site
  fonctionne dès maintenant avec le paiement manuel + validation depuis `/admin`.

### 4. Lancer en local
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000).

Pour ouvrir le dashboard admin : cliquez 5 fois rapidement sur le logo (page d'accueil ou page
`/test`), puis entrez `Réussite2.0`.

### 5. Passer au paiement automatique (recommandé dès que possible)
1. Créez un compte marchand sur [kkiapay.me](https://kkiapay.me) (pièce d'identité + téléphone).
2. Dans leur tableau de bord, renseignez vos comptes de reversement :
   MTN MoMo `0153731434` et Moov Money/Celtiis Cash `0143599669`.
3. Copiez vos clés (publique, privée, secret webhook) dans `.env.local`.
4. Passez `PAYMENT_MODE=kkiapay`.
5. Configurez l'URL de webhook `https://votre-domaine.tld/api/payment/webhook` dans leur
   tableau de bord.

### 6. Déployer
- Déployez le dossier sur [Vercel](https://vercel.com) (connecter le dépôt Git).
- Renseignez les mêmes variables d'environnement dans *Project Settings → Environment
  Variables* — jamais dans un fichier commité.
- Pointez votre nom de domaine, Vercel gère le HTTPS automatiquement.

## Ce qui est déjà fonctionnel

- Parcours complet : accueil → test → résultats (teaser) → paiement → rapport complet.
- Paiement manuel opérationnel dès le premier lancement (sans compte agrégateur).
- Espace admin caché (5 clics) avec authentification serveur sécurisée.
- Encadré d'orientation privé (WhatsApp / appel / email) affiché automatiquement selon les
  résultats.
- Sécurité de base (voir `SECURITY.md`) et notes de conformité légale Bénin (voir
  `CONFORMITE-LEGALE.md`).

## Ce qu'il reste à faire avant un lancement public

- [ ] Peupler les tables `filieres`, `filieres_series_eligibles`, `bourses`,
      `matieres_coefficients` avec des données réelles et validées (le dashboard admin actuel
      liste les transactions et demandes ; les formulaires d'édition de ces tables restent à
      construire — priorisez selon vos besoins).
- [ ] Faire valider les coefficients par série auprès d'une source officielle du MESRS.
- [ ] Créer le compte KKiaPay (ou FedaPay) et passer en `PAYMENT_MODE=kkiapay`.
- [ ] Rédiger et publier une page "Politique de confidentialité" et des "Mentions légales"
      (voir `CONFORMITE-LEGALE.md`).
- [ ] Engager la déclaration du traitement de données auprès de l'APDP (www.apdp.bj).
- [ ] Relecture par un professionnel du droit numérique béninois avant un lancement à grande
      échelle.
