/**
 * lib/bacSeries.js
 *
 * Référentiel des séries du Baccalauréat béninois + coefficients par matière.
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
      { code: 'lv2', nom: 'Langue Vivante (Allemand ou Espagnol)', coefficient: 3 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 3 },
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 2 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 2 },
    ],
  },
  A2: {
    nom: 'Lettres - Sciences Humaines',
    groupe: GROUPES.LITTERAIRE,
    matieres: [
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 5 },
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 2 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 4 },
      { code: 'francais', nom: 'Français / Dissertation', coefficient: 4 },
      { code: 'lv1', nom: 'Anglais', coefficient: 3 },
      { code: 'lv2', nom: 'Langue Vivante (Allemand ou Espagnol)', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 2 },
    ],
  },
  B: {
    nom: 'Lettres - Sciences Sociales (Économique)',
    groupe: GROUPES.LITTERAIRE,
    matieres: [
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'economie', nom: 'Économie / SES', coefficient: 4 },
      { code: 'philosophie', nom: 'Philosophie', coefficient: 3 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 3 },
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 2 },
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
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 2 },
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
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 2 },
    ],
  },
  EA: {
    nom: "Économie Appliquée / Sciences de l'Eau et de l'Environnement",
    groupe: GROUPES.SCIENTIFIQUE,
    matieres: [
      { code: 'traitement_de_eau', nom: "Traitement de l'eau", coefficient: 4 },
      { code: 'reseaux_hydrauliques', nom: 'Réseaux Hydrauliques', coefficient: 3 },
      { code: 'svt', nom: 'Sciences de la Vie et de la Terre', coefficient: 4 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 3 },
      { code: 'lv1', nom: 'Anglais', coefficient: 1 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 2 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'assainissement', nom: 'Assainissement', coefficient: 2 },
      { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 2 },
      { code: 'mobilisation_des_ressources_en_eau', nom: 'Mobilisation Des Ressources En Eau', coefficient: 4 },
      { code: 'projet_exploitation', nom: "Projet D'Exploitation", coefficient: 4 },
    ],
  },
  E: {
    nom: 'Mathématiques et Techniques',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'maths', nom: 'Mathématiques', coefficient: 4 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 4 },
      { code: 'construction_mecanique', nom: 'Construction Mécanique', coefficient: 3 },
      { code: 'technologie', nom: 'Technologie', coefficient: 2 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'travaux_pratique', nom: 'TP', coefficient: 3 },
    ],
  },
  F1: {
    nom: 'Construction Mécanique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'construction_mecanique', nom: 'Construction Mécanique', coefficient: 3 },
      { code: 'mecanique', nom: 'Mécanique', coefficient: 2 },
      { code: 'automatique', nom: 'Automatique', coefficient: 2 },
      { code: 'etude_outillage', nom: "Etude D'Outillage", coefficient: 2 },
      { code: 'etude_de_fabrication', nom: 'Analyse De Fabrication', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 3 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 2 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  F2: {
    nom: 'Électronique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'informatique', nom: 'Informatique', coefficient: 2 },
      { code: 'realisation_de_maquette', nom: 'Réalisation de Maquette', coefficient: 4 },
      { code: 'mesure_et_essais_de_laboratoire', nom: 'Mesures Et Essais De Laboratoire', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 3 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 2 },
      { code: 'construction_mecanique', nom: 'Construction Mécanique', coefficient: 2 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'etude_un_systeme_technique', nom: "Etude D'un Système Technique", coefficient: 4 },
    ],
  },
  F3: {
    nom: 'Électrotechnique',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'construction', nom: 'Construction', coefficient: 4 },
      { code: 'mesure_et_essais_de_laboratoire', nom: 'Mesures Et Essais De Laboratoire', coefficient: 3 },
      { code: 'electrotechnique', nom: 'Électrotechnique', coefficient: 3 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 3 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 2 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'etude_un_systeme_technique', nom: "Etude D'un Système Technique", coefficient: 5 },
    ],
  },
  F4: {
    nom: 'Génie Civil',
    groupe: GROUPES.TECHNIQUE_INDUSTRIELLE,
    matieres: [
      { code: 'projet_exploitation', nom: "Projet D'Exploitation", coefficient: 3 },
      { code: 'rdm', nom: 'RDM', coefficient: 3 },
      { code: 'beton_arme', nom: 'Béton Armé', coefficient: 2 },
      { code: 'metre_et_etude_de_prix', nom: 'Métré Et Etude De Prix', coefficient: 2 },
      { code: 'maths', nom: 'Mathématiques', coefficient: 3 },
      { code: 'procede_de_construction', nom: 'Procédé De Construction', coefficient: 2 },
      { code: 'physique_chimie', nom: 'Physique - Chimie', coefficient: 2 },
      { code: 'dessin_technique', nom: 'Dessin Technique', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
    ],
  },
  G1: {
    nom: 'Techniques Administratives',
    groupe: GROUPES.COMMERCIALE_ADMIN,
    matieres: [
      { code: 'techniques_administratives', nom: 'Techniques Administratives', coefficient: 5 },
      { code: 'droit', nom: 'Droit', coefficient: 2 },
      { code: 'compte_rendu_pv_+_rapport', nom: 'Compte Rendu PV + Rapport', coefficient: 3 },
      { code: 'comptabilite', nom: 'Comptabilité', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 3 },
      { code: 'economie', nom: 'Économie', coefficient: 3 },
      { code: 'etude_de_cas', nom: 'Étude De Cas', coefficient: 4 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
    ],
  },
  G2: {
    nom: 'Techniques Quantitatives de Gestion',
    groupe: GROUPES.COMMERCIALE_ADMIN,
    matieres: [
      { code: 'maths_appliquees', nom: 'Mathématiques Appliquées', coefficient: 3 },
      { code: 'droit', nom: 'Droit (TBAD-Finances publiques)', coefficient: 2 },
      { code: 'economie', nom: 'Économie', coefficient: 3 },
      { code: 'francais', nom: 'Français', coefficient: 2 },
      { code: 'etude_de_cas', nom: 'Étude de Cas', coefficient: 6 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
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
      { code: 'etude_de_cas', nom: 'Étude de Cas', coefficient: 6 },
      { code: 'lv1', nom: 'Anglais', coefficient: 2 },
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
