import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { BAC_SERIES } from '@/lib/bacSeries';
import CoefficientsSerieEditor from '@/components/CoefficientsSerieEditor';

export default async function AdminCoefficientsPage() {
  const token = cookies().get('admin_session')?.value;
  try {
    jwt.verify(token ?? '', process.env.ADMIN_JWT_SECRET);
  } catch {
    redirect('/');
  }

  const { data: coefficientsDb } = await supabaseAdmin
    .from('matieres_coefficients')
    .select('serie_code, matiere_code, matiere_nom, coefficient');

  const parSerie = (coefficientsDb ?? []).reduce((acc, row) => {
    (acc[row.serie_code] ??= []).push(row);
    return acc;
  }, {});

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-16 pt-10">
      <Link href="/admin" className="text-sm text-[#14231C]/50">
        ← Retour au dashboard
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-[#14231C]">Coefficients par série</h1>
      <p className="mt-1 text-sm text-[#14231C]/60">
        Les séries marquées « valeurs par défaut » n'ont pas encore de coefficients validés en
        base — elles utilisent lib/bacSeries.js en attendant. Enregistrez une série pour qu'elle
        devienne la source de vérité.
      </p>

      <div className="mt-6 space-y-3">
        {Object.entries(BAC_SERIES).map(([code, serie]) => {
          const ligneDb = parSerie[code];
          const sourceDb = Boolean(ligneDb && ligneDb.length > 0);
          const matieresInitiales = sourceDb
            ? ligneDb.map((m) => ({ code: m.matiere_code, nom: m.matiere_nom, coefficient: m.coefficient }))
            : serie.matieres;

          return (
            <CoefficientsSerieEditor
              key={code}
              serieCode={code}
              serieNom={serie.nom}
              serieGroupe={serie.groupe}
              matieresInitiales={matieresInitiales}
              sourceDb={sourceDb}
            />
          );
        })}
      </div>
    </main>
  );
}
