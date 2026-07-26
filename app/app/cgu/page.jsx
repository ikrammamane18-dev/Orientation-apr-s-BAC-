export default function CguPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">
        Conditions Générales d'Utilisation
      </h1>

      <div className="mt-3 rounded-xl bg-[#E8A33D]/10 p-3 text-xs text-[#14231C]/70">
        ⚠️ Brouillon à faire valider par un professionnel avant publication.
      </div>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#14231C]/80">
        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Objet</h2>
          <p>
            Ce site propose un outil d'estimation de compatibilité avec les filières
            universitaires publiques et l'éligibilité à une bourse d'État, à titre indicatif.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Nature indicative des résultats</h2>
          <p>
            Les taux d'admissibilité et niveaux d'éligibilité affichés sont des estimations
            basées sur des critères déclaratifs et des seuils indicatifs. Ils ne constituent ni
            une garantie d'admission, ni une décision officielle du MESRS ou d'une université.
            Seules les procédures officielles font foi.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Exactitude des notes saisies</h2>
          <p>
            Vous êtes responsable de l'exactitude des notes que vous saisissez ; le résultat en
            dépend directement.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Compte et accès</h2>
          <p>
            Certaines fonctionnalités (rapport complet) sont conditionnées à un paiement. L'accès
            au rapport est personnel et lié à votre session de test.
          </p>
        </section>
      </div>
    </main>
  );
}
