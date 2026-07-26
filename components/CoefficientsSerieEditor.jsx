'use client';

import { useState } from 'react';

/**
 * components/CoefficientsSerieEditor.jsx
 *
 * Un bloc dépliable par série. Les codes et noms de matière restent en
 * lecture seule (ils doivent correspondre exactement à ceux utilisés dans
 * lib/bacSeries.js pour que le formulaire public reste synchronisé) ; seul
 * le coefficient est éditable.
 */
export default function CoefficientsSerieEditor({ serieCode, serieNom, serieGroupe, matieresInitiales, sourceDb }) {
  const [ouvert, setOuvert] = useState(false);
  const [matieres, setMatieres] = useState(matieresInitiales);
  const [statut, setStatut] = useState('idle'); // idle | enregistrement | succes | erreur
  const [erreur, setErreur] = useState('');

  function handleChangeCoefficient(index, valeur) {
    const copie = [...matieres];
    copie[index] = { ...copie[index], coefficient: valeur === '' ? '' : Number(valeur) };
    setMatieres(copie);
  }

  async function handleEnregistrer() {
    setStatut('enregistrement');
    setErreur('');
    try {
      const res = await fetch('/api/admin/coefficients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serieCode, serieNom, serieGroupe, matieres }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);
      setStatut('succes');
    } catch (err) {
      setStatut('erreur');
      setErreur(err.message);
    }
  }

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-medium text-[#14231C]">
          {serieCode} — {serieNom}
        </span>
        <span className="flex items-center gap-2 text-xs">
          {!sourceDb && (
            <span className="rounded-full bg-[#E8A33D]/15 px-2 py-0.5 font-semibold text-[#E8A33D]">
              valeurs par défaut
            </span>
          )}
          <span className="text-[#14231C]/40">{ouvert ? '▲' : '▼'}</span>
        </span>
      </button>

      {ouvert && (
        <div className="border-t border-[#14231C]/10 p-4">
          <div className="space-y-2">
            {matieres.map((matiere, index) => (
              <div key={matiere.code} className="flex items-center justify-between gap-3">
                <span className="flex-1 text-sm text-[#14231C]/80">{matiere.nom}</span>
                <input
                  type="number"
                  step={0.5}
                  min={0.5}
                  max={20}
                  value={matiere.coefficient}
                  onChange={(e) => handleChangeCoefficient(index, e.target.value)}
                  className="w-20 rounded-lg border border-[#14231C]/15 px-3 py-1.5 text-center font-mono text-sm"
                />
              </div>
            ))}
          </div>

          {erreur && <p className="mt-3 text-sm text-[#D65A46]">{erreur}</p>}
          {statut === 'succes' && <p className="mt-3 text-sm text-[#0B6E4F]">Coefficients enregistrés ✓</p>}

          <button
            type="button"
            onClick={handleEnregistrer}
            disabled={statut === 'enregistrement'}
            className="mt-4 w-full rounded-lg bg-[#0B6E4F] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {statut === 'enregistrement' ? 'Enregistrement…' : 'Enregistrer cette série'}
          </button>
        </div>
      )}
    </div>
  );
}
