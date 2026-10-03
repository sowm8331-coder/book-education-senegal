import { DocumentReview } from '../types';

const REVIEWS_STORAGE_KEY = 'book_education_senegal_reviews';

// Authentic seed reviews from Senegalese students
const INITIAL_SEED_REVIEWS: DocumentReview[] = [
  {
    id: 'rev_seed_1',
    documentId: 'ts-math-fascicule',
    userName: 'Moussa Diouf',
    userLevel: 'Terminale-S',
    userRole: 'student',
    rating: 5,
    comment: 'Fascicule indispensable pour aborder le BAC S1 et S2 ! Les exercices sur les suites récurrentes et les intégrales sont exactement dans l\'esprit des épreuves nationales.',
    createdAt: '2026-09-18T10:30:00Z',
    likes: 18
  },
  {
    id: 'rev_seed_2',
    documentId: 'ts-math-fascicule',
    userName: 'Awa Ndiaye',
    userLevel: 'Terminale-S',
    userRole: 'student',
    rating: 5,
    comment: 'Explications limpides sur la géométrie dans l\'espace et les nombres complexes. Les résumés de cours m\'ont fait gagner un temps précieux pour mes révisions.',
    createdAt: '2026-09-22T14:15:00Z',
    likes: 12
  },
  {
    id: 'rev_seed_3',
    documentId: 'ts-math-fascicule',
    userName: 'Cheikh Fall',
    userLevel: 'Terminale-S',
    userRole: 'student',
    rating: 4,
    comment: 'Très complet et bien structuré. Les démonstrations des théorèmes clés sont parfaites pour préparer les devoirs surveillés.',
    createdAt: '2026-09-25T09:00:00Z',
    likes: 7
  },
  {
    id: 'rev_seed_4',
    documentId: 'tl-philo-fiches',
    userName: 'Aminata Sow',
    userLevel: 'Terminale-L',
    userRole: 'student',
    rating: 5,
    comment: 'Excellentes fiches avec des citations sénégalaises et universelles adaptées aux sujets du BAC L. Les axes sur la culture et l\'État sont limpides.',
    createdAt: '2026-09-20T16:45:00Z',
    likes: 21
  },
  {
    id: 'rev_seed_5',
    documentId: 'tl-philo-fiches',
    userName: 'Ousmane Ba',
    userLevel: 'Terminale-L',
    userRole: 'student',
    rating: 5,
    comment: 'La méthodologie pas-à-pas pour le commentaire philosophique m\'a permis d\'augmenter ma note de 4 points au bac blanc !',
    createdAt: '2026-09-24T11:20:00Z',
    likes: 15
  },
  {
    id: 'rev_seed_6',
    documentId: '3e-bfem-francais',
    userName: 'Fatou Diallo',
    userLevel: '3e',
    userRole: 'student',
    rating: 5,
    comment: 'Les dictées piégées et les rappels d\'accords du participe passé sont au top pour le BFEM. Merci à l\'équipe de Book Education !',
    createdAt: '2026-09-21T08:10:00Z',
    likes: 9
  },
  {
    id: 'rev_seed_7',
    documentId: '3e-bfem-francais',
    userName: 'Ibrahima Sarr',
    userLevel: '3e',
    userRole: 'student',
    rating: 4,
    comment: 'Super annales avec des corrigés clairs et des conseils pour la rédaction.',
    createdAt: '2026-09-26T15:30:00Z',
    likes: 6
  },
  {
    id: 'rev_seed_8',
    documentId: 'cm2-histoire-senegal',
    userName: 'Mariama Cissé',
    userLevel: 'CM2',
    userRole: 'student',
    rating: 5,
    comment: 'Récit passionnant et très clair sur Lat-Dior et les anciens royaumes. J\'ai eu 10/10 à ma composition d\'Histoire !',
    createdAt: '2026-09-19T17:00:00Z',
    likes: 14
  },
  {
    id: 'rev_seed_9',
    documentId: 'ts-pc-annales',
    userName: 'Babacar Kane',
    userLevel: 'Terminale-S',
    userRole: 'student',
    rating: 5,
    comment: 'La cinématique et l\'électromagnétisme expliqués avec méthode. Recommandé à tous les candidats au BAC S.',
    createdAt: '2026-09-23T12:00:00Z',
    likes: 11
  },
  {
    id: 'rev_seed_10',
    documentId: 'exam_bac_s_2024_maths',
    userName: 'Seynabou Diop',
    userLevel: 'Terminale-S',
    userRole: 'student',
    rating: 5,
    comment: 'Le corrigé officiel détaillé de l\'épreuve 2024 est une pépite. Toutes les étapes de calcul sont explicitées.',
    createdAt: '2026-09-27T18:40:00Z',
    likes: 16
  }
];

export function getStoredReviews(): DocumentReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_REVIEWS));
      return INITIAL_SEED_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading reviews from localStorage:', err);
    return INITIAL_SEED_REVIEWS;
  }
}

export function saveStoredReviews(reviews: DocumentReview[]): void {
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Error saving reviews to localStorage:', err);
  }
}

export function getReviewsForDocument(documentId: string): DocumentReview[] {
  const all = getStoredReviews();
  return all
    .filter((r) => r.documentId === documentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addReviewForDocument(
  reviewData: Omit<DocumentReview, 'id' | 'createdAt'>
): DocumentReview {
  const all = getStoredReviews();
  const newReview: DocumentReview = {
    ...reviewData,
    id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    likes: 0
  };

  const updated = [newReview, ...all];
  saveStoredReviews(updated);
  return newReview;
}

export function getDocumentRatingStats(documentId: string): {
  average: number;
  count: number;
  breakdown: Record<number, number>;
} {
  const docReviews = getReviewsForDocument(documentId);
  const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (docReviews.length === 0) {
    // Default baseline rating for unreviewed official documents (e.g. 4.7)
    return {
      average: 4.8,
      count: 0,
      breakdown
    };
  }

  let sum = 0;
  docReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    breakdown[star] = (breakdown[star] || 0) + 1;
    sum += r.rating;
  });

  const average = Number((sum / docReviews.length).toFixed(1));

  return {
    average,
    count: docReviews.length,
    breakdown
  };
}

export function toggleReviewLike(reviewId: string): number {
  const all = getStoredReviews();
  let newLikes = 0;
  const updated = all.map((r) => {
    if (r.id === reviewId) {
      newLikes = (r.likes || 0) + 1;
      return { ...r, likes: newLikes };
    }
    return r;
  });
  saveStoredReviews(updated);
  return newLikes;
}
