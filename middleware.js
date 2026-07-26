import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // 'jose' fonctionne dans le runtime Edge du middleware, contrairement à 'jsonwebtoken'

/**
 * middleware.js (à la racine du projet)
 *
 * Deux responsabilités :
 * 1. Bloquer l'accès à /admin/** si le cookie de session admin est absent
 *    ou invalide — c'est la vraie barrière, pas le formulaire React.
 * 2. Ajouter des en-têtes de sécurité à TOUTES les réponses (pas seulement
 *    /admin), ce qui réduit la surface d'attaque XSS / clickjacking / MIME
 *    sniffing pour l'ensemble du site.
 */

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request) {
  const response = NextResponse.next();

  // --- 2. En-têtes de sécurité globaux -----------------------------------
  response.headers.set('X-Frame-Options', 'DENY'); // empêche d'iframer le site (anti-clickjacking)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // 'unsafe-inline' est nécessaire ici : Next.js insère ses propres scripts
      // d'hydratation inline dans la page (App Router). Sans ça, le CSP bloque
      // Next.js lui-même — c'est exactement ce qui s'est produit en prod : le
      // formulaire s'affichait mais plus rien n'était interactif (cliquer sur
      // une série ne révélait plus les champs de notes), avec des erreurs
      // "Executing inline script violates CSP" dans la console.
      // Une alternative plus stricte existe (CSP par nonce, régénéré à chaque
      // requête) mais demande un cablage précis avec Next.js ; à envisager
      // plus tard avec un développeur si vous voulez durcir encore ce point.
      "script-src 'self' 'unsafe-inline' https://cdn.kkiapay.me",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.kkiapay.me " + (process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''),
      "frame-src https://widget.kkiapay.me",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // --- 1. Protection de /admin --------------------------------------------
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}
