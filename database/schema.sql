-- =========================================================================
-- schema.sql — Plateforme d'orientation post-BAC (Bénin)
-- Cible : Supabase (Postgres + Row Level Security)
-- =========================================================================

create extension if not exists "pgcrypto"; -- pour gen_random_uuid()

-- -------------------------------------------------------------------------
-- ENUMS
-- -------------------------------------------------------------------------
create type statut_transaction as enum ('en_attente', 'validee', 'echouee', 'remboursee');
create type moyen_paiement as enum ('mtn_momo', 'moov_money', 'wave', 'carte');
create type niveau_eligibilite as enum ('Forte', 'Moyenne', 'Faible');

-- -------------------------------------------------------------------------
-- TABLE : series_bac  (référentiel, éditable en admin)
-- -------------------------------------------------------------------------
create table series_bac (
  code        text primary key,          -- 'A1', 'F2', 'G3', ...
  nom         text not null,
  groupe      text not null,             -- 'Littéraire', 'Scientifique', ...
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- TABLE : matieres_coefficients  (coefficients par matière et par série)
-- -------------------------------------------------------------------------
create table matieres_coefficients (
  id            uuid primary key default gen_random_uuid(),
  serie_code    text not null references series_bac(code) on delete cascade,
  matiere_code  text not null,           -- 'maths', 'francais', ...
  matiere_nom   text not null,
  coefficient   numeric(3,1) not null check (coefficient > 0),
  updated_at    timestamptz not null default now(),
  unique (serie_code, matiere_code)
);

-- -------------------------------------------------------------------------
-- TABLE : etudiants  (une ligne par utilisateur ayant lancé un test)
-- -------------------------------------------------------------------------
create table etudiants (
  id            uuid primary key default gen_random_uuid(),
  nom           text,
  prenom        text,
  telephone     text,
  email         text,
  serie_code    text references series_bac(code),
  notes         jsonb not null,          -- { "maths": 15.5, "francais": 12, ... }
  moyenne       numeric(4,2),            -- calculée par scoringEngine, stockée pour l'historique
  created_at    timestamptz not null default now()
);

create index idx_etudiants_serie on etudiants(serie_code);

-- -------------------------------------------------------------------------
-- TABLE : bourses  (critères DBSU, éditables en admin)
-- -------------------------------------------------------------------------
create table bourses (
  id              uuid primary key default gen_random_uuid(),
  nom             text not null,          -- ex : 'Bourse DBSU standard'
  type            text not null,          -- 'bourse' | 'secours'
  seuil_forte     numeric(4,2) not null,  -- moyenne à partir de laquelle éligibilité "Forte"
  seuil_moyenne   numeric(4,2) not null,
  montant_fcfa    integer,
  description     text,
  updated_at      timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- TABLE : filieres  (filières publiques : UAC, UNA, UNSTIM, UP...)
-- -------------------------------------------------------------------------
create table filieres (
  id                  uuid primary key default gen_random_uuid(),
  nom                 text not null,           -- ex : 'Génie Civil'
  universite          text not null,           -- 'UAC', 'UNSTIM', 'UNA', 'UP'
  etablissement       text,                    -- ex : 'INSTI', 'ENEAM', 'FASEG'
  type_etablissement  text not null default 'public', -- 'public' | 'prive'
  seuil_admission     numeric(4,2) not null,   -- moyenne minimale indicative
  quota_indicatif     integer,                 -- nombre de places / bourses indicatif
  description         text,
  updated_at          timestamptz not null default now()
);

-- Table de jonction : quelles séries donnent accès à quelle filière
create table filieres_series_eligibles (
  filiere_id   uuid not null references filieres(id) on delete cascade,
  serie_code   text not null references series_bac(code) on delete cascade,
  primary key (filiere_id, serie_code)
);

-- -------------------------------------------------------------------------
-- TABLE : sessions_test  (une session = un passage du test, liée à un étudiant)
-- -------------------------------------------------------------------------
create table sessions_test (
  id                        uuid primary key default gen_random_uuid(),
  etudiant_id               uuid not null references etudiants(id) on delete cascade,
  niveau_eligibilite_bourse niveau_eligibilite,
  taux_obtention_bourse     integer check (taux_obtention_bourse between 0 and 100),
  nombre_filieres_compatibles integer not null default 0,
  resultat_complet          jsonb,       -- classement détaillé des filières (calculé par scoringEngine)
  created_at                timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- TABLE : transactions  (paiements FedaPay / KKiaPay)
-- -------------------------------------------------------------------------
create table transactions (
  id                  uuid primary key default gen_random_uuid(),
  session_test_id     uuid not null references sessions_test(id) on delete cascade,
  montant_fcfa        integer not null check (montant_fcfa > 0), -- prix réel piloté par PRIX_RAPPORT_FCFA (lib/payment.js), 325 FCFA par défaut
  statut              statut_transaction not null default 'en_attente',
  moyen_paiement      moyen_paiement,
  reference_psp       text,             -- identifiant renvoyé par FedaPay/KKiaPay
  created_at          timestamptz not null default now(),
  validee_at          timestamptz
);

create index idx_transactions_session on transactions(session_test_id);
create index idx_transactions_statut on transactions(statut);

-- -------------------------------------------------------------------------
-- TABLE : rapports  (rapport PDF généré après paiement validé)
-- -------------------------------------------------------------------------
create table rapports (
  id                uuid primary key default gen_random_uuid(),
  session_test_id   uuid not null references sessions_test(id) on delete cascade,
  transaction_id    uuid not null references transactions(id),
  pdf_url           text,
  created_at        timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- TABLE : contacts_prive  (demandes d'accompagnement vers le privé)
-- -------------------------------------------------------------------------
create table contacts_prive (
  id            uuid primary key default gen_random_uuid(),
  session_test_id uuid references sessions_test(id) on delete set null,
  nom           text not null,
  telephone     text not null,
  message       text,
  traite        boolean not null default false,
  created_at    timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- TABLE : admin_users  (comptes admin — mot de passe TOUJOURS haché, jamais en clair)
-- -------------------------------------------------------------------------
create table admin_users (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  password_hash  text not null,   -- bcrypt, jamais le mot de passe en clair
  created_at     timestamptz not null default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table etudiants enable row level security;
alter table sessions_test enable row level security;
alter table transactions enable row level security;
alter table rapports enable row level security;
alter table contacts_prive enable row level security;
alter table admin_users enable row level security;

-- Par défaut : aucun accès direct depuis le client. Toutes les lectures/écritures
-- sensibles transitent par les Route Handlers Next.js, qui utilisent la clé
-- "service role" côté serveur uniquement (jamais exposée au navigateur).

-- Exemple de policy si un accès direct depuis le client authentifié était
-- nécessaire pour consulter SON PROPRE rapport une fois payé :
--
-- create policy "Un etudiant peut lire son rapport si la transaction est validee"
--   on rapports for select
--   using (
--     exists (
--       select 1 from transactions t
--       where t.id = rapports.transaction_id
--       and t.statut = 'validee'
--       -- + une colonne d'identification de session côté client (ex: token signé)
--     )
--   );

-- Les tables de référence (series_bac, matieres_coefficients, bourses, filieres,
-- filieres_series_eligibles) sont en lecture publique (le calcul de teaser peut
-- en avoir besoin côté client), mais en écriture réservée à l'admin :

alter table series_bac enable row level security;
alter table matieres_coefficients enable row level security;
alter table bourses enable row level security;
alter table filieres enable row level security;
alter table filieres_series_eligibles enable row level security;

create policy "Lecture publique des referentiels" on series_bac for select using (true);
create policy "Lecture publique des coefficients" on matieres_coefficients for select using (true);
create policy "Lecture publique des bourses" on bourses for select using (true);
create policy "Lecture publique des filieres" on filieres for select using (true);
create policy "Lecture publique des eligibilites" on filieres_series_eligibles for select using (true);

-- Aucune policy d'écriture n'est créée ici : les mutations sur ces tables de
-- référence passent exclusivement par les Route Handlers admin, authentifiés
-- via le cookie de session signé (voir app/api/admin/auth/route.js), en
-- utilisant la clé service role Supabase côté serveur.

-- =========================================================================
-- MIGRATION (si vous avez déjà exécuté une version précédente de ce fichier
-- dans votre projet Supabase — table sessions_test déjà créée)
-- =========================================================================
-- N'exécutez pas tout le fichier dans ce cas (les "create table" échoueraient
-- car les tables existent déjà). Exécutez uniquement cette ligne :
--
-- alter table sessions_test add column if not exists taux_obtention_bourse integer check (taux_obtention_bourse between 0 and 100);
