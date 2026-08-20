import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { calculerResultatComplet } from '@/lib/scoringEngine';
import { getMatieresBySerie } from '@/lib/bacSeries';
import { estLimite, getClientIp } from '@/lib/rateLimit';

const schemaEntree = z.object({
 codeSerie: z.string().min(1).max(30),
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
    console.error('Erreur /api/score :', err);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Erreur interne. Merci de réessayer.' : `Erreur interne : ${err.message}` },
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

  const [{ data: configBourses }, { data: filieresBrutes }, { data: coefficientsDb }] = await Promise.all([
    supabaseAdmin.from('bourses').select('nom, seuil_forte, seuil_moyenne, montant_fcfa, description').limit(1).maybeSingle(),
    supabaseAdmin
      .from('filieres')
      .select(
        'id, nom, universite, etablissement, seuil_admission, quota_bourse, quota_aide, mode_entree, debouches, matieres_classement, filieres_series_eligibles(serie_code)'
      ),
    supabaseAdmin.from('matieres_coefficients').select('matiere_code, matiere_nom, coefficient').eq('serie_code', codeSerie),
  ]);

  // Les débouchés ne sont volontairement PAS exposés ici au-delà de leur
  // simple présence dans configFilieres — /api/score alimente
  // `resultat_complet`, qui n'est jamais renvoyé tel quel par /resultats
  // (teaser gratuit) : seul /rapport (payant) lit ce champ. Voir schema.sql
  // et app/resultats/[sessionId]/page.jsx pour la barrière réelle.
  const configFilieres = (filieresBrutes ?? []).map((f) => ({
    id: f.id,
    nom: f.nom,
    universite: f.universite,
    etablissement: f.etablissement,
    seuilAdmission: f.seuil_admission,
    quotaBourse: f.quota_bourse,
    quotaAide: f.quota_aide,
    modeEntree: f.mode_entree,
    debouches: f.debouches ?? [],
    matieresClassement: f.matieres_classement ?? null,
    seriesEligibles: (f.filieres_series_eligibles ?? []).map((s) => s.serie_code),
  }));

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
        ? { seuilForte: configBourses.seuil_forte, seuilMoyenne: configBourses.seuil_moyenne, nom: configBourses.nom, montantFcfa: configBourses.montant_fcfa, description: configBourses.description }
        : undefined,
      configFilieres,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const { data: etudiantRow, error: erreurEtudiant } = await supabaseAdmin
    .from('etudiants')
    .insert({ nom: etudiant.nom ?? null, prenom: etudiant.prenom ?? null, telephone: etudiant.telephone ?? null, email: etudiant.email ?? null, serie_code: codeSerie, notes, moyenne: resultat.moyenne })
    .select('id')
    .single();

  if (erreurEtudiant) {
    console.error('Erreur insertion etudiants :', erreurEtudiant);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Erreur lors de l\u2019enregistrement' : `Erreur Supabase (etudiants) : ${erreurEtudiant.message}` }, { status: 500 });
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
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Erreur lors de l\u2019enregistrement' : `Erreur Supabase (sessions_test) : ${erreurSession.message}` }, { status: 500 });
  }

  return NextResponse.json({ sessionId: session.id });
}
