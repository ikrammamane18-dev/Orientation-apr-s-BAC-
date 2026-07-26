import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '@/components/PrintButton';

/**
 * app/rapport/[sessionId]/page.jsx
 *
 * Accès contrôlé par une vraie vérification serveur du statut de paiement —
 * jamais par un paramètre d'URL ou un état local qu'un visiteur pourrait
 * manipuler. Si aucune transaction "validee" n'existe pour cette session,
 * on renvoie vers la page de paiement plutôt que d'afficher quoi que ce soit.
 */
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

  const { moyenne, eligibiliteBourse, filieresCompatibles } = session.resultat_complet;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10 print:bg-white">
      <h1 className="text-center font-serif text-2xl font-bold text-[#14231C]">
        Votre rapport d'orientation complet
      </h1>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-[#14231C]/60">Moyenne générale coefficientée</p>
        <p className="font-serif text-3xl font-bold text-[#14231C]">{moyenne}/20</p>
        <p className="mt-3 text-sm text-[#14231C]/60">Chances d'obtenir une bourse d'État</p>
        <p className="font-serif text-3xl font-bold text-[#0B6E4F]">{eligibiliteBourse.tauxObtention}%</p>
        <p className="text-sm font-medium text-[#0B6E4F]/70">Éligibilité {eligibiliteBourse.niveau}</p>
        <p className="mt-1 text-sm text-[#14231C]/70">{eligibiliteBourse.message}</p>
      </div>

      <h2 className="mt-6 font-serif text-lg font-bold text-[#14231C]">
        Filières publiques classées par compatibilité
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
              {filiere.universite} {filiere.etablissement ? `— ${filiere.etablissement}` : ''}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PrintButton />
      </div>
    </main>
  );
}
