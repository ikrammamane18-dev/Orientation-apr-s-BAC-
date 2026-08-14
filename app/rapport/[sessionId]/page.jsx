import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '@/components/PrintButton';
import PrivateOrientationCard from '@/components/PrivateOrientationCard';
import Reveal from '@/components/Reveal';

export default async function RapportPage({ params }) {
  const { sessionId } = params;

  const { data: session } = await supabaseAdmin
    .from('sessions_test')
    .select('id, resultat_complet, transactions(statut)')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) notFound();

  const paiementValide = (session.transactions ?? []).some((t) => t.statut === 'validee');
  if (!paiementValide) redirect(`/resultats/${sessionId}`);

  const { moyenne, eligibiliteBourse, filieresCompatibles, afficherOrientationPrivee } = session.resultat_complet;

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-16 pt-10 print:bg-white">
      <Reveal as="h1" delay={0} className="text-center font-serif text-2xl font-bold text-[#14231C]">
        Votre rapport d'orientation complet
      </Reveal>

      <Reveal as="div" delay={100} className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-[#14231C]/60">Moyenne générale coefficientée</p>
        <p className="font-serif text-3xl font-bold text-[#14231C]">{moyenne}/20</p>
        <p className="mt-3 text-sm text-[#14231C]/60">Chances d'obtenir une bourse d'État</p>
        <p className="font-serif text-3xl font-bold text-[#0B6E4F]">{eligibiliteBourse.tauxObtention}%</p>
        <p className="text-sm font-medium text-[#0B6E4F]/70">Éligibilité {eligibiliteBourse.niveau}</p>
        <p className="mt-1 text-sm text-[#14231C]/70">{eligibiliteBourse.message}</p>
        {(eligibiliteBourse.nom || eligibiliteBourse.montantFcfa || eligibiliteBourse.description) && (
          <div className="mt-3 rounded-lg bg-[#0B6E4F]/5 p-3">
            {eligibiliteBourse.nom && <p className="text-sm font-semibold text-[#14231C]">{eligibiliteBourse.nom}</p>}
            {eligibiliteBourse.montantFcfa && <p className="text-sm text-[#14231C]/70">Montant indicatif : {eligibiliteBourse.montantFcfa.toLocaleString('fr-FR')} FCFA</p>}
            {eligibiliteBourse.description && <p className="mt-1 text-xs text-[#14231C]/50">{eligibiliteBourse.description}</p>}
          </div>
        )}
      </Reveal>

      <Reveal as="h2" delay={200} className="mt-6 font-serif text-lg font-bold text-[#14231C]">
        Filières publiques classées par compatibilité
      </Reveal>

      <div className="mt-3 space-y-2">
        {filieresCompatibles.map((filiere, index) => (
          <Reveal key={filiere.id} as="div" delay={280 + index * 60} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#14231C]">{filiere.nom}</p>
              {filiere.modeCalcul === 'concours' ? (
                <span className="rounded-full bg-[#2B3A67]/10 px-2 py-0.5 text-xs font-bold text-[#2B3A67]">Sur concours</span>
              ) : (
                <span className="rounded-full bg-[#E8A33D]/20 px-2 py-0.5 font-mono text-xs font-bold text-[#E8A33D]">{filiere.tauxAdmissibilite}%</span>
              )}
            </div>
            <p className="text-xs text-[#14231C]/50">{filiere.universite} {filiere.etablissement ? `— ${filiere.etablissement}` : ''}</p>

            {filiere.modeCalcul === 'concours' && (
              <p className="mt-1.5 text-xs text-[#14231C]/50">Admission par épreuve écrite — le calcul de moyenne ne s'applique pas ici.</p>
            )}
            {filiere.modeCalcul === 'precis' && (
              <p className="mt-1.5 text-xs text-[#14231C]/50">Moyenne de classement officielle (3 matières) : {filiere.moyenneClassement}/20 · seuil indicatif {filiere.seuilAdmission}/20</p>
            )}
            {filiere.modeCalcul === 'estimation' && (
              <p className="mt-1.5 text-xs text-[#14231C]/50">Estimation générale (matières précises de classement pas encore validées pour cette filière) · seuil indicatif {filiere.seuilAdmission}/20</p>
            )}

            <div className="mt-1.5 flex gap-3 text-xs text-[#14231C]/40">
              {filiere.quotaBourse != null && <span>Quota bourse : {filiere.quotaBourse}</span>}
              {filiere.quotaAide != null && <span>Quota aide/FPP : {filiere.quotaAide}</span>}
            </div>

            {filiere.debouches && filiere.debouches.length > 0 && (
              <div className="mt-2 border-t border-[#14231C]/10 pt-2">
                <p className="text-xs font-semibold text-[#14231C]/60">Débouchés</p>
                <p className="text-xs text-[#14231C]/60">{filiere.debouches.join(' · ')}</p>
              </div>
            )}
          </Reveal>
        ))}
        {filieresCompatibles.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-[#14231C]/50 shadow-sm">Aucune filière publique compatible trouvée pour le moment.</p>
        )}
      </div>

      <div className="mt-6"><PrintButton /></div>
      {afficherOrientationPrivee && <PrivateOrientationCard />}
    </main>
  );
}
