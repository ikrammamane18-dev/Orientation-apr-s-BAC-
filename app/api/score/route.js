import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { calculerResultatComplet } from '@/lib/scoringEngine';
import { getMatieresBySerie } from '@/lib/bacSeries';
import { estLimite, getClientIp } from '@/lib/rateLimit';

/**
 * app/api/score/route.js
 *
 * Étape 1 → calcule le résultat côté serveur (source de vérité, jamais
 * confiance dans un calcul fait côté client) et persiste une session_test.
 */

// Validation stricte de la forme des données entrantes : on ne fait jamais
// confiance à ce qui vient du client, même si le formulaire le valide déjà.
const schemaEntree = z.object({
  codeSerie: z.string().min(1).max(10),
  notes: z.record(z.string(), z.number().min(0).max(20)),
  etudiant: z
    .object({
      nom: z.string().max(100).optional(),
      prenom: z.string().max(100).optional(),
      telephone: z.string().max(20).optional(),
      email: z.string().email().max(150).optional(),
    })
    .optional(),
});

export async function POST(request) {
  try {
    return await handlePost(request);
  } catch (err) {
    // Filet de sécurité : sans ça, une exception inattendue (ex: Supabase
    // injoignable) renvoie un 500 vide et le client ne voit qu'un message
    // générique. On journalise toujours côté serveur, et on ne renvoie le
    // détail au client qu'en développement (pas en production, pour ne pas
    // exposer de détails d'infrastructure à un visiteur).
    console.error('Erreur /api/score :', err);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'production'
            ? 'Erreur interne. Merci de réessayer.'
            : `Erreur interne : ${err.message}`,
      },
      { status: 500 }
    );
  }
}

async function handlePost(request) {
  const ip = getClientIp(request);
  if (estLimite(`score:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes, réessayez dans une minute.' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = schemaEntree.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 });
  }
  const { codeSerie, notes, etudiant = {} } = parsed.data;

  // Récupère les référentiels depuis Supabase (configurables en admin)
  // plutôt que depuis lib/bacSeries.js en dur, dès que ces tables sont peuplées.
  const [{ data: configBourses }, { data: filieresBrutes }, { data: coefficientsDb }] = await Promise.all([
    supabaseAdmin.from('bourses').select('nom, seuil_forte, seuil_moyenne, montant_fcfa, description').limit(1).maybeSingle(),
    supabaseAdmin
      .from('filieres')
      .select(
        'id, nom, universite, etablissement, seuil_admission, quota_indicatif, filieres_series_eligibles(serie_code)'
      ),
    supabaseAdmin.from('matieres_coefficients').select('matiere_code, matiere_nom, coefficient').eq('serie_code', codeSerie),
  ]);

  const configFilieres = (filieresBrutes ?? []).map((f) => ({
    ...f,
    seuilAdmission: f.seuil_admission,
    seriesEligibles: (f.filieres_series_eligibles ?? []).map((s) => s.serie_code),
  }));

  // La table matieres_coefficients (éditable depuis /admin/coefficients) fait
  // foi dès qu'elle contient des lignes pour cette série. Tant qu'elle n'a pas
  // encore été peuplée, on retombe sur lib/bacSeries.js pour ne rien casser.
  const matieres =
    coefficientsDb && coefficientsDb.length > 0
      ? coefficientsDb.map((m) => ({ code: m.matiere_code, nom: m.matiere_nom, coefficient: m.coefficient }))
      : getMatieresBySerie(codeSerie);

  let resultat;
  try {
    resultat = calculerResultatComplet({
      notes,
      codeSerie,
      matieres,
      configBourses: configBourses
        ? {
            seuilForte: configBourses.seuil_forte,
            seuilMoyenne: configBourses.seuil_moyenne,
            nom: configBourses.nom,
            montantFcfa: configBourses.montant_fcfa,
            description: configBourses.description,
          }
        : undefined,
      configFilieres,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const { data: etudiantRow, error: erreurEtudiant } = await supabaseAdmin
    .from('etudiants')
    .insert({
      nom: etudiant.nom ?? null,
      prenom: etudiant.prenom ?? null,
      telephone: etudiant.telephone ?? null,
      email: etudiant.email ?? null,
      serie_code: codeSerie,
      notes,
      moyenne: resultat.moyenne,
    })
    .select('id')
    .single();

  if (erreurEtudiant) {
    console.error('Erreur insertion etudiants :', erreurEtudiant);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'production'
            ? 'Erreur lors de l’enregistrement'
            : `Erreur Supabase (table "etudiants") : ${erreurEtudiant.message}`,
      },
      { status: 500 }
    );
  }

  const { data: session, error: erreurSession } = await supabaseAdmin
    .from('sessions_test')
    .insert({
      etudiant_id: etudiantRow.id,
      niveau_eligibilite_bourse: resultat.eligibiliteBourse.niveau,
      taux_obtention_bourse: resultat.eligibiliteBourse.tauxObtention,
      nombre_filieres_compatibles: resultat.teaser.nombreFilieresCompatibles,
      resultat_complet: resultat,
    })
    .select('id')
    .single();

  if (erreurSession) {
    console.error('Erreur insertion sessions_test :', erreurSession);
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'production'
            ? 'Erreur lors de l’enregistrement'
            : `Erreur Supabase (table "sessions_test") : ${erreurSession.message}`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ sessionId: session.id });
}
