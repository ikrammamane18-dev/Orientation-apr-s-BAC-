'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * components/AdminAccessModal.jsx
 *
 * Modal affiché après les 5 clics successifs sur le logo (cf. useSecretClicks).
 * Le mot de passe saisi est envoyé à /api/admin/auth : c'est le serveur qui
 * compare le hash, jamais ce composant. Voir ARCHITECTURE.md §5 pour le détail.
 */
export default function AdminAccessModal({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        return;
      }

      const { error } = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setErreur('Trop de tentatives. Réessayez dans quelques minutes.');
      } else if (res.status === 500) {
        // Config serveur incomplète (ex: ADMIN_PASSWORD_HASH absent de .env.local)
        // — ce n'est PAS un mauvais mot de passe, on le dit clairement pour ne
        // pas faire chercher au mauvais endroit.
        setErreur(error ?? 'Configuration serveur incomplète — vérifiez le terminal.');
      } else {
        setErreur(error ?? 'Mot de passe incorrect.');
      }
    } catch {
      setErreur('Connexion impossible. Vérifiez votre réseau.');
    } finally {
      setChargement(false);
      setPassword('');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#14231C]/60 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-[#F5F7F2] p-6 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[#2B3A67]">
          <span className="text-sm">🔒</span>
        </div>

        <h2 id="admin-modal-title" className="text-center font-serif text-lg font-semibold text-[#14231C]">
          Accès administrateur
        </h2>
        <p className="mt-1 text-center text-sm text-[#14231C]/60">
          Zone réservée. Saisissez le mot de passe pour continuer.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-[#14231C]/15 bg-white px-4 py-3 text-[#14231C] outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
          />

          {erreur && <p className="text-sm text-[#D65A46]">{erreur}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#14231C]/15 py-3 text-sm font-medium text-[#14231C]/70"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={chargement || password.length === 0}
              className="flex-1 rounded-lg bg-[#2B3A67] py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {chargement ? 'Vérification…' : 'Entrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
