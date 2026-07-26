import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseClient';
import BoursesForm from '@/components/BoursesForm';

// Empêche l'exécution au moment du build statique
export const dynamic = 'force-dynamic';

export default async function AdminBoursesPage() {
  // 1. Récupération asynchrone des cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  // 2. Vérification du JWT avec 'jose' (compatible Edge/Next.js App Router)
  if (!token) {
    redirect('/');
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    await jwtVerify(token, secret);
  } catch {
    redirect('/');
  }

  // 3. Récupération des données en BDD
  const { data: bourse } = await supabaseAdmin
    .from('bourses')
    .select('*')
    .limit(1)
    .maybeSingle();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#F5F7F2] px-5 pb-16 pt-10">
      <Link href="/admin" className="text-sm text-[#14231C]/50 hover:underline">
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