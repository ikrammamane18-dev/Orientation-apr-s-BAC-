import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

function chargerEnvLocal() {
  const contenu = readFileSync('.env.local', 'utf-8');
  for (const ligne of contenu.split('\n')) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
chargerEnvLocal();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TOUTES_DEAT = ['DEAT_PV','DEAT_PA','DEAT_AER','DEAT_FORESTERIE','DEAT_NUTRITION','DEAT_PECHE'];

const PATCH = [
  // --- ENSET (UNSTIM) — complètement oublié au premier passage ---
  { etablissement: 'ENSET', filiere: 'Comptabilité', series: ['DT_COM'] },
  { etablissement: 'ENSET', filiere: 'Electrotechnique', series: ['DT_ELECTRICITE','DT_ELECTROTECH'] },
  { etablissement: 'ENSET', filiere: 'Génie Civil', series: ['DT_BTP'] },
  { etablissement: 'ENSET', filiere: 'Mécanique Automobile', series: ['DT_MA'] },
  { etablissement: 'ENSET', filiere: 'Fabrication Mécanique', series: ['DT_FM'] },
  { etablissement: 'ENSET', filiere: 'Économie Familiale et Sociale', series: ['DT_EFS'] },
  { etablissement: 'ENSET', filiere: 'Hôtellerie-Restauration', series: ['DT_HR','DT_TOURISME','DT_EFS'] },
  { etablissement: 'ENSET', filiere: 'Froid et Climatisation', series: ['DT_FC'] },
  { etablissement: 'ENSET', filiere: 'Electronique', series: ['DT_EAP'] },
  { etablissement: 'ENSET', filiere: 'Energies Renouvelables', series: ['DT_ELECTRICITE','DT_EAP'] },
  { etablissement: 'ENSET', filiere: 'Production Animale', series: ['DEAT_PA','DEAT_PV'] },
  { etablissement: 'ENSET', filiere: 'Production végétale', series: ['DEAT_PA','DEAT_PV'] },

  // --- UNA — oubliée en entier ---
  { etablissement: "École d'Aquaculture (EAq)", filiere: 'Aquaculture', series: ['DEAT_PECHE','DEAT_PA'] },
  { etablissement: "École d'Horticulture et d'Aménagement des Espaces Verts (EHAEV)", filiere: 'Horticulture et Aménagement des espaces Verts', series: ['DEAT_PV','DEAT_FORESTERIE'] },
  { etablissement: 'École de Gestion et de Production Végétale et Semencière (EGPVS)', filiere: 'Gestion et Production Végétale et Semencière', series: ['DEAT_PV'] },
  { etablissement: 'ESTCTPA', filiere: 'Industrie des Produits Agro-Alimentaires et Nutrition Humaine (IPA-NH)', series: ['DEAT_NUTRITION'] },
  { etablissement: 'ESTCTPA', filiere: 'Industrie des Bio-Ressources (IBR)', series: ['DEAT_NUTRITION'] },
  { etablissement: 'ESTCTPA', filiere: 'Génie de Conditionnement Emballage et Stockage des Produits Alimentaires (GCES)', series: ['DEAT_NUTRITION'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Agroéquipement', series: ['DT_FM','DT_CEMS','DT_MA','DT_ELECTROTECH','DEAT_AER'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Electrification Rurale et Energies Renouvelables (ERER)', series: ['DT_ELECTROTECH','DT_EAP'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Infrastructures Rurales et Assainissement', series: ['DT_BTP','DT_DPB','DT_OG','DEAT_AER'] },
  { etablissement: "École de Gestion et d'Exploitation des Systèmes d'Elevage (EGESE)", filiere: 'Productions et santé animales', series: ['DEAT_PA'] },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Finance Agricole (FA)', series: TOUTES_DEAT },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Gestion des Exploitations Agricoles et Entreprises Agroalimentaires (GEAEA)', series: TOUTES_DEAT },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Marketing des Intrants et Produits Agricoles (MIPA)', series: TOUTES_DEAT },
  { etablissement: 'École de Sociologie rurale et de Vulgarisation Agricole (ESRVA)', filiere: 'Sociologie rurale et Vulgarisation Agricole', series: TOUTES_DEAT },
  { etablissement: 'École de Foresterie Tropicale (EForT)', filiere: 'Foresterie Tropicale', series: ['DEAT_FORESTERIE'] },

  // --- Université de Parakou — 2 oublis ---
  { etablissement: 'IUT', filiere: 'Gestion Commerciale', series: ['DT_COM'] },
  { etablissement: 'FASEG', filiere: 'Marketing et Management des Organisations (MMO)', series: ['DT_COM'] },
  { etablissement: 'FLASH', filiere: 'Anglais', series: TOUTES_DEAT },
  { etablissement: 'FLASH', filiere: 'Géographie et Aménagement du Territoire', series: TOUTES_DEAT },
  { etablissement: 'FLASH', filiere: 'Sociologie Anthropologie', series: TOUTES_DEAT },

  // --- UAC — 2 filières où la série EA manquait dans les données d'origine
  // (pas du DT/DEAT à proprement parler, mais trouvé en même temps) ---
  { etablissement: 'CIFRED', filiere: 'Environnement, Hygiène et Santé publique', series: ['EA'] },
  { etablissement: 'Institut de Cadre de Vie', filiere: 'Gestion des changements climatiques et des écosystèmes', series: ['EA'] },
];

async function main() {
  let ok = 0, echecs = 0;
  for (const patch of PATCH) {
    const { data: filiere } = await supabase.from('filieres').select('id').eq('etablissement', patch.etablissement).eq('nom', patch.filiere).maybeSingle();
    if (!filiere) { console.warn('Introuvable :', patch.etablissement, '/', patch.filiere); echecs++; continue; }
    const { error } = await supabase.from('filieres_series_eligibles').upsert(
      patch.series.map((serie_code) => ({ filiere_id: filiere.id, serie_code })),
      { onConflict: 'filiere_id,serie_code' }
    );
    if (error) { console.error('Erreur', patch.filiere, ':', error.message); echecs++; } else ok++;
  }
  console.log(`Terminé : ${ok} filières patchées, ${echecs} introuvables/échecs.`);
}
main();
