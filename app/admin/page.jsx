import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseClient';
import ValiderPaiementButton from '@/components/ValiderPaiementButton';

/**
 * app/admin/page.jsx
 *
 * middleware.js bloque déjà l'accès sans cookie valide, mais on revérifie
 * ici (défense en profondeur : si jamais le middleware était un jour mal
 * configuré ou contourné, cette page reste protégée par elle-même).
 */
export default async function AdminPage() {
  const token = cookies().get('admin_session')?.value;
  try {
    jwt.verify(token ?? '', process.env.ADMIN_JWT_SECRET);
  } catch {
    redirect('/');
  }

  const [{ data: transactions }, { data: demandes }] = await Promise.all([
    supabaseAdmin
      .from('transactions')
      .select('id, montant_fcfa, statut, moyen_paiement, created_at, session_test_id')
      .order('created_at', { ascending: false })
      .limit(50),
    supabaseAdmin
      .from('contacts_prive')
      .select('id, nom, telephone, message, traite, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[#F5F7F2] px-5 pb-16 pt-10">
      <h1 className="font-serif text-2xl font-bold text-[#14231C]">Dashboard Admin</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/admin/filieres" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2B3A67] shadow-sm">
          Filières
        </Link>
        <Link href="/admin/coefficients" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2B3A67] shadow-sm">
          Coefficients
        </Link>
        <Link href="/admin/bourses" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2B3A67] shadow-sm">
          Seuils de bourse
        </Link>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 font-serif text-lg font-bold text-[#14231C]">
          Transactions récentes
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {(transactions ?? []).map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-[#14231C]/5 p-3 last:border-0">
              <div>
                <p className="font-mono text-sm text-[#14231C]">{t.montant_fcfa} FCFA</p>
                <p className="text-xs text-[#14231C]/50">
                  {t.moyen_paiement ?? '—'} · {new Date(t.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    t.statut === 'validee'
                      ? 'bg-[#0B6E4F]/10 text-[#0B6E4F]'
                      : t.statut === 'en_attente'
                        ? 'bg-[#E8A33D]/10 text-[#E8A33D]'
                        : 'bg-[#D65A46]/10 text-[#D65A46]'
                  }`}
                >
                  {t.statut}
                </span>
                {t.statut === 'en_attente' && <ValiderPaiementButton transactionId={t.id} />}
              </div>
            </div>
          ))}
          {(transactions ?? []).length === 0 && (
            <p className="p-4 text-sm text-[#14231C]/50">Aucune transaction pour le moment.</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 font-serif text-lg font-bold text-[#14231C]">
          Demandes d'accompagnement privé
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {(demandes ?? []).map((d) => (
            <div key={d.id} className="border-b border-[#14231C]/5 p-3 last:border-0">
              <p className="font-medium text-[#14231C]">{d.nom} — {d.telephone}</p>
              {d.message && <p className="text-sm text-[#14231C]/60">{d.message}</p>}
              <p className="text-xs text-[#14231C]/40">{new Date(d.created_at).toLocaleString('fr-FR')}</p>
            </div>
          ))}
          {(demandes ?? []).length === 0 && (
            <p className="p-4 text-sm text-[#14231C]/50">Aucune demande pour le moment.</p>
          )}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-[#14231C]/40">
        Gestion des filières, coefficients et critères de bourse : à brancher sur les tables
        `filieres`, `matieres_coefficients` et `bourses` (formulaires CRUD à ajouter selon vos
        priorités).
      </p>
    </main>
  );
}
