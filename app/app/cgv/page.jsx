export default function CgvPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">
        Conditions Générales de Vente
      </h1>

      <div className="mt-3 rounded-xl bg-[#E8A33D]/10 p-3 text-xs text-[#14231C]/70">
        ⚠️ Brouillon à faire valider par un professionnel avant publication.
      </div>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#14231C]/80">
        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Produit vendu</h2>
          <p>
            Accès à un rapport d'orientation complet (classement détaillé des filières, taux
            d'admissibilité, détail de l'éligibilité à une bourse), au prix de 325 FCFA.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Moyens de paiement</h2>
          <p>MTN Mobile Money, Moov Money / Celtiis Cash, et selon disponibilité Wave.</p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Livraison</h2>
          <p>
            Le rapport est accessible immédiatement après confirmation automatique du paiement
            (paiement en ligne), ou sous 1 à 24h en cas de validation manuelle.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Remboursement</h2>
          <p>
            En cas d'échec technique empêchant l'accès au rapport après un paiement confirmé par
            l'opérateur Mobile Money, contactez mamaneikram614@gmail.com ou WhatsApp
            +229 01 53 73 14 34 pour un remboursement ou un déblocage manuel.
          </p>
        </section>
      </div>
    </main>
  );
}
