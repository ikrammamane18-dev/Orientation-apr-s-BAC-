import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estSessionAdminValide } from '@/lib/adminAuth';

/**
 * app/api/admin/coefficients/route.js
 *
 * Enregistre l'ensemble des coefficients d'UNE série en une fois : on
 * remplace toutes les lignes existantes de `matieres_coefficients` pour
 * cette série par le nouvel ensemble reçu (plus simple et plus sûr qu'un
 * diff ligne par ligne — la série entière est éditée comme un tout depuis
 * /admin/coefficients).
 */

const schemaEntree = z.object({
 codeSerie: z.string().min(1).max(30),
  serieNom: z.string().min(1).max(150),
  serieGroupe: z.string().min(1).max(100),
  matieres: z
    .array(
      z.object({
        code: z.string().min(1).max(50),
        nom: z.string().min(1).max(150),
        coefficient: z.number().min(0.5).max(20),
      })
    )
    .min(1),
});

export async function POST(request) {
  if (!estSessionAdminValide(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const parsed = schemaEntree.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 });
  }
  const { serieCode, serieNom, serieGroupe, matieres } = parsed.data;

  // 1. La série elle-même (upsert : crée si absente, sinon ne change rien de gênant)
  const { error: erreurSerie } = await supabaseAdmin
    .from('series_bac')
    .upsert({ code: serieCode, nom: serieNom, groupe: serieGroupe }, { onConflict: 'code' });

  if (erreurSerie) {
    console.error(erreurSerie);
    return NextResponse.json({ error: `Erreur série : ${erreurSerie.message}` }, { status: 500 });
  }

  // 2. Remplacement complet des coefficients de cette série
  const { error: erreurSuppression } = await supabaseAdmin
    .from('matieres_coefficients')
    .delete()
    .eq('serie_code', serieCode);

  if (erreurSuppression) {
    console.error(erreurSuppression);
    return NextResponse.json({ error: `Erreur suppression : ${erreurSuppression.message}` }, { status: 500 });
  }

  const { error: erreurInsertion } = await supabaseAdmin.from('matieres_coefficients').insert(
    matieres.map((m) => ({
      serie_code: serieCode,
      matiere_code: m.code,
      matiere_nom: m.nom,
      coefficient: m.coefficient,
    }))
  );

  if (erreurInsertion) {
    console.error(erreurInsertion);
    return NextResponse.json({ error: `Erreur enregistrement : ${erreurInsertion.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
