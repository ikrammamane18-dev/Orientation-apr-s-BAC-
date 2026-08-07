import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PaywallTeaser from '@/components/PaywallTeaser';
import PrivateOrientationCard from '@/components/PrivateOrientationCard';

/**
 * app/resultats/[sessionId]/page.jsx
 *
 * Server Component : ne lit QUE les champs "teaser" en base, jamais le détail
 * complet (`resultat_complet`), qui reste réservé à /rapport après paiement
 * validé. C'est la vraie barrière du paywall (le front ne reçoit jamais la
 * donnée verrouillée), pas juste un visuel flouté.
 */
export default async function ResultatsPage({ params }) {
  const { sessionId } = params;

  const { data: session } = await supabaseAdmin
    .from('sessions_test')
    .select('id, niveau_eligibilite_bourse, taux_obtention_bourse, nombre_filieres_compatibles')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) notFound();

  const afficherOrientationPrivee =
    session.niveau_eligibilite_bourse === 'Faible' || session.nombre_filieres_compatibles === 0;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="text-center font-serif text-2xl font-bold text-[#14231C]">Vos résultats</h1>

      <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-[#14231C]/60">Vos chances d'obtenir une bourse d'État</p>
        <p className="mt-1 font-serif text-6xl font-bold text-[#0B6E4F]">
          {session.taux_obtention_bourse}
          <span className="text-3xl">%</span>
        </p>
        <span className="mt-2 inline-block rounded-full bg-[#0B6E4F]/10 px-3 py-1 text-xs font-semibold text-[#0B6E4F]">
          Éligibilité {session.niveau_eligibilite_bourse}
        </span>
        <p className="mt-3 text-xs text-[#14231C]/40">
          Estimation indicative basée sur nos critères — ne remplace pas les résultats officiels
          du MESRS.
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-[#14231C]/60">Filières publiques compatibles trouvées</p>
        <p className="mt-1 font-serif text-2xl font-bold text-[#2B3A67]">
          {session.nombre_filieres_compatibles}
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-[#14231C]/60">
        Débloquez le classement détaillé des filières, les taux d'admissibilité et le détail de
        votre éligibilité à la bourse.
      </p>

      <div className="mt-4">
        <PaywallTeaser sessionId={sessionId} />
      </div>

      {afficherOrientationPrivee && <PrivateOrientationCard />}
    </main>
  );
}
