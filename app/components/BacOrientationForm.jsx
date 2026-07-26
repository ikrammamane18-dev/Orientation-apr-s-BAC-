'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LISTE_SERIES, getMatieresBySerie } from '@/lib/bacSeries';
import { useSecretClicks } from '@/hooks/useSecretClicks';
import AdminAccessModal from './AdminAccessModal';

/**
 * components/BacOrientationForm.jsx
 *
 * Étape 1 (gratuite) du parcours : sélection de la série puis saisie des notes.
 * Le logo en en-tête sert de zone cachée pour l'accès admin : 5 clics rapides
 * ouvrent AdminAccessModal (voir hooks/useSecretClicks.js).
 */
export default function BacOrientationForm() {
  const router = useRouter();
  const [codeSerie, setCodeSerie] = useState('');
  const [notes, setNotes] = useState({});
  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const matieres = useMemo(() => (codeSerie ? getMatieresBySerie(codeSerie) : []), [codeSerie]);

  const handleLogoClick = useSecretClicks({
    requiredClicks: 5,
    windowMs: 600,
    onUnlock: () => setShowAdminModal(true),
  });

  function handleSerieChange(nouvelleSerie) {
    setCodeSerie(nouvelleSerie);
    setNotes({});
    setErreur('');
  }

  function handleNoteChange(codeMatiere, valeur) {
    const nombre = valeur === '' ? '' : Number(valeur);
    setNotes((precedent) => ({ ...precedent, [codeMatiere]: nombre }));
  }

  const formulaireComplet =
    codeSerie !== '' &&
    matieres.length > 0 &&
    matieres.every((m) => typeof notes[m.code] === 'number' && notes[m.code] >= 0 && notes[m.code] <= 20);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (!formulaireComplet) {
      setErreur('Merci de renseigner une note valide (entre 0 et 20) pour chaque matière.');
      return;
    }

    setEnvoiEnCours(true);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeSerie, notes }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // On remonte le vrai message serveur (ex: "Variables Supabase manquantes",
        // "Série inconnue"...) plutôt qu'un texte générique qui masque la cause.
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      router.push(`/resultats/${data.sessionId}`);
    } catch (err) {
      setErreur(
        err.message && err.message !== 'Failed to fetch'
          ? err.message
          : 'Une erreur est survenue. Merci de réessayer dans un instant.'
      );
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-28 pt-8">
      {/* En-tête / logo — zone cachée de l'Easter Egg admin */}
      <header className="mb-8 flex flex-col items-center select-none">
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Logo"
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#0B6E4F] text-xl font-bold text-white shadow-md active:scale-95 transition-transform"
        >
          OB
        </button>
        <h1 className="text-center font-serif text-2xl font-bold text-[#14231C]">
          Trouve ta voie après le BAC
        </h1>
        <p className="mt-1 text-center text-sm text-[#14231C]/60">
          Bourse d'État, filières publiques et privées — en 2 minutes
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sélection de la série */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#14231C]">
            Quelle est votre série au BAC ?
          </label>
          <select
            value={codeSerie}
            onChange={(e) => handleSerieChange(e.target.value)}
            className="w-full rounded-xl border border-[#14231C]/15 bg-white px-4 py-3 text-[#14231C] outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
          >
            <option value="">Sélectionnez votre série</option>
            {Object.entries(
              LISTE_SERIES.reduce((groupes, serie) => {
                (groupes[serie.groupe] ??= []).push(serie);
                return groupes;
              }, {})
            ).map(([groupe, series]) => (
              <optgroup key={groupe} label={groupe}>
                {series.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.nom}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Notes dynamiques selon la série choisie */}
        {matieres.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-[#14231C]/70">
              Entrez vos notes sur 20 (coefficients affichés à titre indicatif)
            </p>
            <div className="space-y-3">
              {matieres.map((matiere) => (
                <div key={matiere.code} className="flex items-center justify-between gap-3">
                  <label htmlFor={matiere.code} className="flex-1 text-sm text-[#14231C]">
                    {matiere.nom}
                    <span className="ml-1 font-mono text-xs text-[#14231C]/40">
                      (coef. {matiere.coefficient})
                    </span>
                  </label>
                  <input
                    id={matiere.code}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={20}
                    step={0.25}
                    value={notes[matiere.code] ?? ''}
                    onChange={(e) => handleNoteChange(matiere.code, e.target.value)}
                    placeholder="—"
                    className="w-20 rounded-lg border border-[#14231C]/15 px-3 py-2 text-center font-mono outline-none focus:border-[#0B6E4F] focus:ring-2 focus:ring-[#0B6E4F]/20"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {erreur && (
          <p className="rounded-lg bg-[#D65A46]/10 px-4 py-3 text-sm text-[#D65A46]">{erreur}</p>
        )}

        <button
          type="submit"
          disabled={!formulaireComplet || envoiEnCours}
          className="w-full rounded-xl bg-[#0B6E4F] py-4 text-base font-semibold text-white shadow-lg shadow-[#0B6E4F]/20 disabled:opacity-40"
        >
          {envoiEnCours ? 'Analyse en cours…' : 'Voir mes résultats gratuitement'}
        </button>
      </form>

      <AdminAccessModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  );
}
