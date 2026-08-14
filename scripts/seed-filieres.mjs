// Usage : node scripts/seed-filieres.mjs
// Charge .env.local manuellement (ce script tourne hors Next.js).
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { FILIERES_OFFICIELLES } from '../data/filieres-officielles.mjs';

function chargerEnvLocal() {
  const contenu = readFileSync('.env.local', 'utf-8');
  for (const ligne of contenu.split('\n')) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
chargerEnvLocal();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  console.log(`Insertion de ${FILIERES_OFFICIELLES.length} filières...`);
  let ok = 0, echecs = 0;

  for (const f of FILIERES_OFFICIELLES) {
    const { data: filiere, error: erreurFiliere } = await supabase
      .from('filieres')
      .insert({
        nom: f.filiere,
        universite: f.universite,
        etablissement: f.etablissement,
        seuil_admission: f.seuilAdmission ?? 10,
        mode_entree: f.modeEntree,
        quota_bourse: f.quotaBourse ?? null,
        quota_aide: f.quotaAide ?? null,
        debouches: f.debouches ?? [],
        matieres_classement: f.matieresParSerie ?? null,
      })
      .select('id')
      .single();

    if (erreurFiliere) {
      console.error(`Échec "${f.filiere}" (${f.etablissement}) :`, erreurFiliere.message);
      echecs++;
      continue;
    }

    if (f.seriesEligibles?.length > 0) {
      const { error: erreurSeries } = await supabase
        .from('filieres_series_eligibles')
        .insert(f.seriesEligibles.map((serie_code) => ({ filiere_id: filiere.id, serie_code })));
      if (erreurSeries) console.error(`Échec séries pour "${f.filiere}" :`, erreurSeries.message);
    }
    ok++;
  }

  console.log(`Terminé : ${ok} filières insérées, ${echecs} échecs.`);
}

main();
