/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // ne pas révéler "Next.js" dans les en-têtes de réponse

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Force HTTPS pour 2 ans, y compris les sous-domaines. Vercel sert déjà
            // en HTTPS par défaut ; ceci renforce l'instruction au navigateur.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
