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
  TECHNIQUE_DT: 'Technique Professionnel (DT)',
  TECHNIQUE_DEAT: 'Technique Agricole (DEAT)',
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
  // ⚠️ DEAT : le guide MESRS ne nomme jamais les 3 matières exactes de
// l'épreuve écrite DEAT ("Pour DEAT : prendre en compte toutes les trois
// (03) matières écrites") — elles varient par spécialité et ne sont
// publiées nulle part dans ce document. Formulaire générique en attendant.
const MATIERES_DEAT_GENERIQUES = [
  { code: 'deat_ecrit_1', nom: 'Matière technique 1 (épreuve écrite du DEAT)', coefficient: 1 },
  { code: 'deat_ecrit_2', nom: 'Matière technique 2 (épreuve écrite du DEAT)', coefficient: 1 },
  { code: 'deat_ecrit_3', nom: 'Matière technique 3 (épreuve écrite du DEAT)', coefficient: 1 },
];

  DEAT_PV: { nom: 'DEAT - Production Végétale', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },
  DEAT_PA: { nom: 'DEAT - Production Animale', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },
  DEAT_AER: { nom: 'DEAT - Aménagement et Équipement Rural', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },
  DEAT_FORESTERIE: { nom: 'DEAT - Foresterie', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },
  DEAT_NUTRITION: { nom: 'DEAT - Nutrition et Technologie Alimentaire', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },
  DEAT_PECHE: { nom: 'DEAT - Pêche et Aquaculture', groupe: GROUPES.TECHNIQUE_DEAT, matieres: MATIERES_DEAT_GENERIQUES },

  // DT : matières reprises du guide où elles sont nommées. Poids égal (1/1/1)
  // par défaut — le guide ne publie pas de coefficients précis pour ces
  // filières techniques, comme déjà signalé pour les séries classiques.
  DT_BTP: { nom: 'DT - Bâtiment et Travaux Publics', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_rdm', nom: 'Résistance des Matériaux (RDM)', coefficient: 1 },
  ]},
  DT_OG: { nom: 'DT - Ouvrages Généraux', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_technologie', nom: 'Technologie', coefficient: 1 },
  ]},
  DT_DPB: { nom: 'DT - Dessin de Projets Bâtiments', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_rdm', nom: 'Résistance des Matériaux (RDM)', coefficient: 1 },
  ]},
  DT_ELECTRICITE: { nom: 'DT - Électricité', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_electrotech', nom: 'Électrotechnique', coefficient: 1 },
  ]},
  DT_ELECTROTECH: { nom: 'DT - Électrotechnique Appliquée', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_electrotech', nom: 'Électrotechnique', coefficient: 1 },
  ]},
  DT_MA: { nom: 'DT - Mécanique Automobile', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_techno_auto', nom: 'Technologie Automobile', coefficient: 1 },
  ]},
  DT_FM: { nom: 'DT - Fabrication Mécanique', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_construction_meca', nom: 'Construction Mécanique', coefficient: 1 },
  ]},
  DT_FC: { nom: 'DT - Froid et Climatisation', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_technique_froid', nom: 'Technique du Froid', coefficient: 1 },
  ]},
  DT_EAP: { nom: 'DT - Électronique Appliquée', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_sciences_appliquees', nom: 'Sciences Appliquées', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_etude_electronique', nom: 'Étude Électronique', coefficient: 1 },
  ]},
  DT_COM: { nom: 'DT - Comptabilité et Mercatique', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_compta_mercatique', nom: 'Techniques Comptables et Mercatique', coefficient: 1 },
    { code: 'dt_organisation', nom: 'Organisation et Administration des Ressources', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
  ]},
  DT_IMI: { nom: 'DT - Informatique et Maintenance Informatique', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_maths_appliquees', nom: 'Mathématiques Appliquées', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_systemes_info', nom: 'Technologie des Systèmes Informatiques', coefficient: 1 },
  ]},
  DT_DWM: { nom: 'DT - Développement Web et Multimédia', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_maths_appliquees', nom: 'Mathématiques Appliquées', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_sites_web', nom: 'Sites et Applications Web', coefficient: 1 },
  ]},
  DT_PM: { nom: 'DT - Production Multimédia', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_projet_info', nom: 'Projet Informatique', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_montage', nom: 'Montage', coefficient: 1 },
  ]},
  DT_TOURISME: { nom: 'DT - Tourisme', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'lv1', nom: 'Anglais', coefficient: 1 },
    { code: 'dt_mercatique_tourisme', nom: 'Mercatique du Tourisme', coefficient: 1 },
    { code: 'dt_legislation_tourisme', nom: 'Législation du Tourisme', coefficient: 1 },
  ]},
  DT_HR: { nom: 'DT - Hôtellerie-Restauration', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_technique_bar_resto', nom: 'Technique Bar-Restaurant', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'histoire_geo', nom: 'Histoire - Géographie', coefficient: 1 },
  ]},
  DT_EFS: { nom: 'DT - Économie Familiale et Sociale', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_education_sante', nom: 'Éducation Santé', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_puericulture', nom: 'Puériculture', coefficient: 1 },
  ]},
  DT_ARTS_TEXTILE: { nom: 'DT - Arts Textile', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_dissertation_francaise', nom: 'Dissertation Française', coefficient: 1 },
    { code: 'dt_histoire_art', nom: "Histoire de l'Art", coefficient: 1 },
    { code: 'dt_art_applique', nom: 'Art Appliqué', coefficient: 1 },
  ]},
  DT_COM_GRAPHIQUE: { nom: 'DT - Communication Graphique', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_dissertation_francaise', nom: 'Dissertation Française', coefficient: 1 },
    { code: 'dt_histoire_art', nom: "Histoire de l'Art", coefficient: 1 },
    { code: 'dt_art_applique', nom: 'Art Appliqué', coefficient: 1 },
  ]},
  DT_MUSIQUE: { nom: 'DT - Musique (Piano/Guitare)', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_harmonie', nom: 'Harmonie', coefficient: 1 },
    { code: 'dt_theorie_musicale', nom: 'Théorie Musicale', coefficient: 1 },
    { code: 'dt_histoire_musique', nom: 'Histoire de la Musique et Organologie', coefficient: 1 },
  ]},
  DT_MAO: { nom: 'DT - Musique Assistée par Ordinateur', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'dt_harmonie', nom: 'Harmonie', coefficient: 1 },
    { code: 'dt_theorie_musicale', nom: 'Théorie Musicale', coefficient: 1 },
    { code: 'dt_mao', nom: 'Musique Assistée par Ordinateur', coefficient: 1 },
  ]},
  DT_CEMS: { nom: 'DT - Conduite et Entretien des Matériels et Systèmes', groupe: GROUPES.TECHNIQUE_DT, matieres: [
    { code: 'maths', nom: 'Mathématiques', coefficient: 1 },
    { code: 'francais', nom: 'Français', coefficient: 1 },
    { code: 'dt_construction_meca', nom: 'Construction Mécanique', coefficient: 1 },
  ]},
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
