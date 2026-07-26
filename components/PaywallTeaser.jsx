'use client';

import { useState } from 'react';
import Script from 'next/script';

const PRIX_AFFICHE_FCFA = 325; // doit rester identique à PRIX_RAPPORT_FCFA (lib/payment.js) — affichage uniquement, le vrai montant facturé est toujours recalculé côté serveur

/**
 * components/PaywallTeaser.jsx
 *
 * Étape 2 → 3 du parcours : un prix fixe et unique (325 FCFA), affiché
 * clairement, puis initie la transaction via /api/payment/initiate.
 * Le montant réellement facturé est déterminé côté serveur (lib/payment.js),
 * jamais envoyé par ce composant — voir la note de sécurité dans la route API.
 */
export default function PaywallTeaser({ sessionId }) {
  const [etat, setEtat] = useState('idle'); // idle | chargement | kkiapay | manuel | erreur
  const [donneesPaiement, setDonneesPaiement] = useState(null);

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
            Déblocage {donneesPaiement.delaiValidation}.
          </p>
        </div>
      )}
    </div>
  );
}
