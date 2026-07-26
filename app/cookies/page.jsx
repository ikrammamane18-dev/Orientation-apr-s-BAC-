export default function CookiesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">Politique relative aux cookies</h1>

      <div className="mt-3 rounded-xl bg-[#E8A33D]/10 p-3 text-xs text-[#14231C]/70">
        ⚠️ Brouillon — à adapter dès que vous ajoutez un outil d'analytics (Google Analytics,
        Plausible...) ou un pixel publicitaire, le cas échéant.
      </div>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#14231C]/80">
        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Cookies essentiels</h2>
          <p>
            Utilisés pour le fonctionnement du site (session admin sécurisée, mémorisation de
            votre choix de cookies). Ils ne peuvent pas être désactivés.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Cookies de mesure d'audience</h2>
          <p>
            [À compléter si vous ajoutez un outil de statistiques]. Aucun cookie de ce type n'est
            actif par défaut sur cette version du site.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Votre choix</h2>
          <p>
            Vous pouvez à tout moment effacer les données de votre navigateur pour réinitialiser
            votre choix, qui vous sera alors redemandé.
          </p>
        </section>
      </div>
    </main>
  );
}
