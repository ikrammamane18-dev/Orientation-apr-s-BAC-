import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { estLimite, getClientIp } from '@/lib/rateLimit';

const schemaEntree = z.object({
  sessionId: z.string().uuid().optional(),
  nom: z.string().min(1).max(150),
  telephone: z.string().min(6).max(20),
  message: z.string().max(1000).optional(),
});

export async function POST(request) {
  const ip = getClientIp(request);
  if (estLimite(`contact-prive:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives, réessayez plus tard.' }, { status: 429 });
  }

  const parsed = schemaEntree.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('contacts_prive').insert({
    session_test_id: parsed.data.sessionId ?? null,
    nom: parsed.data.nom,
    telephone: parsed.data.telephone,
    message: parsed.data.message ?? null,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }

  // Optionnel : notifier immédiatement par email via un service transactionnel
  // (ex: Resend) vers mamaneikram614@gmail.com plutôt que de compter
  // uniquement sur la consultation du dashboard admin.

  return NextResponse.json({ ok: true });
}
