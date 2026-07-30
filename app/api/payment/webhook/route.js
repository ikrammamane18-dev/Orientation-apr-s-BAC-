import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    if (transactionId) {
      // On tente d'enregistrer et on capture l'erreur s'il y en a une !
      const { error } = await supabaseAdmin.from('transactions').upsert({
        session_id: sessionId,
        transaction_id: transactionId,
        statut: 'validee',
        date_paiement: new Date().toISOString(),
      }, { onConflict: 'transaction_id' });

      // SI SUPABASE REFUSE D'ÉCRIRE, ON AFFICHE L'ERREUR DANS L'URL
      if (error) {
        return NextResponse.redirect(
          new URL(`/resultats/${sessionId}?erreur_supabase=${encodeURIComponent(error.message)}`, request.url)
        );
      }
    }

    // Si pas d'erreur, on va vers le rapport
    return NextResponse.redirect(new URL(`/rapport/${sessionId}`, request.url));
  }

  return NextResponse.redirect(new URL('/', request.url));
}
