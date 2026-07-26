/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.kkiapay.me https://*.kkiapay.me",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.kkiapay.me wss://*.supabase.co",
              // C'est cette ligne qu'il faut mettre à jour avec le wildcard *.kkiapay.me :
              "frame-src 'self' https://*.kkiapay.me https://widget-v3.kkiapay.me",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;