'use client';

import { useCallback, useRef } from 'react';

/**
 * hooks/useSecretClicks.js
 *
 * Déclenche `onUnlock` après `requiredClicks` clics survenant chacun dans
 * un délai de `windowMs` millisecondes par rapport au précédent.
 * Se réinitialise automatiquement si l'utilisateur clique trop lentement.
 *
 * Usage :
 *   const handleLogoClick = useSecretClicks({ onUnlock: () => setShowAdminModal(true) });
 *   <img onClick={handleLogoClick} ... />
 *
 * Remarque de sécurité : ce hook ne fait QUE déclencher l'ouverture d'une UI
 * (le modal de connexion). Il ne contient et ne doit jamais contenir la
 * logique de vérification du mot de passe — celle-ci vit exclusivement
 * côté serveur (voir app/api/admin/auth/route.js).
 */
export function useSecretClicks({ requiredClicks = 5, windowMs = 600, onUnlock }) {
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    const delaiDepuisDernierClic = now - lastClickTimeRef.current;

    if (delaiDepuisDernierClic > windowMs) {
      // Trop lent : on repart de zéro sur ce clic
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }

    lastClickTimeRef.current = now;

    if (clickCountRef.current >= requiredClicks) {
      clickCountRef.current = 0;
      onUnlock?.();
    }
  }, [requiredClicks, windowMs, onUnlock]);

  return handleClick;
}
