# Conformité légale — Bénin

⚠️ Ceci est une information générale destinée à orienter votre mise en conformité, **pas un
avis juridique**. Votre site traite des données personnelles (notes scolaires, téléphone,
email, paiements) potentiellement de mineurs et gère de l'argent : faites valider votre
dispositif final par un avocat ou juriste béninois avant un lancement à grande échelle.

## 1. Protection des données personnelles — Loi n° 2017-20 (Code du numérique)

Le Bénin encadre la collecte et le traitement des données personnelles par la **loi n° 2017-20
du 20 avril 2018 portant Code du numérique** (Livre 5, modifiée par la loi n° 2020-35 du 6
janvier 2021), sous le contrôle de l'**APDP** (Autorité de Protection des Données à caractère
Personnel — www.apdp.bj), qui a succédé à l'ancienne CNIL béninoise.

**Procédure de déclaration (vérifiée en juillet 2026)** :
1. Rendez-vous sur le portail dématérialisé **https://service.apdp.bj** — la liste des pièces
   requises et les formulaires y sont téléchargeables (dont un formulaire de déclaration).
2. Remplissez le formulaire en indiquant clairement la **finalité** du traitement (calcul
   d'orientation, éligibilité bourse) et le **public cible** (bacheliers et étudiants du Bénin).
3. Adressez le dossier complet (formulaire + pièces justificatives) selon la procédure du
   portail.
4. L'APDP dispose d'un délai de **2 mois** pour traiter la demande — répondez rapidement à
   toute demande de complément d'information de leur part.
5. Une fois la déclaration effectuée, ajoutez une phrase dans vos mentions légales du type :
   *"Ce site a fait l'objet d'une déclaration auprès de l'Autorité de Protection des Données à
   caractère Personnel (apdp.bj) le [date]"* — c'est la formulation que d'autres sites
   institutionnels béninois utilisent.

Ce que cela implique concrètement pour ce site :

- **Déclaration auprès de l'APDP** : un traitement de données personnelles (notes, téléphone,
  email, paiements) doit en principe être déclaré à l'APDP avant sa mise en service. C'est une
  démarche administrative à faire par vous (ou via un prestataire de conformité) — le code ne
  peut pas s'auto-déclarer.
- **Désignation d'un responsable du traitement** (vous, en tant qu'exploitant du site), et selon
  le volume, potentiellement un DPO (Délégué à la Protection des Données).
- **Information claire des utilisateurs** avant la collecte : à quoi servent les données, qui y
  a accès, combien de temps elles sont conservées. Concrètement : une page "Politique de
  confidentialité" accessible depuis le formulaire (à rédiger — un gabarit peut être préparé
  sur demande).
- **Minimisation** : ne collectez que ce qui est nécessaire. Le schéma actuel ne rend le nom,
  l'email et le téléphone qu'optionnels à l'étape gratuite — c'est volontaire.
- **Durée de conservation limitée** : prévoyez une purge périodique des sessions de test non
  converties en paiement (ex : après 12 mois), plutôt qu'une conservation indéfinie.
- **Droits des personnes** : droit d'accès, de rectification et de suppression sur simple
  demande (email ou WhatsApp) — à prévoir dans votre processus, même s'il est manuel au début.

## 2. Mineurs

Une partie importante de vos utilisateurs (candidats au BAC) sont mineurs. Le Code du numérique
ne fixe pas un régime totalement séparé pour les mineurs comme le RGPD européen, mais la
prudence s'impose : évitez de collecter plus que le strict nécessaire, et soyez transparent sur
l'usage des données dans un langage compréhensible par un lycéen.

## 3. Cybersécurité — ANSSI-Bénin

Le Code du numérique définit également une **Agence Nationale de Sécurité des Systèmes
d'Information (ANSSI-Bénin)**, dont le cadre couvre les infractions relatives à la
confidentialité, l'intégrité et la disponibilité des systèmes d'information. Le fait de mettre
en œuvre les mesures de `SECURITY.md` (RLS, hachage, signatures de webhook, journalisation)
n'est donc pas qu'une bonne pratique technique : c'est aligné avec l'esprit de ce cadre légal.

## 4. Aspects commerciaux et fiscaux

- **Mentions légales** : nom de l'exploitant, forme (entreprise individuelle, société...),
  contact, hébergeur — à afficher en pied de page (obligation classique pour tout site
  marchand).
- **CGU / CGV** : conditions d'utilisation et de vente, notamment la politique de
  remboursement en cas d'échec technique après paiement.
- **Fiscalité** : dès lors que vous encaissez des paiements de manière récurrente contre un
  service (le rapport payant), ces recettes constituent en principe un revenu commercial
  soumis aux obligations fiscales béninoises normales (déclaration, IFU le cas échéant). Un
  compte marchand agrégateur (KKiaPay/FedaPay) facilite cette traçabilité par rapport à des
  virements reçus directement sur un numéro Mobile Money personnel.
- **Réglementation Mobile Money** : au-delà d'un certain volume, un compte Mobile Money
  "particulier" peut être soumis à des plafonds (KYC) fixés par la BCEAO et par chaque
  opérateur ; un usage commercial soutenu sur un compte particulier peut entraîner un contrôle
  ou un blocage temporaire par l'opérateur. C'est une raison de plus, en plus de la sécurité du
  déblocage automatique, de passer par un compte marchand agrégateur dès que le volume grandit.

## 5. Prochaine étape recommandée

Avant un lancement à grande échelle ("des milliers de jeunes"), faites relire ce dispositif par
un professionnel du droit numérique béninois, et engagez la démarche de déclaration APDP —
ces deux étapes sont administratives, indépendantes du code, et ne peuvent être faites qu'en
votre nom.
