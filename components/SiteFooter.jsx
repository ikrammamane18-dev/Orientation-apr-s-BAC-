import Link from 'next/link';

const NUMERO_WHATSAPP = '2290153731434';
const EMAIL_CONTACT = 'mamaneikram614@gmail.com';

/**
 * components/SiteFooter.jsx
 *
 * Regroupe les informations qu'un visiteur cherche en bas de page sur un
 * site qui prend son argent : qui êtes-vous, comment vous joindre, quelles
 * sont les règles. Affiché sur toutes les pages publiques (voir
 * SiteChrome.jsx), pas sur /admin.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[#14231C]/10 bg-white px-5 pb-10 pt-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B6E4F] text-sm font-bold text-white">
            OB
          </div>
          <p className="font-serif font-bold text-[#14231C]">
            Trouve ta voie <span className="text-[#0B6E4F]">après le BAC</span>
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[#14231C]/60">
          Une plateforme béninoise qui aide chaque bachelier à comprendre ses chances de bourse
          d'État et à choisir la filière qui lui correspond, dans le public comme dans le privé.
        </p>

        <div className="mt-5 flex gap-3">
          <a
            href={`https://wa.me/${NUMERO_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F7F2] text-[#14231C]/60"
          >
            💬
          </a>
          <a
            href={`mailto:${EMAIL_CONTACT}`}
            aria-label="Email"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F7F2] text-[#14231C]/60"
          >
            ✉️
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2 font-semibold text-[#14231C]">Navigation</p>
            <ul className="space-y-1.5 text-[#14231C]/60">
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/test">Faire le test</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#14231C]">Légal</p>
            <ul className="space-y-1.5 text-[#14231C]/60">
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/confidentialite">Confidentialité</Link></li>
              <li><Link href="/cgu">CGU</Link></li>
              <li><Link href="/cgv">CGV</Link></li>
              <li><Link href="/cookies">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 space-y-1 border-t border-[#14231C]/10 pt-5 text-sm text-[#14231C]/60">
          <p>📧 {EMAIL_CONTACT}</p>
          <p>📞 +229 01 53 73 14 34</p>
          <p>📍 Bénin</p>
        </div>

        <p className="mt-6 text-center text-xs text-[#14231C]/40">
          © {new Date().getFullYear()} — Fait pour les bacheliers du Bénin
        </p>
      </div>
    </footer>
  );
}
