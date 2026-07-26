'use client';

import Script from 'next/script';

export default function PaywallTeaser({ sessionId }) {
  function handlePayment() {
    if (typeof window !== 'undefined' && typeof window.openKkiapayWidget === 'function') {
      window.openKkiapayWidget({
        amount: 325,
        key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
        api_key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
        sandbox: true, // À passer à false en production
        data: sessionId, // Transmet le sessionId à Kkiapay
        callback: `https://orientation-apr-s-bac.vercel.app/api/payment/webhook?sessionId=${sessionId}`,
        paymentmethods: ['momo', 'celtis'],
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