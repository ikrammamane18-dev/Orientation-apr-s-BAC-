import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estLimite, getClientIp } from '@/lib/rateLimit';

/**
 * app/api/payment/status/route.js
 *
 * Corrige un vrai trou du parcours : après paiement (surtout en mode manuel,
 * où la validation par un admin peut prendre jusqu'à 24h), rien ne prévenait
 * l'étudiant ni ne le redirigeait vers /rapport une fois débloqué — la page
 * restait figée sur les instructions de paiement. Ce endpoint est interrogé
 * (une fois au clic, puis en arrière-plan) par PaywallTeaser.jsx pour
 * détecter le déblocage et rediriger automatiquement.
 */

const schemaEntree = z.object({ sessionId: z.string().uuid() });

export async function GET(request) {
  const ip = getClientIp(request);
  if (estLimite(`payment-status:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = schemaEntree.safeParse({ sessionId: searchParams.get('sessionId') });
  if (!parsed.success) {
    return NextResponse.json({ error: 'sessionId invalide' }, { status: 400 });
  }

  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('statut')
    .eq('session_test_id', parsed.data.sessionId)
    .order('created_at', { ascending: false })
    .limit(1);

  const statut = transactions?.[0]?.statut ?? null;
  return NextResponse.json({ statut });
}
