'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ValiderPaiementButton({ transactionId }) {
  const [enCours, setEnCours] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setEnCours(true);
    const res = await fetch('/api/payment/manuel/confirmer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    setEnCours(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={enCours}
      className="rounded-lg bg-[#0B6E4F] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
    >
      {enCours ? '…' : 'Valider'}
    </button>
  );
}
