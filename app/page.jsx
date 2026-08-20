import { LISTE_SERIES, GROUPES } from '@/lib/bacSeries';
import Reveal from '@/components/Reveal';
import RippleLink from '@/components/RippleLink';

const POINTS_CLES = [
  { texte: 'Basé sur les critères réels du MESRS' },
  { texte: 'Toutes les séries : A1 à G3' },
  { texte: 'Rapport complet dès 325 FCFA, payable par Mobile Money' },
  { texte: 'Accompagnement personnalisé vers le privé si besoin' },
];

export default function AccueilPage() {
  // On exclut les spécialités DT/DEAT du compteur affiché : ce sont des
  // spécialités d'un même diplôme technique, pas des "séries" au sens
  // classique — les compter una par una gonflerait le chiffre de façon trompeuse.
  const seriesClassiques = LISTE_SERIES.filter(
    (s) => s.groupe !== GROUPES.TECHNIQUE_DT && s.groupe !== GROUPES.TECHNIQUE_DEAT
  );
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-10 pt-14">
      <Reveal
        as="div"
        delay={0}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0B6E4F] text-2xl font-bold text-white shadow-lg float-doux"
      >
        OB
      </Reveal>

      {/* Bandeau de repère — évite une promesse invérifiable ("n°1") tant
          qu'aucune donnée ne l'appuie ; à remplacer par un vrai chiffre
          (ex: "1200+ bacheliers accompagnés") dès que vous l'aurez. */}
      <Reveal
        as="div"
        delay={80}
        className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full bg-[#E8A33D]/15 px-3 py-1 text-xs font-semibold text-[#E8A33D]"
      >
        <span aria-hidden>🇧🇯</span> Fait pour les bacheliers du Bénin
      </Reveal>

      <Reveal
        as="h1"
        delay={160}
        className="text-center font-serif text-3xl font-bold leading-tight text-[#14231C]"
      >
        Vos notes du BAC valent une bourse.
        <br />
        <span className="text-[#0B6E4F]">Découvrez laquelle.</span>
      </Reveal>

      <Reveal as="p" delay={240} className="mt-4 text-center text-[#14231C]/70">
        En 2 minutes : votre chance réelle d'obtenir une bourse d'État et le classement des
        filières publiques et privées qui vous correspondent le mieux — toutes séries BAC
        acceptées.
      </Reveal>

      <RippleLink
        href="/test"
        delay={320}
        className="mt-8 block w-full rounded-xl bg-[#0B6E4F] py-4 text-center text-base font-semibold text-white shadow-lg shadow-[#0B6E4F]/20"
      >
        Faire le test gratuitement
      </RippleLink>

      {/* Nombre de séries calculé depuis lib/bacSeries.js (pas un chiffre en
          dur) : s'il change un jour (ajout d'une série), ce bandeau reste
          juste automatiquement. Le Bénin a compté 14 séries à la session BAC
          2026 selon l'Office du Baccalauréat ; si une série manque encore ici,
          ajoutez-la dans lib/bacSeries.js. */}
      <Reveal
        as="div"
        delay={400}
        className="mt-8 grid grid-cols-3 gap-2 rounded-2xl bg-white p-4 shadow-sm"
      >
        <div className="text-center">
          <p className="font-serif text-xl font-bold text-[#14231C]">{seriesClassiques.length}</p>
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
      </Reveal>

      <ul className="mt-6 space-y-3 text-sm text-[#14231C]/70">
        {POINTS_CLES.map((point, index) => (
          <Reveal key={point.texte} as="li" delay={480 + index * 90} className="flex gap-2">
            <span aria-hidden>✅</span> {point.texte}
          </Reveal>
        ))}
      </ul>
    </main>
  );
}
