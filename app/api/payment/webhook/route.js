// app/api/payment/webhook/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const sessionId = searchParams.get('data'); // ou la clé où est stocké l'ID de session

  // Redirige vers le dossier dynamique /rapport/[sessionId]
  if (sessionId) {
    return NextResponse.redirect(new URL(`/rapport/${sessionId}?status=success`, request.url));
  }

  return NextResponse.redirect(new URL('/', request.url));
}