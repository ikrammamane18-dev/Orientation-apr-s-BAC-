/**
 * lib/payment.js
 *
 * Comment l'argent arrive réellement sur vos comptes :
 * ------------------------------------------------------
 * KKiaPay et FedaPay ne sont PAS des concurrents de vos numéros Mobile Money :
 * ce sont des agrégateurs qui encaissent à votre place puis reversent les
 * fonds sur le compte Mobile Money QUE VOUS AVEZ ENREGISTRÉ chez eux.
 * Concrètement : vous créez un compte marchand KKiaPay (pièce d'identité +
 * numéro de téléphone, quelques minutes), puis dans le tableau de bord
 * KKiaPay vous indiquez que les fonds doivent être reversés sur :
 *   - 0153731434 (MTN MoMo)
 *   - 0143599669 (Moov Money / Celtiis Cash)
 * Rien à changer côté code pour ça : c'est une configuration dans leur
 * dashboard, pas dans ce fichier. Ces deux numéros sont repris ci-dessous en
 * variables d'environnement uniquement à titre de référence (affichage,
 * reçus, support client), jamais comme identifiants secrets.
 *
 * Pourquoi passer par un agrégateur plutôt que par un lien direct vers vos
 * numéros :
 *   1. Confirmation automatique et fiable du paiement (webhook signé) —
 *      c'est ce qui permet de débloquer le rapport instantanément, sans
 *      intervention humaine, et sans que quelqu'un puisse débloquer un
 *      rapport gratuitement en mentant sur un paiement.
 *   2. Les comptes Mobile Money "particulier" ont des plafonds de dépôt/mois
 *      fixés par la BCEAO selon le niveau de KYC ; un volume de commerçant
 *      (milliers de transactions) sur un compte particulier peut déclencher
 *      un blocage ou un contrôle de l'opérateur pour usage non conforme aux
 *      CGU. Un compte marchand agrégateur est fait pour absorber ce volume.
 *   3. Traçabilité fiscale et comptable propre (utile en cas de contrôle).
 *
 * PAYMENT_MODE=kkiapay (recommandé) utilise le flux ci-dessous.
 * PAYMENT_MODE=manuel active un filet de secours tant que le compte
 * agrégateur n'est pas encore créé — voir initierPaiementManuel().
 * Le mode manuel n'offre PAS de déblocage automatique et ne doit être vu
 * que comme une solution temporaire (voir ARCHITECTURE.md §8).
 */

const PAYMENT_MODE = process.env.PAYMENT_MODE ?? 'manuel';

// Prix du rapport complet. Défini UNIQUEMENT ici, côté serveur — jamais envoyé
// par le client dans la requête de paiement. Un montant transmis par le
// navigateur pourrait être falsifié (ex: envoyer 1 FCFA au lieu de 325) ;
// la seule source de vérité pour "combien l'étudiant doit payer" doit être
// le serveur, jamais une donnée reçue du client.
export const PRIX_RAPPORT_FCFA = Number(process.env.PRIX_RAPPORT_FCFA) || 325;

export const NUMEROS_RECEPTION = {
  mtnMomo: process.env.MERCHANT_MOMO_NUMBER ?? '0153731434',
  moovMoney: process.env.MERCHANT_MOOV_NUMBER ?? '0143599669',
};

/**
 * Initie un paiement KKiaPay. À appeler depuis /api/payment/initiate.
 * Nécessite KKIAPAY_PUBLIC_KEY / KKIAPAY_PRIVATE_KEY / KKIAPAY_SECRET
 * (fournies par votre tableau de bord KKiaPay).
 */
export async function initierPaiementKkiapay({ sessionTestId }) {
  if (!process.env.KKIAPAY_PRIVATE_KEY) {
    throw new Error(
      "KKIAPAY_PRIVATE_KEY manquant : créez votre compte marchand sur kkiapay.me, " +
        'renseignez vos clés dans .env.local, et enregistrez vos numéros MTN MoMo / Moov ' +
        'comme comptes de reversement dans leur tableau de bord.'
    );
  }

  // Le widget KKiaPay (client) a besoin d'une clé PUBLIQUE et d'une référence
  // de transaction unique, générée et enregistrée côté serveur AVANT tout
  // affichage du widget, afin que le webhook puisse la retrouver.
  return {
    provider: 'kkiapay',
    publicKey: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
    amount: PRIX_RAPPORT_FCFA,
    reference: sessionTestId, // sert à réconcilier le webhook avec la bonne session_test
    sandbox: process.env.KKIAPAY_SANDBOX === 'true',
  };
}

/**
 * Vérifie le webhook KKiaPay.
 *
 * D'après la documentation officielle (docs.kkiapay.me/v1/tableau-de-bord/webhook,
 * vérifiée le 25/07/2026) : KKiaPay n'envoie PAS une signature HMAC calculée sur
 * le corps de la requête. Il envoie directement, dans l'en-tête `x-kkiapay-secret`,
 * le secret que VOUS avez défini vous-même en créant le webhook dans leur
 * tableau de bord. La vérification consiste donc simplement à comparer cette
 * valeur à `KKIAPAY_SECRET` — pas à recalculer un hash du payload.
 *
 * ⚠️ Si KKiaPay fait évoluer ce mécanisme après juillet 2026, reconfirmez sur
 * docs.kkiapay.me avant de faire confiance à cette fonction en production.
 */
export function verifierSecretWebhookKkiapay(secretRecu) {
  const secretAttendu = process.env.KKIAPAY_SECRET;
  if (!secretAttendu) throw new Error('KKIAPAY_SECRET manquant côté serveur');
  if (!secretRecu) return false;

  const bufAttendu = Buffer.from(secretAttendu);
  const bufRecu = Buffer.from(secretRecu);

  // timingSafeEqual exige deux buffers de même longueur, sinon il lève une
  // exception (ce qui donnerait, sans cette garde, un indice exploitable :
  // un attaquant pourrait déduire la longueur du secret par essais successifs).
  if (bufAttendu.length !== bufRecu.length) return false;

  return require('crypto').timingSafeEqual(bufAttendu, bufRecu);
}

/**
 * Solution de repli : paiement manuel vers vos numéros directement.
 * Aucune confirmation automatique n'est possible ici (pas d'API bancaire
 * derrière un simple transfert P2P) : l'étudiant envoie l'argent puis
 * transmet une preuve, qu'un administrateur valide manuellement depuis
 * /admin avant que le rapport ne soit débloqué.
 */
export function genererInstructionsPaiementManuel() {
  return {
    provider: 'manuel',
    montant: PRIX_RAPPORT_FCFA,
    instructions: [
      `Envoyez ${PRIX_RAPPORT_FCFA} FCFA au ${NUMEROS_RECEPTION.mtnMomo} (MTN Mobile Money) via *880#`,
      `Ou au ${NUMEROS_RECEPTION.moovMoney} (Moov Money / Celtiis Cash)`,
      "Prenez une capture d'écran de la confirmation de l'opérateur",
      "Envoyez-la sur WhatsApp avec votre référence de session pour validation",
    ],
    delaiValidation: 'sous 1 à 24h (validation manuelle par un administrateur)',
  };
}

export function getModePaiementActif() {
  return PAYMENT_MODE;
}
