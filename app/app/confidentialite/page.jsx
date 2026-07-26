export default function ConfidentialitePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">
        Politique de confidentialité
      </h1>

      <div className="mt-3 rounded-xl bg-[#E8A33D]/10 p-3 text-xs text-[#14231C]/70">
        ⚠️ Brouillon à faire valider par un professionnel avant publication (voir
        CONFORMITE-LEGALE.md). Traitement soumis à la loi n°2017-20 (Code du numérique du Bénin)
        et au contrôle de l'APDP. Déclaration à effectuer sur service.apdp.bj avant publication
        définitive — remplacez la ligne ci-dessous par la date réelle une fois faite.
      </div>

      <p className="mt-3 text-xs text-[#14231C]/50">
        [Ce site a fait l'objet d'une déclaration auprès de l'Autorité de Protection des
        Données à caractère Personnel (apdp.bj) le [DATE À COMPLÉTER]]
      </p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#14231C]/80">
        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Données collectées</h2>
          <p>
            Série et notes du BAC (nécessaires au calcul), et facultativement nom, téléphone et
            email si vous souhaitez recevoir votre rapport ou être recontacté. En cas de paiement,
            les données de transaction sont traitées par notre prestataire de paiement.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Finalité</h2>
          <p>
            Calculer votre compatibilité avec les filières et bourses, générer votre rapport, et
            vous recontacter si vous demandez un accompagnement vers le privé.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Durée de conservation</h2>
          <p>
            [À définir — ex : 12 mois pour les sessions non converties en paiement, durée légale
            de conservation des transactions pour les données de paiement].
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Vos droits</h2>
          <p>
            Vous pouvez demander l'accès, la rectification ou la suppression de vos données à
            tout moment en écrivant à mamaneikram614@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-[#14231C]">Partage des données</h2>
          <p>
            Vos données ne sont jamais vendues. Elles peuvent être transmises à notre prestataire
            de paiement Mobile Money (uniquement les données nécessaires à la transaction) et,
            si vous en faites la demande, à notre partenaire d'accompagnement vers le privé.
          </p>
        </section>
      </div>
    </main>
  );
}
