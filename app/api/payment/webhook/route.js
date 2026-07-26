import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// 1. Redirection du navigateur du client après le paiement (requête GET de Kkiapay)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const customData = searchParams.get('data') || searchParams.get('sessionId');

  if (customData) {
    // Si on a l'ID de session, on enregistre ou valide la transaction dans Supabase
    if (transactionId) {
      await supabaseAdmin.from('transactions').upsert({
        session_id: customData,
        transaction_id: transactionId,
        statut: 'validee',
        date_paiement: new Date().toISOString(),
      }, { onConflict: 'transaction_id' });
    }

    // REDIRECTION REUSSIE VERS LE RAPPORT COMPLET :
    return NextResponse.redirect(
      new URL(`/rapport/${customData}?status=success`, request.url)
    );
  }

  // Si vraiment aucune session n'est identifiée, retour à l'accueil
  return NextResponse.redirect(new URL('/', request.url));
}

// 2. Traitement asynchrone Kkiapay de serveur à serveur (requête POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { transactionId, data: sessionId, status } = body;

    if (status === 'SUCCESS' && sessionId) {
      await supabaseAdmin.from('transactions').upsert({
        session_id: sessionId,
        transaction_id: transactionId,
        statut: 'validee',
        date_paiement: new Date().toISOString(),
      }, { onConflict: 'transaction_id' });
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}