import Link from 'next/link';
import { LISTE_SERIES } from '@/lib/bacSeries';

export default function AccueilPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-10 pt-14">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0B6E4F] text-2xl font-bold text-white shadow-lg">
        OB
      </div>

      {/* Bandeau de repère — évite une promesse invérifiable ("n°1") tant
          qu'aucune donnée ne l'appuie ; à remplacer par un vrai chiffre
          (ex: "1200+ bacheliers accompagnés") dès que vous l'aurez. */}
      <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full bg-[#E8A33D]/15 px-3 py-1 text-xs font-semibold text-[#E8A33D]">
        <span aria-hidden>🇧🇯</span> Fait pour les bacheliers du Bénin
      </div>

      <h1 className="text-center font-serif text-3xl font-bold leading-tight text-[#14231C]">
        Vos notes du BAC valent une bourse.
        <br />
        <span className="text-[#0B6E4F]">Découvrez laquelle.</span>
      </h1>

      <p className="mt-4 text-center text-[#14231C]/70">
        En 2 minutes : votre chance réelle d'obtenir une bourse d'État et le classement des
        filières publiques et privées qui vous correspondent le mieux — toutes séries BAC
        acceptées.
      </p>

      <Link
        href="/test"
        className="mt-8 block w-full rounded-xl bg-[#0B6E4F] py-4 text-center text-base font-semibold text-white shadow-lg shadow-[#0B6E4F]/20"
      >
        Faire le test gratuitement
      </Link>

      {/* Nombre de séries calculé depuis lib/bacSeries.js (pas un chiffre en
          dur) : s'il change un jour (ajout d'une série), ce bandeau reste
          juste automatiquement. Le Bénin a compté 14 séries à la session BAC
          2026 selon l'Office du Baccalauréat ; si une série manque encore ici,
          ajoutez-la dans lib/bacSeries.js. */}
      <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-center">
          <p className="font-serif text-xl font-bold text-[#14231C]">{LISTE_SERIES.length}</p>
          <p className="text-xs text-[#14231C]/50">Séries BAC</p>
        </div>
        <div className="text-center border-x border-[#14231C]/10">
          <p className="font-serif text-xl font-bold text-[#14231C]">4</p>
          <p className="text-xs text-[#14231C]/50">Universités publiques</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-xl font-bold text-[#14231C]">2 min</p>
          <p className="text-xs text-[#14231C]/50">Pour un résultat</p>
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-[#14231C]/70">
        <li className="flex gap-2">
          <span aria-hidden>✅</span> Basé sur les critères réels du MESRS
        </li>
        <li className="flex gap-2">
          <span aria-hidden>✅</span> Toutes les séries : A1 à G3
        </li>
        <li className="flex gap-2">
          <span aria-hidden>✅</span> Rapport complet dès 325 FCFA, payable par Mobile Money
        </li>
        <li className="flex gap-2">
          <span aria-hidden>✅</span> Accompagnement personnalisé vers le privé si besoin
        </li>
      </ul>
    </main>
  );
}
