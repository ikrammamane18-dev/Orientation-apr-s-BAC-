import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import {
  initierPaiementKkiapay,
  genererInstructionsPaiementManuel,
  getModePaiementActif,
  PRIX_RAPPORT_FCFA,
} from '@/lib/payment';
import { estLimite, getClientIp } from '@/lib/rateLimit';

/**
 * app/api/payment/initiate/route.js
 *
 * Étape 3 : crée une transaction `en_attente` puis renvoie au client soit
 * les paramètres du widget KKiaPay, soit les instructions de paiement manuel
 * — selon PAYMENT_MODE (voir lib/payment.js pour le détail des compromis).
 *
 * Le montant N'EST PAS reçu du client : il vient uniquement de
 * PRIX_RAPPORT_FCFA (lib/payment.js). Un montant envoyé par le navigateur
 * pourrait être modifié par un utilisateur malveillant avant l'envoi
 * (ex: passer 325 à 1 via les outils de développement) — la seule source de
 * vérité pour le prix doit être le serveur.
 */

const schemaEntree = z.object({ sessionId: z.string().uuid() });

export async function POST(request) {
  const ip = getClientIp(request);
  if (estLimite(`payment-initiate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives, réessayez plus tard.' }, { status: 429 });
  }

  const parsed = schemaEntree.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const { sessionId } = parsed.data;

  // On vérifie que la session existe réellement avant de créer une transaction.
  const { data: session } = await supabaseAdmin
    .from('sessions_test')
    .select('id')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
  }

  const { data: transaction, error } = await supabaseAdmin
    .from('transactions')
    .insert({ session_test_id: sessionId, montant_fcfa: PRIX_RAPPORT_FCFA, statut: 'en_attente' })
    .select('id')
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Impossible de créer la transaction' }, { status: 500 });
  }

  const mode = getModePaiementActif();

  if (mode === 'kkiapay') {
    const params = await initierPaiementKkiapay({ sessionTestId: transaction.id });
    return NextResponse.json({ transactionId: transaction.id, ...params });
  }

  const instructions = genererInstructionsPaiementManuel();
  return NextResponse.json({ transactionId: transaction.id, ...instructions });
}
