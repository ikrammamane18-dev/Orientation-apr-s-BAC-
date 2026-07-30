'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function PaywallTeaser({ sessionId }) {
  
  useEffect(() => {
    // LA MÉTHODE INFAILLIBLE : On écoute directement les signaux "bruts" du navigateur
    const handleIframeMessage = (event) => {
      const data = event.data;

      // 1. Si le signal est un objet (Format classique de Kkiapay)
      if (data && typeof data === 'object') {
        // Dès qu'on voit le mot 'success' venant du widget Kkiapay
        if (data.name === 'success' || data.name === 'payment_success' || data.type === 'SUCCESS') {
          const transactionId = data.transactionId || data.id || '';
          // On force la redirection !
          window.location.href = `/api/payment/webhook?sessionId=${sessionId}&transaction_id=${transactionId}`;
        }
      }
      
      // 2. Si le signal est du texte JSON (Format alternatif)
      if (data && typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed.name === 'success' || parsed.name === 'payment_success') {
            const transactionId = parsed.transactionId || parsed.id || '';
            // On force la redirection !
            window.location.href = `/api/payment/webhook?sessionId=${sessionId}&transaction_id=${transactionId}`;
          }
        } catch (e) {
          // On ignore les messages qui ne nous concernent pas
        }
      }
    };

    // On branche notre écouteur directement sur le navigateur
    window.addEventListener('message', handleIframeMessage);

    // On débranche l'écouteur si l'utilisateur quitte la page (nettoyage)
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [sessionId]);


  function handlePayment() {
    if (typeof window !== 'undefined' && typeof window.openKkiapayWidget === 'function') {
      window.openKkiapayWidget({
        amount: 325,
        key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
        api_key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
        sandbox: true, // À passer à false en production
        data: sessionId,
        paymentmethods: ['momo', 'celtis']
      });
    } else {
      alert('Le module de paiement charge encore, veuillez patienter une seconde.');
    }
  }

  return (
    <>
      <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" />

      <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
        <p className="text-sm text-[#14231C]/60">Accès complet à votre rapport d'orientation</p>
        <p className="mt-2 font-serif text-3xl font-bold text-[#0B6E4F]">
          325 <span className="text-sm font-normal">FCFA</span>
        </p>

        <button
          type="button"
          onClick={handlePayment}
          className="mt-4 w-full rounded-xl bg-[#0B6E4F] py-3.5 text-base font-semibold text-white shadow-lg shadow-[#0B6E4F]/20 active:scale-95 transition-transform"
        >
          Payer 325 FCFA pour débloquer
        </button>
      </div>
    </>
  );
}
