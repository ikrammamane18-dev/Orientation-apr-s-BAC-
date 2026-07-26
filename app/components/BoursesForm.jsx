'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BoursesForm({ valeursInitiales }) {
  const router = useRouter();
  const [champs, setChamps] = useState({
    nom: valeursInitiales?.nom ?? 'Bourse DBSU standard',
    seuilForte: valeursInitiales?.seuil_forte ?? 14,
    seuilMoyenne: valeursInitiales?.seuil_moyenne ?? 12,
    montantFcfa: valeursInitiales?.montant_fcfa ?? '',
    description: valeursInitiales?.description ?? '',
  });
  const [statut, setStatut] = useState('idle');
  const [erreur, setErreur] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatut('enregistrement');
    setErreur('');

    try {
      const res = await fetch('/api/admin/bourses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: champs.nom,
          seuilForte: Number(champs.seuilForte),
          seuilMoyenne: Number(champs.seuilMoyenne),
          montantFcfa: champs.montantFcfa ? Number(champs.montantFcfa) : undefined,
          description: champs.description || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);
      setStatut('succes');
      router.refresh();
    } catch (err) {
      setStatut('erreur');
      setErreur(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <input
        required
        placeholder="Nom (ex: Bourse DBSU standard)"
        value={champs.nom}
        onChange={(e) => setChamps({ ...champs, nom: e.target.value })}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-[#14231C]/60">Seuil "Moyenne" (dès cette moyenne)</label>
          <input
            required
            type="number"
            step={0.1}
            value={champs.seuilMoyenne}
            onChange={(e) => setChamps({ ...champs, seuilMoyenne: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-[#14231C]/60">Seuil "Forte" (dès cette moyenne)</label>
          <input
            required
            type="number"
            step={0.1}
            value={champs.seuilForte}
            onChange={(e) => setChamps({ ...champs, seuilForte: e.target.value })}
            className="mt-1 w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <input
        type="number"
        placeholder="Montant FCFA (optionnel, informatif)"
        value={champs.montantFcfa}
        onChange={(e) => setChamps({ ...champs, montantFcfa: e.target.value })}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
      />

      <textarea
        placeholder="Description (optionnelle)"
        value={champs.description}
        onChange={(e) => setChamps({ ...champs, description: e.target.value })}
        rows={2}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
      />

      {erreur && <p className="text-sm text-[#D65A46]">{erreur}</p>}
      {statut === 'succes' && <p className="text-sm text-[#0B6E4F]">Seuils enregistrés ✓ — pris en compte dès le prochain test.</p>}

      <button
        type="submit"
        disabled={statut === 'enregistrement'}
        className="w-full rounded-lg bg-[#0B6E4F] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {statut === 'enregistrement' ? 'Enregistrement…' : 'Enregistrer les seuils'}
      </button>
    </form>
  );
}
