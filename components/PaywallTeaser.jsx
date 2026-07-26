'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const PRIX_AFFICHE_FCFA = 325; // doit rester identique à PRIX_RAPPORT_FCFA (lib/payment.js) — affichage uniquement, le vrai montant facturé est toujours recalculé côté serveur

/**
 * components/PaywallTeaser.jsx
 *
 * Étape 2 → 3 → 4 du parcours : prix fixe (325 FCFA), initiation du
 * paiement, PUIS détection du déblocage et redirection automatique vers
 * /rapport/[sessionId].
 *
 * Avant ce correctif, rien ne se passait après le paiement manuel : la page
 * restait bloquée sur les instructions, sans jamais rediriger vers le
 * rapport une fois la transaction validée par un admin. On corrige ça avec
 * un bouton de vérification manuelle + un sondage automatique en arrière-plan.
 */
export default function PaywallTeaser({ sessionId }) {
  const router = useRouter();
  const [etat, setEtat] = useState('idle'); // idle | chargement | kkiapay | manuel | erreur
  const [donneesPaiement, setDonneesPaiement] = useState(null);
  const [verificationEnCours, setVerificationEnCours] = useState(false);
  const intervalRef = useRef(null);

  // Sondage automatique en arrière-plan dès qu'une transaction existe :
  // dès que le statut passe à "validee" (webhook KKiaPay reçu, ou admin ayant
  // validé un paiement manuel), on redirige tout seul vers le rapport.
  useEffect(() => {
    if (etat !== 'kkiapay' && etat !== 'manuel') return undefined;

    async function verifier() {
      try {
        const res = await fetch(`/api/payment/status?sessionId=${sessionId}`);
        if (!res.ok) return;
        const { statut } = await res.json();
        if (statut === 'validee') {
          clearInterval(intervalRef.current);
          router.push(`/rapport/${sessionId}`);
        }
      } catch {
        // silencieux : on retentera au prochain intervalle
      }
    }

    verifier(); // premier essai immédiat
    intervalRef.current = setInterval(verifier, 8000);
    return () => clearInterval(intervalRef.current);
  }, [etat, sessionId, router]);

  async function handleDebloquer() {
    setEtat('chargement');
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDonneesPaiement(data);
      setEtat(data.provider === 'kkiapay' ? 'kkiapay' : 'manuel');
    } catch {
      setEtat('erreur');
    }
  }

  async function handleVerifierMaintenant() {
    setVerificationEnCours(true);
    try {
      const res = await fetch(`/api/payment/status?sessionId=${sessionId}`);
      const { statut } = await res.json();
      if (statut === 'validee') {
        router.push(`/rapport/${sessionId}`);
        return;
      }
    } finally {
      setVerificationEnCours(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">
      <div className="mb-4 flex items-baseline justify-center gap-1 rounded-xl bg-[#0B6E4F]/5 py-4">
        <span className="font-serif text-3xl font-bold text-[#0B6E4F]">{PRIX_AFFICHE_FCFA}</span>
        <span className="text-sm font-medium text-[#0B6E4F]/70">FCFA · rapport complet</span>
      </div>

      {etat === 'idle' && (
        <button
          type="button"
          onClick={handleDebloquer}
          className="w-full rounded-xl bg-[#E8A33D] py-4 text-base font-semibold text-[#14231C] shadow-lg shadow-[#E8A33D]/30"
        >
          Débloquer mon rapport complet
        </button>
      )}

      {etat === 'chargement' && (
        <p className="text-center text-sm text-[#14231C]/60">Préparation du paiement…</p>
      )}

      {etat === 'erreur' && (
        <p className="text-center text-sm text-[#D65A46]">
          Une erreur est survenue. Merci de réessayer.
        </p>
      )}

      {etat === 'kkiapay' && donneesPaiement && (
        <>
          <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" />
          <button
            type="button"
            onClick={() =>
              window.openKkiapayWidget({
                amount: donneesPaiement.amount,
                key: donneesPaiement.publicKey,
                sandbox: donneesPaiement.sandbox,
                data: donneesPaiement.reference,
              })
            }
            className="w-full rounded-xl bg-[#0B6E4F] py-4 text-base font-semibold text-white shadow-lg"
          >
            Payer {PRIX_AFFICHE_FCFA} FCFA (MTN MoMo / Moov / Wave)
          </button>
          <p className="mt-3 text-center text-xs text-[#14231C]/50">
            Une fois le paiement confirmé, vous serez redirigé automatiquement vers votre rapport
            (quelques secondes).
          </p>
        </>
      )}

      {etat === 'manuel' && donneesPaiement && (
        <div className="space-y-2 rounded-xl bg-[#F5F7F2] p-4 text-sm text-[#14231C]">
          <p className="font-semibold">Comment payer :</p>
          <ol className="list-decimal space-y-1 pl-4">
            {donneesPaiement.instructions.map((etape, i) => (
              <li key={i}>{etape}</li>
            ))}
          </ol>
          <p className="pt-1 text-xs text-[#14231C]/50">
            Déblocage {donneesPaiement.delaiValidation}. Cette page se met à jour toute seule dès
            que c'est validé — vous pouvez aussi vérifier manuellement :
          </p>
          <button
            type="button"
            onClick={handleVerifierMaintenant}
            disabled={verificationEnCours}
            className="mt-2 w-full rounded-lg bg-[#2B3A67] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {verificationEnCours ? 'Vérification…' : "J'ai payé, vérifier maintenant"}
          </button>
        </div>
      )}
    </div>
  );
}
