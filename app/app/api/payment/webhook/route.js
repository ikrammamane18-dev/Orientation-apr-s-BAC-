import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { verifierSecretWebhookKkiapay } from '@/lib/payment';

/**
 * app/api/payment/webhook/route.js
 *
 * Reçoit la confirmation de paiement envoyée par KKiaPay.
 *
 * Format réel du payload (docs.kkiapay.me/v1/tableau-de-bord/webhook) :
 *   { transactionId, isPaymentSucces, account, method, amount, fees,
 *     partnerId, performedAt, event: "transaction.success" | "transaction.failed" }
 * `partnerId` correspond à la donnée ("data") que nous transmettons nous-mêmes
 * au widget lors de l'initiation (voir lib/payment.js → reference) : c'est
 * l'identifiant de NOTRE transaction, à ne pas confondre avec `transactionId`
 * qui est l'identifiant interne de KKiaPay.
 * ⚠️ À reconfirmer sur un vrai paiement en mode sandbox avant mise en
 * production : la documentation publique ne détaille pas explicitement à
 * 100% la correspondance data→partnerId, donc vérifiez le payload réel reçu
 * (loggez-le une fois en sandbox) avant de vous y fier pour de l'argent réel.
 *
 * ⚠️ SÉCURITÉ CRITIQUE : sans vérification du secret, n'importe qui pourrait
 * appeler cette URL directement (elle est publique par nature) et prétendre
 * avoir payé pour débloquer un rapport gratuitement.
 *
 * KKiaPay attend un code 2xx rapide pour accuser réception (sinon il retente
 * jusqu'à 5 fois) : on répond donc vite, après avoir fait le nécessaire.
 */
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
  console.log('Webhook KKiaPay reçu :', JSON.stringify(evenement)); // utile pour confirmer le format réel en sandbox

  const { partnerId, isPaymentSucces, method, amount } = evenement;

  if (!partnerId) {
    console.error('Webhook KKiaPay sans partnerId — impossible de réconcilier la transaction');
    return NextResponse.json({ ok: true }); // on accuse quand même réception (2xx) pour éviter les 5 tentatives de retry
  }

  if (!isPaymentSucces) {
    await supabaseAdmin.from('transactions').update({ statut: 'echouee' }).eq('id', partnerId);
    return NextResponse.json({ ok: true });
  }

  // Vérification de cohérence supplémentaire (défense en profondeur) : le
  // montant reçu doit correspondre à celui enregistré à la création de la
  // transaction — n'empêche pas de valider, mais permet de repérer une
  // anomalie dans les journaux.
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
    .eq('statut', 'en_attente'); // évite de re-traiter deux fois le même webhook (idempotence)

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
