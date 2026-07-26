import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseClient';
import BoursesForm from '@/components/BoursesForm';

export default async function AdminBoursesPage() {
  const token = cookies().get('admin_session')?.value;
  try {
    jwt.verify(token ?? '', process.env.ADMIN_JWT_SECRET);
  } catch {
    redirect('/');
  }

  const { data: bourse } = await supabaseAdmin.from('bourses').select('*').limit(1).maybeSingle();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <Link href="/admin" className="text-sm text-[#14231C]/50">
        ← Retour au dashboard
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-[#14231C]">Seuils de bourse</h1>
      <p className="mt-1 text-sm text-[#14231C]/60">
        Ces deux seuils déterminent le taux de pourcentage affiché aux étudiants (voir
        lib/scoringEngine.js). À faire valider auprès d'une source officielle du MESRS avant un
        lancement à grande échelle.
      </p>

      <div className="mt-4">
        <BoursesForm valeursInitiales={bourse} />
      </div>
    </main>
  );
}
{filieres.map((filiere) => (
  <div key={filiere.id} className="mb-4 rounded-xl border p-4 bg-white shadow-sm">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-lg">{filiere.nom}</h3>
      <span className="badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
        Taux d'admissibilité : {filiere.taux_admissibilite}%
      </span>
    </div>

    {/* NOUVEAU : Seuil d'admission et Quota indicatif */}
    <div className="mt-2 flex gap-4 text-xs text-gray-600">
      <p><strong>Seuil indicatif :</strong> {filiere.seuil_admission || 'N/A'} / 20</p>
      <p><strong>Quota indicatif :</strong> {filiere.quota || 'N/A'} places</p>
    </div>

    {/* NOUVEAU : Nom, montant et description de la bourse */}
    {filiere.bourse_nom && (
      <div className="mt-3 rounded-lg bg-emerald-50 p-3 border border-emerald-200">
        <p className="font-semibold text-emerald-900 text-sm">
          🎓 Bourse : {filiere.bourse_nom} {filiere.bourse_montant && `(${filiere.bourse_montant} FCFA/an)`}
        </p>

        {filiere.bourse_description && (
          <p className="text-xs text-emerald-700 mt-1">{filiere.bourse_description}</p>
        )}
      </div>
    )}
  </div>
))}