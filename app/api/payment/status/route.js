import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estLimite, getClientIp } from '@/lib/rateLimit';

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

  // On cherche d'abord s'IL EXISTE une transaction validée pour cette session
  // (peu importe qu'elle soit la plus récente ou non) — corrige le cas où
  // plusieurs tentatives ont créé plusieurs transactions et où c'est une
  // ancienne qui a été validée manuellement.
  const { data: transactionValidee } = await supabaseAdmin
    .from('transactions')
    .select('statut')
    .eq('session_test_id', parsed.data.sessionId)
    .eq('statut', 'validee')
    .limit(1)
    .maybeSingle();

  if (transactionValidee) {
    return NextResponse.json({ statut: 'validee' });
  }

  // Sinon, on renvoie le statut de la tentative la plus récente (en_attente / echouee)
  const { data: derniere } = await supabaseAdmin
    .from('transactions')
    .select('statut')
    .eq('session_test_id', parsed.data.sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ statut: derniere?.statut ?? null });
}
