import { NextResponse } from 'next/server';

// 1. Redirection de l'utilisateur quand Kkiapay le redirige après paiement
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');

  // Si on a un ID de transaction ou de retour, on redirige vers le rapport complet
  // Ajustez l'URL de destination selon le chemin de votre rapport
  return NextResponse.redirect(new URL('/rapport?status=success', request.url));
}

// 2. Traitement du Webhook serveur en arrière-plan (Kkiapay POST)
export async function POST(request) {
  try {
    const body = await request.json();
    // Votre logique de validation en base de données Supabase ici...
    
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}