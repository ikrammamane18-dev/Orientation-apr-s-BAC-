import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseClient';
import FiliereForm from '@/components/FiliereForm';
import FiliereDeleteButton from '@/components/FiliereDeleteButton';

export default async function AdminFilieresPage() {
  const token = cookies().get('admin_session')?.value;
  try {
    jwt.verify(token ?? '', process.env.ADMIN_JWT_SECRET);
  } catch {
    redirect('/');
  }

  const { data: filieres } = await supabaseAdmin
    .from('filieres')
    .select('id, nom, universite, etablissement, seuil_admission, quota_indicatif, filieres_series_eligibles(serie_code)')
    .order('universite');

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[#F5F7F2] px-5 pb-16 pt-10">
      <Link href="/admin" className="text-sm text-[#14231C]/50">
        ← Retour au dashboard
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-[#14231C]">Filières publiques</h1>
      <p className="mt-1 text-sm text-[#14231C]/60">
        Le seuil d'admission est indicatif — utilisé pour estimer un taux de compatibilité, pas
        une valeur officielle garantie.
      </p>

      <div className="mt-4">
        <FiliereForm />
      </div>

      <div className="mt-6 space-y-2">
        {(filieres ?? []).map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
            <div>
              <p className="text-sm font-medium text-[#14231C]">{f.nom}</p>
              <p className="text-xs text-[#14231C]/50">
                {f.universite} {f.etablissement ? `— ${f.etablissement}` : ''} · seuil {f.seuil_admission}/20 ·{' '}
                {(f.filieres_series_eligibles ?? []).map((s) => s.serie_code).join(', ')}
              </p>
            </div>
            <FiliereDeleteButton id={f.id} />
          </div>
        ))}
        {(filieres ?? []).length === 0 && (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-[#14231C]/50 shadow-sm">
            Aucune filière enregistrée pour le moment.
          </p>
        )}
      </div>
    </main>
  );
}
