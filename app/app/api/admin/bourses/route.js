import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estSessionAdminValide } from '@/lib/adminAuth';

/**
 * app/api/admin/bourses/route.js
 *
 * Le moteur de calcul (lib/scoringEngine.js, via /api/score) lit la PREMIÈRE
 * ligne de la table `bourses` comme seuils de référence. Cette route
 * maintient donc un enregistrement canonique unique plutôt qu'une liste :
 * si aucune ligne n'existe, on en crée une ; sinon on met à jour la première.
 */

const schemaEntree = z.object({
  nom: z.string().min(1).max(150),
  seuilForte: z.number().min(0).max(20),
  seuilMoyenne: z.number().min(0).max(20),
  montantFcfa: z.number().int().min(0).optional(),
  description: z.string().max(500).optional(),
});

export async function POST(request) {
  if (!estSessionAdminValide(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const parsed = schemaEntree.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 });
  }
  const { nom, seuilForte, seuilMoyenne, montantFcfa, description } = parsed.data;

  if (seuilMoyenne >= seuilForte) {
    return NextResponse.json({ error: 'Le seuil "Moyenne" doit être inférieur au seuil "Forte"' }, { status: 400 });
  }

  const { data: existante } = await supabaseAdmin.from('bourses').select('id').limit(1).maybeSingle();

  const valeurs = {
    nom,
    type: 'bourse',
    seuil_forte: seuilForte,
    seuil_moyenne: seuilMoyenne,
    montant_fcfa: montantFcfa ?? null,
    description: description ?? null,
  };

  const { error } = existante
    ? await supabaseAdmin.from('bourses').update(valeurs).eq('id', existante.id)
    : await supabaseAdmin.from('bourses').insert(valeurs);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: `Erreur : ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
