import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '@/components/PrintButton';
export const dynamic = 'force-dynamic';
/**
 * app/rapport/[sessionId]/page.jsx
 */
export default async function RapportPage({ params }) {
  const { sessionId } = params;

  // 1. Récupération des données depuis Supabase
  const { data: session } = await supabaseAdmin
    .from('sessions_test')
    .select('id, resultat_complet, transactions(statut)')
    .eq('id', sessionId)
    .maybeSingle();

  if (!session) notFound();

  // Vérification serveur du paiement
  const paiementValide = (session.transactions ?? []).some((t) => t.statut === 'validee');
  if (!paiementValide) {
    redirect(`/resultats/${sessionId}`);
  }

  const { moyenne, eligibiliteBourse, filieresCompatibles } = session.resultat_complet;

  // 2. CALCUL DYNAMIQUE DE L'ÉLIGIBILITÉ AUX BOURSES :
  // Compte le nombre de filières où le candidat atteint ou dépasse le seuil
  const boursesEligiblesCount = filieresCompatibles.filter(
    (filiere) => filiere.seuilAdmission && moyenne >= filiere.seuilAdmission
  ).length;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10 print:bg-white">
      <h1 className="text-center font-serif text-2xl font-bold text-[#14231C]">
        Votre rapport d'orientation complet
      </h1>

      {/* BLOC 1: Résumé des moyennes et bourses */}
      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm text-[#14231C]/60">Moyenne générale coefficientée</p>
        <p className="font-serif text-3xl font-bold text-[#14231C]">{moyenne}/20</p>
        
        <p className="mt-3 text-sm text-[#14231C]/60">Chances d'obtenir une bourse d'État</p>
        <p className="font-serif text-3xl font-bold text-[#0B6E4F]">{eligibiliteBourse.tauxObtention}%</p>
        <p className="text-sm font-medium text-[#0B6E4F]/70">Éligibilité {eligibiliteBourse.niveau}</p>
        
        {/* NOUVEAU: Affichage dynamique du nombre d'éligibilités aux bourses */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-[#14231C]/60">Filières à bourse éligibles :</p>
          <p className="text-base font-bold text-[#0B6E4F]">
            {boursesEligiblesCount} filière(s) compatible(s)
          </p>
        </div>

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
              <p className="mt-1 text-xs text-[#14231C]/50">{eligibiliteBrowser.description}</p>
            )}
          </div>
        )}
      </div>

      {/* BLOC 2: Classement des filières publiques avec Seuil et Quota */}
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
            <div className="mt-1.5 flex gap-3 text-xs text-[#14231C]/60">
              <span>Seuil indicatif : {filiere.seuilAdmission}/20</span>
              {filiere.quota_indicatif != null && (
                <span>Quota indicatif : {filiere.quota_indicatif} places</span>
              )}
            </div>
          </div>
        ))}
        {filieresCompatibles.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-[#14231C]/50 shadow-sm">
            Aucune filière publique compatible trouvée avec votre série et votre moyenne pour le moment.
          </p>
        )}
      </div>

      {/* BLOC 3: Bouton d'impression / Téléchargement PDF */}
      <div className="mt-6 text-center">
        <PrintButton />
      </div>

      {/* BLOC 4: Encadré d'orientation privée (WhatsApp / Appel / Email) */}
      <div className="mt-8 rounded-2xl bg-[#0B6E4F]/10 p-6 text-center border border-[#0B6E4F]/20">
        <h3 className="text-lg font-bold text-[#0B6E4F]">Besoin d'un accompagnement personnalisé ?</h3>
        <p className="mt-1 text-sm text-gray-600">
          Nos conseillers d'orientation vous aident à faire le meilleur choix d'affectation.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/2290153731434"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            📱 WhatsApp Direct
          </a>
          <a
            href="tel:+2290153731434"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B6E4F] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#08533c]"
          >
            📞 Appel Téléphonique
          </a>
          <a
            href="mailto:mamaneikram614@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
          >
            ✉️ Envoyer un Email
          </a>
        </div>
      </div>
    </main>
  );
}
