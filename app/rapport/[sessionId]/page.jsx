import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseClient';
import PrintButton from '@/components/PrintButton';
import PrivateOrientationCard from '@/components/PrivateOrientationCard';

/**
 * app/rapport/[sessionId]/page.jsx
 *
 * Accès contrôlé par une vraie vérification serveur du statut de paiement —
 * jamais par un paramètre d'URL ou un état local qu'un visiteur pourrait
 * manipuler. Si aucune transaction "validee" n'existe pour cette session,
 * on renvoie vers la page de paiement plutôt que d'afficher quoi que ce soit.
 *
 * Tout ce qui est calculé pour cette session est affiché ici une fois payé :
 * moyenne, taux et détail de l'éligibilité bourse (y compris nom/montant/
 * description de la bourse si configurés en admin), classement complet des
 * filières avec taux d'admissibilité ET quota indicatif.
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

  const { moyenne, eligibiliteBourse, filieresCompatibles, afficherOrientationPrivee } = session.resultat_complet;

  return (
    // app/rapport/page.jsx ou components/ReportView.jsx

export default function ReportPage({ data }) {
  // Vos données reçues de Supabase
  const filieres = data?.filieres || [];
  const moyenneCandidat = data?.moyenneGénérale || 0;

  // 1. CALCUL DYNAMIQUE DES BOURSES :
  // On filtre les filières où une bourse existe et où la moyenne du candidat atteint le seuil de la bourse
  const boursesEligibles = filieres.filter(
    (filiere) => filiere.bourse_nom && moyenneCandidat >= (filiere.seuil_bourse || filiere.seuil_admission)
  );
  
  const nombreBourses = boursesEligibles.length;

  return (
    <main className="max-w-4xl mx-auto p-4">
      {/* 2. AFFICHAGE DU NOMBRE DE BOURSES DANS LERÉSUMÉ */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <h2 className="font-bold text-emerald-900">Résumé de vos opportunités</h2>
        <p className="text-sm text-emerald-800 mt-1">
          Nombre de filières éligibles à une bourse : <strong>{nombreBourses}</strong>
        </p>
      </div>

      {/* Liste de vos filières... */}
    </main>
  );
}
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
            <div className="mt-1.5 flex gap-3 text-xs text-[#14231C]/40">
              <span>Seuil indicatif : {filiere.seuilAdmission}/20</span>
              {filiere.quota_indicatif != null && <span>Quota indicatif : {filiere.quota_indicatif} places</span>}
            </div>
          </div>
        ))}
        {filieresCompatibles.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-[#14231C]/50 shadow-sm">
            Aucune filière publique compatible trouvée avec votre série et votre moyenne pour le
            moment.
          </p>
        )}
      </div>

      <div className="mt-6">
        <PrintButton />
        {/* ... Votre liste de filières et cartes ci-dessus ... */}

      {/* Bouton de téléchargement PDF existant */}
      <div className="mt-6 text-center">
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold">
          📄 Télécharger le rapport en PDF
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COLLEZ L'ENCADRÉ D'ORIENTATION PRIVÉ EXACTEMENT ICI :         */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-10 rounded-2xl bg-[#0B6E4F]/10 p-6 text-center border border-[#0B6E4F]/20">
        <h3 className="text-lg font-bold text-[#0B6E4F]">Besoin d'un accompagnement personnalisé ?</h3>
        <p className="mt-1 text-sm text-gray-600">
          Nos conseillers d'orientation vous aident à faire le meilleur choix d'affectation.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="https://wa.me/22900000000" // Remplacez par votre numéro WhatsApp
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
          >
            📱 WhatsApp Direct
          </a>
          <a
            href="tel:+22900000000" // Remplacez par votre numéro de téléphone
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B6E4F] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#08533c]"
          >
            📞 Appel Téléphonique
          </a>
          <a
            href="mailto:contact@votre-domaine.com" // Remplacez par votre email
            className="inline-flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
          >
            ✉️ Envoyer un Email
          </a>
        </div>
      </div>

    </main> // Fermeture du conteneur principal
  );
}
      </div>

      {afficherOrientationPrivee && <PrivateOrientationCard />}
    </main>
  );
}
