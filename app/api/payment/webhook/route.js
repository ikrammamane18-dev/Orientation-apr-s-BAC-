// app/api/payment/webhook/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const sessionId = searchParams.get('sessionId') || searchParams.get('data');

  if (sessionId) {
    // 1. Marquer le paiement comme validé dans Supabase
    if (transactionId) {
      await supabaseAdmin.from('transactions').upsert({
        session_id: sessionId,
        transaction_id: transactionId,
        statut: 'validee',
        date_paiement: new Date().toISOString(),
      }, { onConflict: 'transaction_id' });
    }

    // 2. Rediriger DIRECTEMENT vers la page du rapport complet débloqué
    return NextResponse.redirect(
      new URL(`/rapport/${sessionId}?status=success`, request.url)
    );
  }

  return NextResponse.redirect(new URL('/', request.url));
}