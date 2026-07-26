'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CLE_STOCKAGE = 'consentement_cookies';

/**
 * components/CookieConsentBanner.jsx
 *
 * Bandeau simple "Tout accepter / Refuser" affiché tant que l'utilisateur
 * n'a pas fait de choix. Le choix est mémorisé en localStorage (device
 * local, pas de dépendance serveur pour un simple affichage/masquage).
 *
 * Lié à CONFORMITE-LEGALE.md §1 : informer clairement l'utilisateur avant
 * toute collecte n'est pas qu'une bonne pratique UX, c'est une attente du
 * Code du numérique béninois (loi n°2017-20) en matière de transparence.
 */
export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choixExistant = window.localStorage.getItem(CLE_STOCKAGE);
    if (!choixExistant) setVisible(true);
  }, []);

  function enregistrerChoix(valeur) {
    window.localStorage.setItem(CLE_STOCKAGE, valeur);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#14231C]/10 bg-white px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto max-w-md">
        <p className="text-sm text-[#14231C]/80">
          🍪 Nous utilisons des cookies essentiels au fonctionnement du site et, avec votre
          accord, pour mesurer notre audience.{' '}
          <Link href="/cookies" className="underline underline-offset-2">
            En savoir plus
          </Link>
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => enregistrerChoix('refuse')}
            className="flex-1 rounded-lg border border-[#14231C]/15 py-2.5 text-sm font-medium text-[#14231C]/70"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => enregistrerChoix('accepte')}
            className="flex-1 rounded-lg bg-[#0B6E4F] py-2.5 text-sm font-semibold text-white"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
