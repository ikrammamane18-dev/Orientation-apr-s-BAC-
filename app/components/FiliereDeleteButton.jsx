'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FiliereDeleteButton({ id }) {
  const [enCours, setEnCours] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm('Supprimer cette filière ?')) return;
    setEnCours(true);
    const res = await fetch('/api/admin/filieres', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setEnCours(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={enCours}
      className="rounded-lg px-2 py-1 text-xs font-medium text-[#D65A46] disabled:opacity-50"
    >
      {enCours ? '…' : 'Supprimer'}
    </button>
  );
}
