/**
 * lib/scoringEngine.js
 *
 * Logique métier pure (aucun accès DB ici, aucune dépendance React) :
 * - calcul de la moyenne générale coefficientée
 * - estimation qualitative de l'éligibilité à une bourse DBSU
 * - classement des filières publiques compatibles avec taux d'admissibilité estimé
 * - décision d'affichage de l'encadré "orientation privé"
 *
 * ⚠️ Les seuils utilisés ici (SEUILS_BOURSE, marge de tolérance des filières)
 * sont des valeurs de départ raisonnables mais DOIVENT être alignées sur les
 * critères réels du MESRS / DBSU. Dans cette architecture, ces seuils sont
 * volontairement injectés en paramètre (voir `configBourses`, `configFilieres`)
 * plutôt qu'en dur, pour pouvoir être pilotés depuis le Dashboard Admin sans
 * toucher au code.
 */

import { getMatieresBySerie } from './bacSeries';

/**
 * @param {Record<string, number>} notes - { code_matiere: note_sur_20 }
 * @param {Array<{code: string, nom?: string, coefficient: number}>} matieres -
 *   la liste des matières et coefficients à utiliser pour CETTE série. Passée
 *   en paramètre plutôt que recalculée en interne : /api/score peut ainsi
 *   fournir les coefficients validés en base (table `matieres_coefficients`,
 *   éditable depuis /admin/coefficients) et ne retomber sur lib/bacSeries.js
 *   que si la base n'a pas encore été peuplée pour cette série.
 * @returns {number} moyenne générale coefficientée, arrondie à 2 décimales
 */
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
 * Détail du calcul, matière par matière — utilisé dans le rapport payant pour
 * que l'étudiant voie exactement comment sa moyenne a été obtenue (pas juste
 * le résultat final). "Tout ce qu'il y a à débloquer" inclut cette transparence.
 */
export function calculerDetailMoyenne(notes, matieres) {
  return matieres.map((matiere) => ({
    code: matiere.code,
    nom: matiere.nom ?? matiere.code,
    note: notes[matiere.code],
    coefficient: matiere.coefficient,
    contribution: Math.round(notes[matiere.code] * matiere.coefficient * 100) / 100,
  }));
}

/**
 * Repli pratique : recalcule à partir du référentiel statique lib/bacSeries.js
 * (utilisé par /api/score uniquement si la table `matieres_coefficients` n'a
 * pas encore de ligne pour la série demandée).
 */
export function calculerMoyenneDepuisReferentielStatique(notes, codeSerie) {
  return calculerMoyenneCoefficientee(notes, getMatieresBySerie(codeSerie));
}

/**
 * Calcule un taux de pourcentage estimatif d'obtention d'une bourse d'État,
 * à partir de la moyenne et des deux seuils indicatifs (configurables en admin).
 *
 * Logique volontairement simple et explicable (pas de boîte noire) :
 * - au seuil "Moyenne"  → 50%
 * - au seuil "Forte"    → 90%
 * - interpolation linéaire entre les deux
 * - au-delà de "Forte"  → progression plus lente jusqu'à un plafond de 98%
 * - en-dessous de "Moyenne" → chute plus rapide jusqu'à un plancher de 3%
 * On ne promet jamais 0% ni 100% : l'admission dépend aussi de critères que
 * ce simulateur ne connaît pas (quotas, dossiers sociaux, autres candidats).
 */
export function calculerTauxObtentionBourse(moyenne, configBourses) {
  const { seuilForte = 14, seuilMoyenne = 12 } = configBourses ?? {};

  let taux;
  if (moyenne >= seuilForte) {
    taux = 90 + (moyenne - seuilForte) * 4;
  } else if (moyenne >= seuilMoyenne) {
    const proportion = (moyenne - seuilMoyenne) / (seuilForte - seuilMoyenne);
    taux = 50 + proportion * 40;
  } else {
    taux = 50 - (seuilMoyenne - moyenne) * 8;
  }

  return Math.max(3, Math.min(98, Math.round(taux)));
}

/**
 * Détermine l'éligibilité à une bourse d'État (DBSU) : un taux de pourcentage
 * (l'information la plus parlante pour l'utilisateur) accompagné d'un niveau
 * qualitatif et d'un message, pour l'habillage visuel.
 * `configBourses` vient de la table `bourses` (éditable en admin), avec la forme :
 *   { seuilForte: 14, seuilMoyenne: 12 }  (exemple)
 */
export function evaluerEligibiliteBourse(moyenne, configBourses) {
  const { seuilForte = 14, seuilMoyenne = 12, nom, montantFcfa, description } = configBourses ?? {};
  const tauxObtention = calculerTauxObtentionBourse(moyenne, configBourses);
  const infosBourse = { nom: nom ?? null, montantFcfa: montantFcfa ?? null, description: description ?? null };

  if (moyenne >= seuilForte) {
    return {
      tauxObtention,
      niveau: 'Forte',
      message: "Votre profil correspond aux critères généralement retenus pour une bourse d'État.",
      ...infosBourse,
    };
  }
  if (moyenne >= seuilMoyenne) {
    return {
      tauxObtention,
      niveau: 'Moyenne',
      message: "Une bourse ou un secours universitaire est possible selon les places disponibles dans votre filière.",
      ...infosBourse,
    };
  }
  return {
    tauxObtention,
    niveau: 'Faible',
    message: "Avec ce niveau, l'obtention d'une bourse publique est peu probable cette année.",
    ...infosBourse,
  };
}

/**
 * Classe les filières publiques compatibles avec la série et la moyenne de l'étudiant.
 *
 * @param {Object} etudiant - { codeSerie, moyenne }
 * @param {Array} configFilieres - lignes de la table `filieres` jointes à `filieres_series_eligibles`
 *   Forme attendue par élément :
 *   { id, nom, universite, seriesEligibles: ['C','D'], seuilAdmission: 12, quotaIndicatif: 40 }
 * @returns {Array} filières triées par compatibilité décroissante, avec un tauxAdmissibilite estimé (0-100)
 */
export function classerFilieresCompatibles(etudiant, configFilieres) {
  const { codeSerie, moyenne } = etudiant;

  return configFilieres
    .filter((filiere) => filiere.seriesEligibles.includes(codeSerie))
    .map((filiere) => {
      const ecart = moyenne - filiere.seuilAdmission;
      // Estimation simple et transparente : 50% de base au seuil, +5 points par point d'écart au-dessus,
      // plafonnée à 98% (on ne promet jamais 100%, l'admission dépend aussi du quota et des autres candidats).
      const tauxAdmissibilite = Math.max(5, Math.min(98, Math.round(50 + ecart * 5)));

      return {
        ...filiere,
        ecartAuSeuil: Math.round(ecart * 100) / 100,
        tauxAdmissibilite,
      };
    })
    .sort((a, b) => b.tauxAdmissibilite - a.tauxAdmissibilite);
}

/**
 * Décide si l'encadré "orientation privé" doit s'afficher.
 * Règle : bourse faible OU aucune filière publique avec un taux d'admissibilité correct.
 */
export function doitAfficherOrientationPrivee(eligibiliteBourse, filieresCompatibles, seuilTauxMinimum = 40) {
  const aucuneFiliereSolide = filieresCompatibles.every((f) => f.tauxAdmissibilite < seuilTauxMinimum);
  return eligibiliteBourse.niveau === 'Faible' || filieresCompatibles.length === 0 || aucuneFiliereSolide;
}

/**
 * Fonction d'orchestration : à appeler depuis la Route Handler /api/score.
 * @param {Array} matieres - matières/coefficients à utiliser pour cette série
 *   (voir calculerMoyenneCoefficientee ci-dessus pour l'origine de cette liste)
 */
export function calculerResultatComplet({ notes, codeSerie, matieres, configBourses, configFilieres }) {
  const moyenne = calculerMoyenneCoefficientee(notes, matieres);
  const eligibiliteBourse = evaluerEligibiliteBourse(moyenne, configBourses);
  const filieresCompatibles = classerFilieresCompatibles({ codeSerie, moyenne }, configFilieres);
  const afficherOrientationPrivee = doitAfficherOrientationPrivee(eligibiliteBourse, filieresCompatibles);

  return {
    moyenne,
    eligibiliteBourse,
    filieresCompatibles,
    afficherOrientationPrivee,
    // Champs utilisés uniquement pour le teaser gratuit (§2 du cahier des charges)
    teaser: {
      nombreFilieresCompatibles: filieresCompatibles.length,
      niveauEligibiliteBourse: eligibiliteBourse.niveau,
      tauxObtentionBourse: eligibiliteBourse.tauxObtention,
    },
  };
}
