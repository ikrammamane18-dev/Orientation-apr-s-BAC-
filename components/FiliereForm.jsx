'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LISTE_SERIES } from '@/lib/bacSeries';

export default function FiliereForm() {
  const router = useRouter();
  const [champs, setChamps] = useState({
    nom: '',
    universite: '',
    etablissement: '',
    seuilAdmission: '',
    quotaIndicatif: '',
  });
  const [seriesChoisies, setSeriesChoisies] = useState([]);
  const [statut, setStatut] = useState('idle');
  const [erreur, setErreur] = useState('');

  function toggleSerie(code) {
    setSeriesChoisies((prec) => (prec.includes(code) ? prec.filter((c) => c !== code) : [...prec, code]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatut('enregistrement');
    setErreur('');

    try {
      const res = await fetch('/api/admin/filieres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: champs.nom,
          universite: champs.universite,
          etablissement: champs.etablissement || undefined,
          seuilAdmission: Number(champs.seuilAdmission),
          quotaIndicatif: champs.quotaIndicatif ? Number(champs.quotaIndicatif) : undefined,
          seriesEligibles: seriesChoisies,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);

      setChamps({ nom: '', universite: '', etablissement: '', seuilAdmission: '', quotaIndicatif: '' });
      setSeriesChoisies([]);
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
        placeholder="Nom de la filière (ex: Génie Civil)"
        value={champs.nom}
        onChange={(e) => setChamps({ ...champs, nom: e.target.value })}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <input
          required
          placeholder="Université (ex: UAC)"
          value={champs.universite}
          onChange={(e) => setChamps({ ...champs, universite: e.target.value })}
          className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
        />
        <input
          placeholder="Établissement (ex: EPAC)"
          value={champs.etablissement}
          onChange={(e) => setChamps({ ...champs, etablissement: e.target.value })}
          className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <input
          required
          type="number"
          step={0.1}
          placeholder="Seuil d'admission indicatif (/20)"
          value={champs.seuilAdmission}
          onChange={(e) => setChamps({ ...champs, seuilAdmission: e.target.value })}
          className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Quota indicatif (optionnel)"
          value={champs.quotaIndicatif}
          onChange={(e) => setChamps({ ...champs, quotaIndicatif: e.target.value })}
          className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-[#14231C]/60">Séries éligibles</p>
        <div className="flex flex-wrap gap-1.5">
          {LISTE_SERIES.map((s) => (
            <button
              type="button"
              key={s.code}
              onClick={() => toggleSerie(s.code)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                seriesChoisies.includes(s.code)
                  ? 'border-[#0B6E4F] bg-[#0B6E4F]/10 text-[#0B6E4F]'
                  : 'border-[#14231C]/15 text-[#14231C]/50'
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      {erreur && <p className="text-sm text-[#D65A46]">{erreur}</p>}
      {statut === 'succes' && <p className="text-sm text-[#0B6E4F]">Filière ajoutée ✓</p>}

      <button
        type="submit"
        disabled={statut === 'enregistrement' || seriesChoisies.length === 0}
        className="w-full rounded-lg bg-[#0B6E4F] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {statut === 'enregistrement' ? 'Ajout…' : 'Ajouter la filière'}
      </button>
    </form>
  );
}
