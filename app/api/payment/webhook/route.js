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

  const { partnerId, isPaymentSucces, method, amount } = evenement;

  if (!partnerId) {
    console.error('Webhook KKiaPay sans partnerId — impossible de réconcilier la transaction');
    return NextResponse.json({ ok: true });
  }

  if (!isPaymentSucces) {
    await supabaseAdmin.from('transactions').update({ statut: 'echouee' }).eq('id', partnerId);
    return NextResponse.json({ ok: true });
  }

  const { data: transactionExistante } = await supabaseAdmin
    .from('transactions')
    .select('montant_fcfa')
    .eq('id', partnerId)
    .maybeSingle();

  if (transactionExistante && transactionExistante.montant_fcfa !== amount) {
    console.warn(
      `Webhook KKiaPay : montant reçu (${amount}) différent du montant attendu (${transactionExistante.montant_fcfa}) pour la transaction ${partnerId}`
    );
  }

  const { error } = await supabaseAdmin
    .from('transactions')
    .update({ statut: 'validee', validee_at: new Date().toISOString(), moyen_paiement: method ?? null })
    .eq('id', partnerId)
    .eq('statut', 'en_attente');

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
