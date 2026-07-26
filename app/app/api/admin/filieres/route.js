import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estSessionAdminValide } from '@/lib/adminAuth';

const schemaCreation = z.object({
  nom: z.string().min(1).max(200),
  universite: z.string().min(1).max(100),
  etablissement: z.string().max(150).optional(),
  seuilAdmission: z.number().min(0).max(20),
  quotaIndicatif: z.number().int().min(0).optional(),
  seriesEligibles: z.array(z.string().min(1).max(10)).min(1),
});

export async function POST(request) {
  if (!estSessionAdminValide(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const parsed = schemaCreation.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 });
  }
  const { nom, universite, etablissement, seuilAdmission, quotaIndicatif, seriesEligibles } = parsed.data;

  const { data: filiere, error: erreurFiliere } = await supabaseAdmin
    .from('filieres')
    .insert({
      nom,
      universite,
      etablissement: etablissement ?? null,
      seuil_admission: seuilAdmission,
      quota_indicatif: quotaIndicatif ?? null,
    })
    .select('id')
    .single();

  if (erreurFiliere) {
    console.error(erreurFiliere);
    return NextResponse.json({ error: `Erreur : ${erreurFiliere.message}` }, { status: 500 });
  }

  const { error: erreurEligibilites } = await supabaseAdmin
    .from('filieres_series_eligibles')
    .insert(seriesEligibles.map((serie_code) => ({ filiere_id: filiere.id, serie_code })));

  if (erreurEligibilites) {
    console.error(erreurEligibilites);
    return NextResponse.json({ error: `Erreur éligibilités : ${erreurEligibilites.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: filiere.id });
}

const schemaSuppression = z.object({ id: z.string().uuid() });

export async function DELETE(request) {
  if (!estSessionAdminValide(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const parsed = schemaSuppression.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  // La suppression en cascade (filieres_series_eligibles) est gérée par la
  // contrainte "on delete cascade" définie dans database/schema.sql.
  const { error } = await supabaseAdmin.from('filieres').delete().eq('id', parsed.data.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: `Erreur : ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
