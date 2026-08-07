import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { verifierSecretWebhookKkiapay } from '@/lib/payment';

export async function POST(request) {
  const secretRecu = request.headers.get('x-kkiapay-secret');

  let secretValide = false;
  try {
    secretValide = verifierSecretWebhookKkiapay(secretRecu);
  } catch (err) {
    console.error('Erreur de vérification du webhook KKiaPay', err);
  }

  if (!secretValide) {
    console.warn('Webhook paiement rejeté : secret invalide ou absent');
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const evenement = await request.json();
  console.log('Webhook KKiaPay reçu :', JSON.stringify(evenement));

  // Confirmé sur un vrai paiement sandbox le 07/08 : c'est "stateData" qui
  // porte notre référence (transactions.id), pas "partnerId" (qui arrive
  // vide). "stateData" correspond au champ "data" qu'on transmet au widget
  // dans PaywallTeaser.jsx (data: donneesPaiement.reference).
  const { stateData: reference, isPaymentSucces, method, amount } = evenement;

  if (!reference) {
    console.error('Webhook KKiaPay sans stateData — impossible de réconcilier la transaction');
    return NextResponse.json({ ok: true });
  }

  if (!isPaymentSucces) {
    await supabaseAdmin.from('transactions').update({ statut: 'echouee' }).eq('id', reference);
    return NextResponse.json({ ok: true });
  }

  const { data: transactionExistante } = await supabaseAdmin
    .from('transactions')
    .select('montant_fcfa')
    .eq('id', reference)
    .maybeSingle();

  if (transactionExistante && transactionExistante.montant_fcfa !== amount) {
    console.warn(
      `Webhook KKiaPay : montant reçu (${amount}) différent du montant attendu (${transactionExistante.montant_fcfa}) pour la transaction ${reference}`
    );
  }

  const { error } = await supabaseAdmin
    .from('transactions')
    .update({ statut: 'validee', validee_at: new Date().toISOString(), moyen_paiement: method ?? null })
    .eq('id', reference)
    .eq('statut', 'en_attente');

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
