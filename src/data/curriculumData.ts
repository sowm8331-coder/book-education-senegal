import { ClassLibraryInfo, SchoolLevel } from '../types';

export const BIBLIOTHEQUES_PAR_NIVEAU: Record<SchoolLevel, ClassLibraryInfo> = {
  'CI': {
    code: 'CI',
    name: "CI - Cours d'Initiation",
    icon: '👶',
    color: '#ef4444',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 24,
    lecons: 12,
    matieres: ['Graphisme', 'Langage', 'Éveil Mathématique', 'Contes'],
    description: "Premiers pas à l'école élémentaire : découverte des sons, des formes et des chiffres."
  },
  'CP': {
    code: 'CP',
    name: 'CP - Cours Préparatoire',
    icon: '📖',
    color: '#10b981',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 32,
    lecons: 18,
    matieres: ['Lecture syllabique', 'Écriture', 'Calcul numérique', 'Éveil au milieu'],
    description: "Apprentissage fondamental de la lecture autonome, de l'écriture cursive et des additions."
  },
  'CE1': {
    code: 'CE1',
    name: 'CE1 - Cours Élémentaire 1',
    icon: '🔢',
    color: '#3b82f6',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 28,
    lecons: 15,
    matieres: ['Orthographe', 'Vocabulaire', 'Opérations posées', 'Sciences d’observation'],
    description: "Consolidation de la lecture fluide, initiation à la grammaire et aux tables de multiplication."
  },
  'CE2': {
    code: 'CE2',
    name: 'CE2 - Cours Élémentaire 2',
    icon: '📝',
    color: '#8b5cf6',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 35,
    lecons: 20,
    matieres: ['Grammaire', 'Conjugaison', 'Géométrie', 'Histoire du Sénégal'],
    description: "Approfondissement des accords grammaticaux, divisions et repères géographiques sénégalais."
  },
  'CM1': {
    code: 'CM1',
    name: 'CM1 - Cours Moyen 1',
    icon: '🧮',
    color: '#f59e0b',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 42,
    lecons: 22,
    matieres: ['Mathématiques', 'Dictée & Compréhension', 'Histoire-Géo', 'Sciences physiques et naturelles'],
    description: "Préparation active au cycle terminal du primaire et développement du raisonnement abstrait."
  },
  'CM2': {
    code: 'CM2',
    name: 'CM2 - Cours Moyen 2 (CFEE)',
    icon: '🎓',
    color: '#ec4899',
    cycle: 'Maternelle/Élémentaire',
    documentsCount: 54,
    lecons: 28,
    matieres: ['Arithmétique & Problèmes', 'Contrôle des connaissances', 'Étude de texte', 'Histoire du Sénégal', 'Géographie'],
    description: "Préparation intensive au CFEE et à l'examen d'Entrée en 6ème au Sénégal.",
    exam: 'CFEE'
  },
  '6e': {
    code: '6e',
    name: '6ème - Entrée au Collège',
    icon: '🏫',
    color: '#6366f1',
    cycle: 'Moyen (Collège)',
    documentsCount: 45,
    lecons: 30,
    matieres: ['Mathématiques', 'Français', 'Histoire-Géo', 'SVT', 'Anglais'],
    description: "Transition vers l'enseignement moyen : autonomie, organisation par matière et méthodologie."
  },
  '5e': {
    code: '5e',
    name: '5ème - Cycle Central',
    icon: '📚',
    color: '#8b5cf6',
    cycle: 'Moyen (Collège)',
    documentsCount: 48,
    lecons: 32,
    matieres: ['Maths', 'Français', 'Physique-Chimie', 'SVT', 'Anglais'],
    description: "Introduction à la physique-chimie expérimentale et aux équations simples."
  },
  '4e': {
    code: '4e',
    name: '4ème - Cycle Central Approfondi',
    icon: '🔬',
    color: '#06b6d4',
    cycle: 'Moyen (Collège)',
    documentsCount: 52,
    lecons: 35,
    matieres: ['Algèbre & Géométrie', 'Physique', 'Chimie', 'SVT', 'Espagnol / Arabe'],
    description: "Théorème de Pythagore, puissances, réactions chimiques et reproduction végétale/animale."
  },
  '3e': {
    code: '3e',
    name: '3ème - Préparation BFEM',
    icon: '🎯',
    color: '#f97316',
    cycle: 'Moyen (Collège)',
    documentsCount: 65,
    lecons: 42,
    matieres: ['Mathématiques', 'Sciences Physiques', 'SVT', 'Français (Dictée/Texte)', 'Histoire-Géo', 'Anglais'],
    description: "Révisions intensives et annales du Brevet de Fin d'Études Moyennes (BFEM) sénégalais.",
    exam: 'BFEM'
  },
  '2nde': {
    code: '2nde',
    name: 'Seconde Générale',
    icon: '🔰',
    color: '#0284c7',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 48,
    lecons: 32,
    matieres: ['Maths', 'Sciences Physiques', 'SVT', 'Français', 'Histoire-Géo'],
    description: "Classe d'orientation déterminante pour choisir entre la filière Scientifique (S) ou Littéraire (L)."
  },
  '2nde-S': {
    code: '2nde-S',
    name: 'Seconde S - Scientifique',
    icon: '🔬',
    color: '#7c3aed',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 50,
    lecons: 34,
    matieres: ['Mathématiques renforcées', 'Physique-Chimie', 'SVT', 'Français', 'Anglais'],
    description: "Filière scientifique avec accents sur les fonctions, les vecteurs, la cinématique et la chimie des solutions."
  },
  '2nde-L': {
    code: '2nde-L',
    name: 'Seconde L - Littéraire',
    icon: '📜',
    color: '#ea580c',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 46,
    lecons: 30,
    matieres: ['Français & Littérature', 'Histoire-Géographie', 'Langues vivantes', 'Mathématiques L'],
    description: "Analyse des textes littéraires africains et francophones, culture générale et argumentation."
  },
  '1ere': {
    code: '1ere',
    name: 'Première - Tronc Commun',
    icon: '🎯',
    color: '#15803d',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 50,
    lecons: 35,
    matieres: ['Français Épreuve Anticipée', 'Histoire-Géo', 'Maths', 'Sciences'],
    description: "Première étape vers le baccalauréat, consolidation des méthodes de dissertation et commentaires."
  },
  '1ere-S': {
    code: '1ere-S',
    name: 'Première S - Scientifique (S1, S2)',
    icon: '🧪',
    color: '#db2777',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 56,
    lecons: 38,
    matieres: ['Mathématiques (Barycentres, Dérivation)', 'Physique (Travail, Énergie)', 'Chimie Organique', 'SVT (Génétique)'],
    description: "Programme rigoureux préparant au Baccalauréat Scientifique avec fort coefficient en sciences."
  },
  '1ere-L': {
    code: '1ere-L',
    name: 'Première L - Littéraire (L1, L2)',
    icon: '🖋️',
    color: '#1d4ed8',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 52,
    lecons: 35,
    matieres: ['Français approfondi', 'Histoire et civilisations', 'Géographie de l’Afrique', 'Philosophie (initiation)', 'Langues'],
    description: "Étude stylistique, roman négro-africain, poésie engagée et épreuve anticipée de français."
  },
  'Terminale': {
    code: 'Terminale',
    name: 'Terminale - Année du Bac',
    icon: '🎓',
    color: '#1e293b',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 75,
    lecons: 45,
    matieres: ['Philosophie', 'Histoire-Géographie', 'Mathématiques', 'Sciences / Littérature'],
    description: "Dernière ligne droite pour l'obtention du diplôme du Baccalauréat au Sénégal."
  },
  'Terminale-S': {
    code: 'Terminale-S',
    name: 'Terminale S - Bac Scientifique (S1, S2, S3)',
    icon: '⚛️',
    color: '#c2410c',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 68,
    lecons: 44,
    matieres: ['Mathématiques (Analyse, Nombres Complexes, Probas)', 'Physique (Mécanique, Électromagnétisme)', 'Chimie (Acido-basicité)', 'SVT', 'Philosophie'],
    description: "Préparation d'excellence aux épreuves du Baccalauréat Scientifique et aux concours des grandes écoles.",
    exam: 'BAC S'
  },
  'Terminale-L': {
    code: 'Terminale-L',
    name: 'Terminale L - Bac Littéraire (L1, L2, LA)',
    icon: '🎭',
    color: '#4338ca',
    cycle: 'Secondaire (Lycée)',
    documentsCount: 64,
    lecons: 42,
    matieres: ['Philosophie (L’Homme, La Conscience, La Liberté, L’État)', 'Littérature & Français', 'Histoire-Géo du Sénégal et du Monde', 'Langues Vivantes'],
    description: "Maîtrise de la dissertation philosophique, commentaire composé et épreuves écrites du Bac L.",
    exam: 'BAC L'
  }
};
