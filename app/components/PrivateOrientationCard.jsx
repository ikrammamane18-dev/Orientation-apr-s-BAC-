'use client';

import { useState } from 'react';

const NUMERO_WHATSAPP = '2290153731434'; // format international sans "+"
const NUMERO_TEL = '+2290153731434';
const EMAIL_CONTACT = 'mamaneikram614@gmail.com';

const MESSAGE_WHATSAPP =
  "Bonjour, j'ai fait le test sur le site et j'aimerais avoir un accompagnement personnalisé pour m'orienter dans le privé.";

/**
 * components/PrivateOrientationCard.jsx
 *
 * S'affiche quand scoringEngine.doitAfficherOrientationPrivee(...) renvoie true,
 * ou si l'étudiant choisit explicitement l'option "orientation privé".
 *
 * Props :
 *  - prenom?: string — pour personnaliser légèrement le message (optionnel)
 */
export default function PrivateOrientationCard({ prenom }) {
  const [formOuvert, setFormOuvert] = useState(false);

  const lienWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MESSAGE_WHATSAPP)}`;

  return (
    <section
      aria-labelledby="orientation-privee-titre"
      className="mt-6 overflow-hidden rounded-2xl border-2 border-[#E8A33D] bg-gradient-to-b from-[#E8A33D]/10 to-white p-5 shadow-md"
    >
      <span className="inline-block rounded-full bg-[#E8A33D] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#14231C]">
        Accompagnement VIP
      </span>

      <h3 id="orientation-privee-titre" className="mt-3 font-serif text-lg font-bold text-[#14231C]">
        Vos notes ne vous permettent pas d'avoir une bourse publique ?
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-[#14231C]/70">
        Pas de panique{prenom ? `, ${prenom}` : ''} ! Nous vous accompagnons personnellement pour
        trouver la meilleure université privée adaptée à votre budget et à vos ambitions.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <a
          href={lienWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.98] transition-transform"
        >
          <WhatsAppIcon />
          Discuter sur WhatsApp
        </a>

        <a
          href={`tel:${NUMERO_TEL}`}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#2B3A67] py-3 text-sm font-semibold text-[#2B3A67] active:scale-[0.98] transition-transform"
        >
          <PhoneIcon />
          Appeler directement
        </a>

        <button
          type="button"
          onClick={() => setFormOuvert((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-xl bg-transparent py-3 text-sm font-medium text-[#14231C]/60 underline underline-offset-2"
        >
          Ou écrivez-nous par email
        </button>
      </div>

      {formOuvert && <ContactPriveForm emailDestinataire={EMAIL_CONTACT} />}
    </section>
  );
}

function ContactPriveForm({ emailDestinataire }) {
  const [champs, setChamps] = useState({ nom: '', telephone: '', message: '' });
  const [statut, setStatut] = useState('idle'); // idle | envoi | succes | erreur

  async function handleSubmit(e) {
    e.preventDefault();
    setStatut('envoi');

    try {
      // Enregistre la demande côté serveur (table contacts_prive) — voir database/schema.sql.
      // Le serveur peut ensuite notifier `emailDestinataire` par email transactionnel (ex : Resend).
      const res = await fetch('/api/contact-prive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(champs),
      });
      if (!res.ok) throw new Error();
      setStatut('succes');
    } catch {
      setStatut('erreur');
    }
  }

  if (statut === 'succes') {
    return (
      <p className="mt-4 rounded-lg bg-[#0B6E4F]/10 px-4 py-3 text-sm text-[#0B6E4F]">
        Merci ! Votre demande a bien été envoyée. Nous vous recontactons très vite.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2 border-t border-[#14231C]/10 pt-4">
      <input
        required
        type="text"
        placeholder="Votre nom"
        value={champs.nom}
        onChange={(e) => setChamps({ ...champs, nom: e.target.value })}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm outline-none focus:border-[#0B6E4F]"
      />
      <input
        required
        type="tel"
        placeholder="Votre numéro de téléphone"
        value={champs.telephone}
        onChange={(e) => setChamps({ ...champs, telephone: e.target.value })}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm outline-none focus:border-[#0B6E4F]"
      />
      <textarea
        placeholder="Votre message (optionnel)"
        value={champs.message}
        onChange={(e) => setChamps({ ...champs, message: e.target.value })}
        rows={3}
        className="w-full rounded-lg border border-[#14231C]/15 px-3 py-2 text-sm outline-none focus:border-[#0B6E4F]"
      />
      {statut === 'erreur' && (
        <p className="text-xs text-[#D65A46]">
          Envoi impossible. Vous pouvez aussi écrire directement à {emailDestinataire}.
        </p>
      )}
      <button
        type="submit"
        disabled={statut === 'envoi'}
        className="w-full rounded-lg bg-[#2B3A67] py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {statut === 'envoi' ? 'Envoi…' : 'Envoyer ma demande'}
      </button>
    </form>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.32 4.95L2 22l5.24-1.37a9.9 9.9 0 0 0 4.8 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.1c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.3-1.64-.6-2.88-1.25-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97s.73-2.1 1-2.39c.26-.28.57-.35.76-.35h.55c.18 0 .41-.02.63.48.24.55.8 1.93.87 2.07.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.26.14.44.2.5.32.07.13.07.71-.17 1.39Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
