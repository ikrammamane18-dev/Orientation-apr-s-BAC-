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
