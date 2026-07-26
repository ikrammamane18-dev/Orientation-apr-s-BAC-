import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request) {
  const response = NextResponse.next();

  // --- 2. En-têtes de sécurité globaux -----------------------------------
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.kkiapay.me https://*.kkiapay.me",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.kkiapay.me https://api.kkiapay.me wss://*.supabase.co " + (process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''),
      "frame-src 'self' https://*.kkiapay.me https://widget.kkiapay.me https://widget-v3.kkiapay.me",
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