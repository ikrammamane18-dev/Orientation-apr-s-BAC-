'use client';

/**
 * components/PrintButton.jsx
 *
 * Solution simple et sans dépendance serveur pour le "téléchargement PDF" :
 * on s'appuie sur l'impression navigateur (Enregistrer au format PDF), avec
 * une feuille de style d'impression dédiée sur la page qui l'utilise.
 *
 * Pour un PDF plus abouti et à votre charte graphique exacte (logo, mise en
 * page fixe), une évolution possible est une génération serveur avec
 * `@react-pdf/renderer` — non nécessaire pour un premier lancement.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden w-full rounded-xl bg-[#2B3A67] py-4 text-base font-semibold text-white shadow-lg"
    >
      Télécharger en PDF
    </button>
  );
}
