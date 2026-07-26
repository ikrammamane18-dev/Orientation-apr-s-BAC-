import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Empêche Next.js de mettre cette route en cache
export const dynamic = 'force-dynamic'; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const sessionId = searchParams.get('sessionId');

  if (sessionId) {
    if (transactionId) {
      // 1. On enregistre le succès dans Supabase
      await supabaseAdmin.from('transactions').upsert({
        session_id: sessionId,
        transaction_id: transactionId,
        statut: 'validee',
        date_paiement: new Date().toISOString(),
      }, { onConflict: 'transaction_id' });
    }

    // 2. On redirige ENFIN vers la page du rapport débloqué
    return NextResponse.redirect(new URL(`/rapport/${sessionId}`, request.url));
  }

  // Si on n'a pas d'identifiant, on renvoie à l'accueil
  return NextResponse.redirect(new URL('/', request.url));
}