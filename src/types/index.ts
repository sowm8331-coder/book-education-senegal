export type SchoolLevel = 
  | 'CI' | 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2'
  | '6e' | '5e' | '4e' | '3e'
  | '2nde' | '2nde-S' | '2nde-L'
  | '1ere' | '1ere-S' | '1ere-L'
  | 'Terminale' | 'Terminale-S' | 'Terminale-L';

export type SubjectCategory = 
  | 'Mathématiques'
  | 'Français'
  | 'Sciences'
  | 'SVT'
  | 'Physique-Chimie'
  | 'Histoire-Géo'
  | 'Philosophie'
  | 'Anglais'
  | 'Éveil'
  | 'Général';

export type FileType = 'pdf' | 'word' | 'fiche' | 'other';

export interface EducationalDocument {
  id: string;
  title: string;
  author: string;
  pages: number | string;
  category: SubjectCategory;
  level: SchoolLevel | string;
  additionalLevels?: (SchoolLevel | string)[]; // Multiple shared classes support
  fileType: FileType;
  thumb: string;
  filename: string;
  description?: string;
  tags: string[];
  isLocal?: boolean;
  addedAt?: string;
  content?: string; // Rich text / study sheet content for built-in viewing
  rating?: number; // Average rating 1 to 5
  reviewsCount?: number; // Total number of reviews
  exercises?: {
    question: string;
    hints?: string;
    solution: string;
  }[];
}

export interface DocumentReview {
  id: string;
  documentId: string;
  userName: string;
  userRole?: 'student' | 'admin' | 'teacher';
  userLevel?: SchoolLevel | string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string; // ISO date string
  likes?: number;
}

export interface ClassLibraryInfo {
  name: string;
  code: SchoolLevel;
  icon: string;
  color: string;
  cycle: 'Maternelle/Élémentaire' | 'Moyen (Collège)' | 'Secondaire (Lycée)';
  documentsCount: number;
  lecons: number;
  matieres: string[];
  description: string;
  exam?: 'CFEE' | 'BFEM' | 'BAC S' | 'BAC L';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export type ViewMode = 'tablet' | 'folder';

export interface UserAuth {
  isAdmin: boolean;
  isStudent: boolean;
}
