import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '@/components/PrintButton';
import PrivateOrientationCard from '@/components/PrivateOrientationCard';

export default async function RapportPage({ params }) {
  const { sessionId } = params;

  const { data: session } = await supabaseAdmin
    .from('sessions_test')
    .select('id, resultat_complet, transactions(statut)')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) notFound();

  const paiementValide = (session.transactions ?? []).some((t) => t.statut === 'validee');
  if (!paiementValide) {
    redirect(`/resultats/${sessionId}`);
  }

  const { moyenne, eligibiliteBourse, filieresCompatibles, afficherOrientationPrivee } = session.resultat_complet;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10 print:bg-white">
      <h1 className="text-center font-serif text-2xl font-bold text-[#14231C]">
        Votre rapport d'orientation complet
      </h1>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-[#14231C]/60">Moyenne g¨¦n¨¦rale coefficient¨¦e</p>
        <p className="font-serif text-3xl font-bold text-[#14231C]">{moyenne}/20</p>
        <p className="mt-3 text-sm text-[#14231C]/60">Chances d'obtenir une bourse d'?tat</p>
        <p className="font-serif text-3xl font-bold text-[#0B6E4F]">{eligibiliteBourse.tauxObtention}%</p>
        <p className="text-sm font-medium text-[#0B6E4F]/70">?ligibilit¨¦ {eligibiliteBourse.niveau}</p>
        <p className="mt-1 text-sm text-[#14231C]/70">{eligibiliteBourse.message}</p>

        {(eligibiliteBourse.nom || eligibiliteBourse.montantFcfa || eligibiliteBourse.description) && (
          <div className="mt-3 rounded-lg bg-[#0B6E4F]/5 p-3">
            {eligibiliteBourse.nom && (
              <p className="text-sm font-semibold text-[#14231C]">{eligibiliteBourse.nom}</p>
            )}
            {eligibiliteBourse.montantFcfa && (
              <p className="text-sm text-[#14231C]/70">
                Montant indicatif : {eligibiliteBourse.montantFcfa.toLocaleString('fr-FR')} FCFA
              </p>
            )}
            {eligibiliteBourse.description && (
              <p className="mt-1 text-xs text-[#14231C]/50">{eligibiliteBourse.description}</p>
            )}
          </div>
        )}
      </div>

      <h2 className="mt-6 font-serif text-lg font-bold text-[#14231C]">
        Fili¨¨res publiques class¨¦es par compatibilit¨¦
      </h2>
      <div className="mt-3 space-y-2">
        {filieresCompatibles.map((filiere) => (
          <div key={filiere.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-medium text-[#14231C]">{filiere.nom}</p>
              <span className="rounded-full bg-[#E8A33D]/20 px-2 py-0.5 font-mono text-xs font-bold text-[#E8A33D]">
                {filiere.tauxAdmissibilite}%
              </span>
            </div>
            <p className="text-xs text-[#14231C]/50">
              {filiere.universite} {filiere.etablissement ? `¡ª ${filiere.etablissement}` : ''}
            </p>
            <div className="mt-1.5 flex gap-3 text-xs text-[#14231C]/40">
              <span>Seuil indicatif : {filiere.seuilAdmission}/20</span>
              {filiere.quota_indicatif != null && <span>Quota indicatif : {filiere.quota_indicatif} places</span>}
            </div>
          </div>
        ))}
        {filieresCompatibles.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-[#14231C]/50 shadow-sm">
            Aucune fili¨¨re publique compatible trouv¨¦e avec votre s¨¦rie et votre moyenne pour le
            moment.
          </p>
        )}
      </div>

      <div className="mt-6">
        <PrintButton />
      </div>

      {afficherOrientationPrivee && <PrivateOrientationCard />}
    </main>
  );
}
