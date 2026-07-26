-- =========================================================================
-- seed.sql — Données de démarrage
-- =========================================================================
-- À exécuter APRÈS schema.sql, dans l'éditeur SQL de Supabase.
--
-- ⚠️ CE QUI EST VÉRIFIÉ vs CE QUI EST UN POINT DE DÉPART :
-- - Les noms d'universités, d'écoles et de filières ci-dessous sont basés sur
--   des sources publiques (UAC, UNSTIM, UNA, UP + grandes écoles EPAC, ENEAM,
--   ENSTP, IFRI, INJEPS, ENAM) et sont raisonnablement fiables sur le plan
--   structurel (ces établissements existent bien et forment bien dans ces
--   domaines).
-- - Les SEUILS D'ADMISSION (colonne seuil_admission) sont en revanche des
--   VALEURS DE DÉPART PLACEHOLDER, pas des seuils officiels vérifiés — le
--   MESRS ne publie pas de seuils fixes par filière (l'admission dépend des
--   quotas et du classement des candidats chaque année). Affinez-les
--   progressivement depuis /admin/filieres à mesure que vous obtenez de
--   vraies données (ex : seuils constatés les années précédentes).
-- - Pensez aussi à vérifier le nom exact de la direction en charge des
--   bourses : le cahier des charges initial mentionne "DBSU", certaines
--   sources publiques récentes mentionnent "Direction des Bourses et Aides
--   Universitaires (DBAU)" — à confirmer avant de l'afficher publiquement.

-- --- Séries (doit rester synchronisé avec lib/bacSeries.js) ---------------
insert into series_bac (code, nom, groupe) values
  ('A1', 'Lettres - Langues', 'Littéraire'),
  ('A2', 'Lettres - Sciences Humaines', 'Littéraire'),
  ('B',  'Lettres - Sciences Sociales (Économique)', 'Littéraire'),
  ('C',  'Sciences et Techniques (Maths - Physique)', 'Scientifique'),
  ('D',  'Sciences de la Vie et de la Terre (Biologie - Géologie)', 'Scientifique'),
  ('E',  'Mathématiques et Techniques', 'Technique / Industrielle'),
  ('F1', 'Construction Mécanique', 'Technique / Industrielle'),
  ('F2', 'Électronique', 'Technique / Industrielle'),
  ('F3', 'Électrotechnique', 'Technique / Industrielle'),
  ('F4', 'Génie Civil', 'Technique / Industrielle'),
  ('G1', 'Techniques Administratives', 'Commerciale / Administrative'),
  ('G2', 'Techniques Quantitatives de Gestion', 'Commerciale / Administrative'),
  ('G3', 'Techniques Commerciales', 'Commerciale / Administrative')
on conflict (code) do nothing;

-- --- Seuils de bourse par défaut (un seul enregistrement canonique) -------
insert into bourses (nom, type, seuil_forte, seuil_moyenne, description)
values (
  'Bourse standard',
  'bourse',
  14,
  12,
  'Seuils de départ à valider — voir /admin/bourses. Terminologie de la direction en charge (DBSU/DBAU) à confirmer.'
)
on conflict do nothing;

-- --- Filières publiques (structure réelle, seuils placeholder) ------------

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Droit et Sciences Politiques', 'UAC', 'FADESP', 9)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['A1','A2','B']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Lettres Modernes', 'UAC', 'FLLAC', 9)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['A1','A2']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Économie et Gestion', 'UAC', 'FASEG', 10)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['B','G1','G2','G3']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Sciences et Techniques', 'UAC', 'FAST', 10)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Médecine', 'UAC', 'FSS', 14)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Civil', 'UAC', 'EPAC', 12)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F4']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Électrique', 'UAC', 'EPAC', 12)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F2','F3']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Mécanique', 'UAC', 'EPAC', 12)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F1']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Informatique et Télécommunications', 'UAC', 'EPAC', 12)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D','E']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Comptabilité et Management', 'UAC', 'ENEAM', 10)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['B','G1','G2','G3']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Bâtiment et Travaux Publics', 'UAC', 'ENSTP', 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F4']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Informatique et Sécurité des Systèmes', 'UAC', 'IFRI', 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D','E']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Éducation Physique et Sportive', 'UAC', 'INJEPS', 9)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['A1','A2','B','C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Administration Publique (sur concours)', 'UAC', 'ENAM', 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['B','G1']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Civil', 'UNSTIM', null, 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F4']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Électrique', 'UNSTIM', null, 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F2','F3']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Génie Mécanique', 'UNSTIM', null, 11)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','E','F1']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Agronomie', 'UNA', null, 10)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Zootechnie', 'UNA', null, 9)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Droit', 'UP', null, 9)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['A1','A2','B']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Médecine', 'UP', null, 13)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;

with f as (
  insert into filieres (nom, universite, etablissement, seuil_admission)
  values ('Agronomie', 'UP', null, 10)
  returning id
)
insert into filieres_series_eligibles (filiere_id, serie_code)
select id, s from f, unnest(array['C','D']) as s;
