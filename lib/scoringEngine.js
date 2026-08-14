import { getMatieresBySerie } from './bacSeries';

export function calculerMoyenneCoefficientee(notes, matieres) {
  if (!matieres || matieres.length === 0) {
    throw new Error('Aucune matière/coefficient disponible pour cette série');
  }
  let sommePonderee = 0;
  let sommeCoefficients = 0;
  for (const matiere of matieres) {
    const note = notes[matiere.code];
    if (typeof note !== 'number' || Number.isNaN(note)) {
      throw new Error(`Note manquante ou invalide pour la matière "${matiere.nom ?? matiere.code}"`);
    }
    if (note < 0 || note > 20) {
      throw new Error(`Note hors intervalle [0, 20] pour "${matiere.nom ?? matiere.code}" : ${note}`);
    }
    sommePonderee += note * matiere.coefficient;
    sommeCoefficients += matiere.coefficient;
  }
  return Math.round((sommePonderee / sommeCoefficients) * 100) / 100;
}

/**
 * Normalise une entrée matieres_classement (array de codes "string", OU array
 * d'objets {code, coefficient}) vers le format attendu par
 * calculerMoyenneCoefficientee. Sans coefficient explicite -> poids égal (1).
 */
function normaliserMatieresClassement(entree) {
  if (!entree) return null;
  return entree.map((m) => (typeof m === 'string' ? { code: m, coefficient: 1 } : m));
}

/**
 * Calcule la MOYENNE DE CLASSEMENT officielle d'une filière (formule MESRS :
 * M = (m1*x + m2*y + m3*z) / (x+y+z), sur les 3 matières propres à la
 * filière et à la série du candidat) — PAS la moyenne générale de la série.
 * Retourne null si les notes nécessaires ne sont pas disponibles (matière
 * hors du formulaire standard de la série) ou si la filière n'a pas encore
 * de matieres_classement renseignées pour cette série (repli plus bas).
 */
export function calculerMoyenneClassementFiliere(notes, matieresClassementParSerie, codeSerie) {
  const matieres = normaliserMatieresClassement(matieresClassementParSerie?.[codeSerie]);
  if (!matieres) return null;
  try {
    return calculerMoyenneCoefficientee(notes, matieres);
  } catch {
    return null; // note d'une matière de classement absente du formulaire standard
  }
}

export function calculerTauxObtentionBourse(moyenne, configBourses) {
  const { seuilForte = 14, seuilMoyenne = 12 } = configBourses ?? {};
  let taux;
  if (moyenne >= seuilForte) taux = 90 + (moyenne - seuilForte) * 4;
  else if (moyenne >= seuilMoyenne) taux = 50 + ((moyenne - seuilMoyenne) / (seuilForte - seuilMoyenne)) * 40;
  else taux = 50 - (seuilMoyenne - moyenne) * 8;
  return Math.max(3, Math.min(98, Math.round(taux)));
}

export function evaluerEligibiliteBourse(moyenne, configBourses) {
  const { seuilForte = 14, seuilMoyenne = 12, nom, montantFcfa, description } = configBourses ?? {};
  const tauxObtention = calculerTauxObtentionBourse(moyenne, configBourses);
  const infosBourse = { nom: nom ?? null, montantFcfa: montantFcfa ?? null, description: description ?? null };
  if (moyenne >= seuilForte) {
    return { tauxObtention, niveau: 'Forte', message: "Votre profil correspond aux critères généralement retenus pour une bourse d'État.", ...infosBourse };
  }
  if (moyenne >= seuilMoyenne) {
    return { tauxObtention, niveau: 'Moyenne', message: "Une bourse ou un secours universitaire est possible selon les places disponibles dans votre filière.", ...infosBourse };
  }
  return { tauxObtention, niveau: 'Faible', message: "Avec ce niveau, l'obtention d'une bourse publique est peu probable cette année.", ...infosBourse };
}

/**
 * Classe les filières compatibles. Pour chaque filière :
 * - mode_entree === 'concours' : pas de taux calculé (le classement par
 *   moyenne ne s'applique pas), on le signale explicitement.
 * - matieresClassement dispo pour la série -> moyenne de classement précise
 *   (méthode officielle MESRS).
 * - sinon -> repli sur l'ancienne estimation générique (moyenne globale vs
 *   seuil_admission), clairement marquée comme approximative.
 */
export function classerFilieresCompatibles(etudiant, configFilieres) {
  const { codeSerie, moyenneGenerale, notes } = etudiant;

  return configFilieres
    .filter((f) => f.seriesEligibles.includes(codeSerie))
    .map((filiere) => {
      if (filiere.modeEntree === 'concours') {
        return { ...filiere, modeCalcul: 'concours', tauxAdmissibilite: null };
      }

      const moyenneClassement = calculerMoyenneClassementFiliere(notes, filiere.matieresClassement, codeSerie);

      if (moyenneClassement !== null) {
        const ecart = moyenneClassement - filiere.seuilAdmission;
        const taux = Math.max(5, Math.min(98, Math.round(50 + ecart * 5)));
        return { ...filiere, modeCalcul: 'precis', moyenneClassement, ecartAuSeuil: Math.round(ecart * 100) / 100, tauxAdmissibilite: taux };
      }

      const ecart = moyenneGenerale - filiere.seuilAdmission;
      const taux = Math.max(5, Math.min(98, Math.round(50 + ecart * 5)));
      return { ...filiere, modeCalcul: 'estimation', ecartAuSeuil: Math.round(ecart * 100) / 100, tauxAdmissibilite: taux };
    })
    .sort((a, b) => (b.tauxAdmissibilite ?? 0) - (a.tauxAdmissibilite ?? 0));
}

export function doitAfficherOrientationPrivee(eligibiliteBourse, filieresCompatibles, seuilTauxMinimum = 40) {
  const aucuneFiliereSolide = filieresCompatibles.every((f) => (f.tauxAdmissibilite ?? 0) < seuilTauxMinimum);
  return eligibiliteBourse.niveau === 'Faible' || filieresCompatibles.length === 0 || aucuneFiliereSolide;
}

export function calculerResultatComplet({ notes, codeSerie, matieres, configBourses, configFilieres }) {
  const moyenne = calculerMoyenneCoefficientee(notes, matieres);
  const eligibiliteBourse = evaluerEligibiliteBourse(moyenne, configBourses);
  const filieresCompatibles = classerFilieresCompatibles({ codeSerie, moyenneGenerale: moyenne, notes }, configFilieres);
  const afficherOrientationPrivee = doitAfficherOrientationPrivee(eligibiliteBourse, filieresCompatibles);

  return {
    moyenne,
    eligibiliteBourse,
    filieresCompatibles,
    afficherOrientationPrivee,
    teaser: {
      nombreFilieresCompatibles: filieresCompatibles.length,
      niveauEligibiliteBourse: eligibiliteBourse.niveau,
      tauxObtentionBourse: eligibiliteBourse.tauxObtention,
    },
  };
}
