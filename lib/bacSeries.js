/**
 * lib/bacSeries.js
 *
 * Référentiel des séries du Baccalauréat béninois + coefficients par matière.
 *
 * ⚠️ IMPORTANT — LIRE AVANT PRODUCTION
 * Les coefficients ci-dessous sont des VALEURS D'EXEMPLE structurellement correctes
 * (nombre de matières, poids relatifs cohérents avec le profil de chaque série),
 * mais elles doivent être vérifiées et validées à partir de l'arrêté ministériel
 * en vigueur pour la session concernée avant toute mise en production.
 * Une fois validées, elles doivent être gérées depuis le Dashboard Admin
 * (table `matieres_coefficients`), pas modifiées en dur ici.
 *
 * Séries couvertes : Générales (A1, A2, B, C, D) + Techniques/Industrielles
 * (E, F1-F4) + Commerciales/Administratives (G1-G3).
 */

export const GROUPES = {
  LITTERAIRE: 'Littéraire',
  SCIENTIFIQUE: 'Scientifique',
  TECHNIQUE_INDUSTRIELLE: 'Technique / Industrielle',
  COMMERCIALE_ADMIN: 'Commerciale / Administrative',
};

// Chaque matière : { code, nom, coefficient }
export const BAC_SERIES = {
  A1: {
    nom: 'Lettres - Langues',
    groupe: GROUPES.LITTERAIRE,
    matieres: [
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 5 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 4 },
      { code: 'lv1', nom: 'Anglais', coefficient: 4 },
      { code: 'lv2', nom: 'Langue Vivante(Allemand ou Espagnol)', coefficient: 3 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 2 },
    ],
  },
  A2: {
    nom: 'Lettres - Sciences Humaines',
    groupe: GROUPES.LITTERAIRE,
    matieres: [
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 5 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 4 },
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 4 },
      { code: 'lv1', nom: 'Anglais', coefficient: 3 },
      { code: 'lv2', nom: 'Langue Vivante(Allemand ou Espagnol)', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 2 },
    ],
  },
  B: {
    nom: 'Lettres - Sciences Sociales (Économique)',
    groupe: GROUPES.LITTERAIRE,
    matieres: [
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'economie', nom: 'Économie/SES', coefficient: 4 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 3 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 3 },
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 3 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
    ],
  },
  C: {
    nom: 'Sciences et Techniques (Maths - Physique)',
    groupe: GROUPES.SCIENTIFIQUE,
    matieres: [
      { code: 'maths', nom: 'Mathématiques', coefficient: 6 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 5 },
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 2 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 2 },
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 2 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
    ],
  },
  D: {
    nom: 'Sciences de la Vie et de la Terre (Biologie - Géologie)',
    groupe: GROUPES.SCIENTIFIQUE,
    matieres: [
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 5 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 2 },
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 2 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
    ],
  },
  EA: {
    nom: 'Économie Appliquée / Sciences de l\'Eau et de l\'Environnement',
    groupe: GROUPES.SCIENTIFIQUE,
    // ⚠️ Liste approximative (proche de D) — le guide MESRS mentionne EA comme
    // série à part sans en détailler le référentiel complet des matières.
    // À valider avec une source officielle avant production.
    matieres: [
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 4 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 2 },
    ],
  },
  E: {
    nom: 'Mathématiques et Techniques',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'maths', nom: 'Mathématiques', coefficient: 6 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'technologie', nom: 'Technologie', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  F1: {
    nom: 'Construction Mécanique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'construction_mecanique', nom: 'Construction Mécanique', coefficient: 6 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  F2: {
    nom: 'Électronique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'electronique', nom: 'Électronique', coefficient: 6 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  F3: {
    nom: 'Électrotechnique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'electrotechnique', nom: 'Électrotechnique', coefficient: 6 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  F4: {
    nom: 'Génie Civil',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'rdm', nom: 'RDM', coefficient: 6 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  G1: {
    nom: 'Techniques Administratives',
    groupe: GROUPES.COMMERCIALE_ADMIN,
    matieres: [
      { code: 'techniques_administratives', nom: 'Techniques Administratives', coefficient: 5 },
      { code: 'droit', nom: 'Droit', coefficient: 3 },
      { code: 'comptabilite', nom: 'Comptabilité', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 3 },
      { code: 'economie', nom: 'Économie', coefficient: 2 },
      { code: 'etude_de_cas', nom: 'Étude de Cas', coefficient: 4 },
    ],
  },
  G2: {
    nom: 'Techniques Quantitatives de Gestion',
    groupe: GROUPES.COMMERCIALE_ADMIN,
    matieres: [
      { code: 'maths_appliquees', nom: 'Mathématiques Appliquées', coefficient: 5 },
      { code: 'comptabilite', nom: 'Comptabilité / Gestion', coefficient: 4 },
      { code: 'economie', nom: 'Économie', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'etude_de_cas', nom: 'Étude de Cas', coefficient: 4 },
    ],
  },
  G3: {
    nom: 'Techniques Commerciales',
    groupe: GROUPES.COMMERCIALE_ADMIN,
    matieres: [
      { code: 'techniques_commerciales', nom: 'Techniques Commerciales', coefficient: 5 },
      { code: 'comptabilite', nom: 'Comptabilité', coefficient: 4 },
      { code: 'economie', nom: 'Économie', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'etude_de_cas', nom: 'Étude de Cas', coefficient: 4 },
    ],
  },
};

export const LISTE_SERIES = Object.entries(BAC_SERIES).map(([code, data]) => ({
  code,
  nom: data.nom,
  groupe: data.groupe,
}));

export function getMatieresBySerie(codeSerie) {
  const serie = BAC_SERIES[codeSerie];
  if (!serie) {
    throw new Error(`Série inconnue : "${codeSerie}"`);
  }
  return serie.matieres;
}
