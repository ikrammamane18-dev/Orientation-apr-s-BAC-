import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * app/api/admin/auth/route.js
 *
 * ⚠️ Le mot de passe en clair ("Réussite2.0") ne doit JAMAIS apparaître ici
 * ni dans aucun fichier commité. La procédure à suivre :
 *
 * 1. Générer le hash une seule fois, en local :
 *      node -e "console.log(require('bcryptjs').hashSync('Réussite2.0', 12))"
 * 2. Copier le résultat dans .env.local (jamais commité) :
 *      ADMIN_PASSWORD_HASH=$2a$12$........................................
 *      ADMIN_JWT_SECRET=une_chaine_aleatoire_longue_et_unique
 * 3. Sur Vercel : ajouter ces deux variables dans Project Settings → Environment Variables.
 *
 * Ainsi, même si le dépôt de code est un jour rendu public par erreur,
 * le mot de passe réel ne fuite pas.
 */

// Limiteur anti-brute-force basique (en mémoire). En production multi-instance,
// remplacer par un store partagé (ex : Upstash Ratelimit / Redis).
const tentatives = new Map(); // ip -> { count, resetAt }
const LIMITE_TENTATIVES = 5;
const FENETRE_MS = 10 * 60 * 1000; // 10 minutes

function estLimite(ip) {
  const entree = tentatives.get(ip);
  const maintenant = Date.now();

  if (!entree || maintenant > entree.resetAt) {
    tentatives.set(ip, { count: 1, resetAt: maintenant + FENETRE_MS });
    return false;
  }

  entree.count += 1;
  return entree.count > LIMITE_TENTATIVES;
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'inconnu';

  if (estLimite(ip)) {
    return NextResponse.json({ error: 'Trop de tentatives' }, { status: 429 });
  }

  const { password } = await request.json();

  if (typeof password !== 'string' || password.length === 0) {
    return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
  }

  const hashAttendu = process.env.ADMIN_PASSWORD_HASH;
  if (!hashAttendu) {
    console.error('ADMIN_PASSWORD_HASH manquant dans les variables d\'environnement');
    return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
  }

  const motDePasseValide = await bcrypt.compare(password, hashAttendu);

  if (!motDePasseValide) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  // Session courte (2h) — l'admin devra se reconnecter régulièrement, ce qui limite
  // l'impact d'un cookie volé.
  const token = jwt.sign({ role: 'admin' }, process.env.ADMIN_JWT_SECRET, { expiresIn: '2h' });

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    // En local (http://localhost), un cookie "secure" est silencieusement
    // refusé par le navigateur car la connexion n'est pas en HTTPS. On ne
    // force ce flag qu'en production (Vercel sert toujours en HTTPS).
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 2,
  });

  return response;
}
