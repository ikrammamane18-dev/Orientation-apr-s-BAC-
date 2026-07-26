import { createClient } from '@supabase/supabase-js';

/**
 * lib/supabaseClient.js
 *
 * Deux clients, volontairement séparés :
 *
 * - `supabasePublic` : utilise la clé "anon", protégée par les policies RLS
 *   définies dans database/schema.sql. Peut être importé dans un composant
 *   client (elle est de toute façon visible dans le bundle : NEXT_PUBLIC_*).
 *
 * - `supabaseAdmin` : utilise la clé "service role", qui CONTOURNE la RLS.
 *   Ne doit JAMAIS être importée dans un composant marqué 'use client', et ne
 *   doit être utilisée que dans les Route Handlers (app/api/**) ou des
 *   Server Components. Cette clé n'est jamais préfixée NEXT_PUBLIC_.
 */

function verifierVariablesEnv() {
  const manquantes = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) manquantes.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) manquantes.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (typeof window === 'undefined' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    manquantes.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  if (manquantes.length > 0) {
    // Message volontairement très visible dans le terminal (là où tourne
    // `npm run dev`) : sans ça, l'erreur brute de supabase-js
    // ("supabaseUrl is required") ne dit pas quoi faire.
    throw new Error(
      `\n\n❌ Variables Supabase manquantes dans .env.local : ${manquantes.join(', ')}.\n` +
        `→ Copiez .env.example en .env.local, remplissez ces valeurs (Project Settings → API ` +
        `dans votre projet Supabase), puis REDÉMARREZ "npm run dev".\n`
    );
  }
}

verifierVariablesEnv();

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Garde-fou : si ce fichier est accidentellement importé dans le bundle client,
// on évite de faire planter le build à cause d'une variable serveur absente.
export const supabaseAdmin =
  typeof window === 'undefined'
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;
