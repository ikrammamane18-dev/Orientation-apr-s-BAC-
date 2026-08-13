export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">Mentions légales</h1>

      <div className="mt-3 rounded-xl bg-[#E8A33D]/10 p-3 text-xs text-[#14231C]/70">
        ⚠️ Brouillon à compléter avec vos informations exactes, à faire valider par un
        professionnel avant publication (voir CONFORMITE-LEGALE.md).
      </div>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#14231C]/80">
        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Éditeur du site</h2>
          <p>
            [Nom / raison sociale de l'exploitant du site], [statut : entreprise individuelle,
            société...], [numéro IFU si applicable], [adresse au Bénin].
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Contact</h2>
          <p>Email : mamaneikram614@gmail.com</p>
          <p>Téléphone / WhatsApp : +229 01 53 73 14 34</p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Hébergement</h2>
          <p>
            Ce site est hébergé par [Vercel Inc. / nom de l'hébergeur choisi], [adresse de
            l'hébergeur].
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de ce site (textes, mise en page, code) est la propriété de
            l'éditeur, sauf mention contraire. Toute reproduction sans autorisation est interdite.
          </p>
        </section>
      </div>
    </main>
  );
}
