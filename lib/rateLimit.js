/**
 * lib/rateLimit.js
 *
 * Limiteur anti-abus basique, en mémoire, à appliquer sur toute route API
 * publique (paiement, contact, admin auth, calcul de score...).
 *
 * ⚠️ Limite connue : cette implémentation est locale à UNE instance de
 * serveur. Sur Vercel (fonctions serverless, multi-instances), chaque
 * instance a son propre compteur : la protection est donc partielle.
 * Pour une garantie fiable en production, remplacer par un store partagé
 * (ex : Upstash Ratelimit + Redis, ou Vercel Firewall / WAF).
 * Gardez cette version comme filet de sécurité minimal, pas comme solution
 * définitive.
 */

const compteurs = new Map(); // clé -> { count, resetAt }

/**
 * @param {string} cle - identifiant unique (ex: `ip + ":" + route`)
 * @param {number} maxRequetes
 * @param {number} fenetreMs
 * @returns {boolean} true si la limite est dépassée (il faut rejeter la requête)
 */
export function estLimite(cle, maxRequetes = 10, fenetreMs = 60_000) {
  const maintenant = Date.now();
  const entree = compteurs.get(cle);

  if (!entree || maintenant > entree.resetAt) {
    compteurs.set(cle, { count: 1, resetAt: maintenant + fenetreMs });
    return false;
  }

  entree.count += 1;
  return entree.count > maxRequetes;
}

/**
 * Extrait une IP "raisonnable" d'une requête Next.js (Route Handler).
 * Derrière Vercel, x-forwarded-for contient l'IP réelle du visiteur en premier.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'inconnu';
}
