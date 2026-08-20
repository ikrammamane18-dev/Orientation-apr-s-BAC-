// Usage : node scripts/patch-dt-deat-eligibilites.mjs
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
  { etablissement: 'FLASH-Adjarra', filiere: 'Géographie et Aménagement du Territoire', series: TOUTES_DEAT },
  { etablissement: 'FLASH-Adjarra', filiere: 'Anglais', series: TOUTES_DEAT },
  { etablissement: 'INMAAC', filiere: 'Arts Plastiques', series: ['DT_ARTS_TEXTILE','DT_COM_GRAPHIQUE'] },
  { etablissement: 'INMAAC', filiere: 'Musique et Musicologie', series: ['DT_MUSIQUE','DT_MAO'] },
  { etablissement: 'INE', filiere: "Gestion des crises et risques liés à l'eau et au climat", series: ['DEAT_AER'] },
  { etablissement: 'INE', filiere: "Génie rural et Maîtrise de l'Eau", series: ['DEAT_AER'] },
  { etablissement: 'INE', filiere: 'Eau Hygiène et Assainissement (EHA)', series: ['DEAT_AER'] },
  { etablissement: 'ENEAM', filiere: 'Administration des Réseaux informatiques', series: ['DT_IMI'] },
  { etablissement: 'ENEAM', filiere: 'Analyse Informatique et Programmation', series: ['DT_IMI'] },
  { etablissement: 'ENEAM', filiere: 'Marketing', series: ['DT_COM'] },
  { etablissement: 'EPA', filiere: 'Gestion du patrimoine culturel', series: ['DT_TOURISME'] },
  { etablissement: 'FASHS Calavi', filiere: 'Géographie et Aménagement du Territoire', series: TOUTES_DEAT },
  { etablissement: 'IFRI', filiere: 'Génie Logiciel', series: ['DT_IMI','DT_DWM'] },
  { etablissement: 'IFRI', filiere: 'Internet et Multimédia', series: ['DT_IMI','DT_DWM','DT_PM'] },
  { etablissement: 'IFRI', filiere: 'Systèmes embarqués et Internet des Objets (SEIoT)', series: ['DT_IMI','DT_EAP'] },
  { etablissement: 'IFRI', filiere: 'Sécurité Informatique', series: ['DT_IMI'] },
  { etablissement: 'FSA', filiere: 'Sciences et Techniques de Production Végétale', series: ['DEAT_PV'] },
  { etablissement: 'FSA', filiere: 'Sciences et Techniques de Production Animale', series: ['DEAT_PA'] },
  { etablissement: 'FSA', filiere: 'Aménagement et Gestion des Forêts et Parcours Naturels', series: ['DEAT_FORESTERIE'] },
  { etablissement: 'FSA', filiere: 'Génie Rural, Mécanisation Agricole, Pêche et Aquaculture', series: ['DEAT_PECHE','DEAT_AER'] },
  { etablissement: 'FSA', filiere: 'Nutrition et Technologie Alimentaires', series: ['DEAT_NUTRITION'] },
  { etablissement: 'EPAC', filiere: 'Génie de Technologie Alimentaire', series: ['DEAT_NUTRITION'] },
  { etablissement: 'EPAC', filiere: 'Production et Santé animales', series: ['DEAT_PA'] },
  { etablissement: 'EPAC', filiere: "Génie de l'Environnement", series: ['DEAT_FORESTERIE','DEAT_PV'] },
  { etablissement: 'EPAC', filiere: 'Génie Civil', series: ['DT_BTP'] },
  { etablissement: 'EPAC', filiere: 'Machinisme Agricole', series: ['DEAT_AER'] },
  { etablissement: 'FASEG', filiere: 'Sciences Économiques et de Gestion (Tronc commun)', series: ['DT_COM'] },
  { etablissement: 'FAST', filiere: 'Microbiologie et Biotechnologie Alimentaire', series: ['DEAT_NUTRITION'] },
  { etablissement: 'FAST', filiere: 'Hydrobiologie Appliquée', series: ['DEAT_PECHE'] },
  { etablissement: 'FLASH', filiere: 'Anglais', series: TOUTES_DEAT },
  { etablissement: 'FLASH', filiere: 'Géographie et Aménagement du Territoire', series: TOUTES_DEAT },
  { etablissement: 'FLASH', filiere: 'Sociologie Anthropologie', series: TOUTES_DEAT },
  { etablissement: 'FASEG', filiere: 'Marketing et Management des Organisations (MMO)', series: ['DT_COM'] },
  { etablissement: "Faculté d'Agronomie (FA)", filiere: 'Sciences et Techniques de Production Végétale', series: TOUTES_DEAT },
  { etablissement: "Faculté d'Agronomie (FA)", filiere: 'Sciences et Techniques de Production Animale et Halieutique', series: TOUTES_DEAT },
  { etablissement: "Faculté d'Agronomie (FA)", filiere: 'Aménagement et Gestion des Ressources Naturelles', series: TOUTES_DEAT },
  { etablissement: "Faculté d'Agronomie (FA)", filiere: 'Sociologie et Économie Rurales', series: TOUTES_DEAT },
  { etablissement: "Faculté d'Agronomie (FA)", filiere: 'Nutrition et Sciences Agro-alimentaires', series: TOUTES_DEAT },
  { etablissement: 'INSTI', filiere: 'Génie Civil', series: ['DT_BTP','DT_OG','DT_DPB'] },
  { etablissement: 'INSTI', filiere: 'Génie Energétique (Energies Renouvelables et Systèmes Energétiques)', series: ['DT_ELECTROTECH','DT_EAP'] },
  { etablissement: 'INSTI', filiere: 'Génie Energétique (Froid et climatisation)', series: ['DT_ELECTROTECH','DT_FC'] },
  { etablissement: 'INSTI', filiere: 'Génie Electrique et Informatique (Informatique et Télécommunications)', series: ['DT_ELECTROTECH'] },
  { etablissement: 'INSTI', filiere: 'Génie Electrique et Informatique (Electronique et Electrotechnique)', series: ['DT_ELECTROTECH'] },
  { etablissement: 'INSTI', filiere: 'Maintenance des Systèmes (Maintenance Industrielle)', series: ['DT_FC','DT_ELECTROTECH'] },
  { etablissement: 'INSTI', filiere: 'Maintenance des Systèmes (Maintenance Automobile)', series: ['DT_MA'] },
  { etablissement: 'INSTI', filiere: 'Génie Mécanique et productique', series: ['DT_MA','DT_FM'] },
  { etablissement: 'ENSGEP', filiere: 'Froid et Climatisation', series: ['DT_FC'] },
  { etablissement: 'ENSGEP', filiere: 'Equipements motorisés', series: ['DT_MA','DT_FM'] },
  { etablissement: 'ENSTP', filiere: 'Génie Civil', series: ['DT_BTP'] },
  { etablissement: 'ENSTP', filiere: 'Génie Géomatique Appliquée', series: ['DT_OG','DT_BTP'] },
  { etablissement: 'ENSTP', filiere: 'Architecture et Urbanisme', series: ['DT_OG','DT_BTP'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Agroéquipement', series: ['DT_FM','DT_CEMS','DT_MA','DT_ELECTROTECH','DEAT_AER'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Electrification Rurale et Energies Renouvelables (ERER)', series: ['DT_ELECTROTECH','DT_EAP'] },
  { etablissement: 'École de Génie Rural (EGR)', filiere: 'Infrastructures Rurales et Assainissement', series: ['DT_BTP','DT_DPB','DT_OG','DEAT_AER'] },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Finance Agricole (FA)', series: TOUTES_DEAT },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Gestion des Exploitations Agricoles et Entreprises Agroalimentaires (GEAEA)', series: TOUTES_DEAT },
  { etablissement: "École d'Agrobusiness et de Politiques Agricoles (EAPA)", filiere: 'Marketing des Intrants et Produits Agricoles (MIPA)', series: TOUTES_DEAT },
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
