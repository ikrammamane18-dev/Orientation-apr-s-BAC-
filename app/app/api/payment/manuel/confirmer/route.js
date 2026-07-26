import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estSessionAdminValide } from '@/lib/adminAuth';

/**
 * app/api/payment/manuel/confirmer/route.js
 *
 * Utilisé uniquement en PAYMENT_MODE=manuel (voir lib/payment.js) : un
 * administrateur, après avoir vérifié à l'œil une capture d'écran de
 * paiement reçue sur WhatsApp, valide la transaction depuis /admin.
 *
 * Protégé par le même cookie de session que le reste du dashboard admin
 * (voir middleware.js) — revérifié ici explicitement car cette route
 * modifie des données sensibles (débloque un rapport payant).
 */

const schemaEntree = z.object({ transactionId: z.string().uuid() });

export async function POST(request) {
  if (!estSessionAdminValide(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const parsed = schemaEntree.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('transactions')
    .update({ statut: 'validee', validee_at: new Date().toISOString() })
    .eq('id', parsed.data.transactionId)
    .eq('statut', 'en_attente');

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
