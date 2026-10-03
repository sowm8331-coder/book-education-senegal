import React, { useState, useMemo } from 'react';
import { X, RotateCw, CheckCircle2, XCircle, Sparkles, Shuffle, Plus, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

interface Flashcard {
  id: string;
  category: 'Maths' | 'Physique-Chimie' | 'SVT' | 'Histoire du Sénégal' | 'Philosophie' | 'Français';
  level: string;
  question: string;
  answer: string;
  tip?: string;
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    category: 'Histoire du Sénégal',
    level: 'CM2 & 3ème',
    question: 'En quelle année et lors de quelle bataille le Damel Lat-Dior est-il tombé au combat ?',
    answer: 'Le 27 octobre 1886 lors de la bataille héroïque de Dékheulé contre les troupes coloniales françaises, aux côtés de son cheval Malaw.',
    tip: 'Pensez au refus du chemin de fer Dakar-Saint-Louis.'
  },
  {
    id: 'fc-2',
    category: 'Histoire du Sénégal',
    level: 'CM2 & 3ème',
    question: 'Qui est Aline Sitoé Diatta et quel est son rôle historique au Sénégal ?',
    answer: 'Surnommée la "Reine de Cabrousse" en Casamance (1920-1944), elle a mené la résistance pacifique paysanne contre l\'impôt colonial et les réquisitions de riz.',
    tip: 'Figure féminine majeure de la résistance nationale.'
  },
  {
    id: 'fc-3',
    category: 'Histoire du Sénégal',
    level: 'CM2, 3e, Terminale',
    question: 'Quelle est la date exacte de la proclamation de l’Indépendance de la République du Sénégal ?',
    answer: 'Le 20 août 1960 (après l’éclatement de la Fédération du Mali, célébrée officiellement le 4 avril).',
    tip: 'Léopold Sédar Senghor en devint le premier Président.'
  },
  {
    id: 'fc-4',
    category: 'Philosophie',
    level: 'Terminale L',
    question: 'Définir la formule de Thomas Hobbes sur l’état de nature : "Homo homini lupus est".',
    answer: '"L’homme est un loup pour l’homme". Sans l’autorité de l’État et des lois, les passions égoïstes mènent à une guerre perpétuelle de chacun contre chacun.',
    tip: 'Ouvrage de référence : Le Léviathan (1651).'
  },
  {
    id: 'fc-5',
    category: 'Philosophie',
    level: 'Terminale L',
    question: 'Quelle distinction Rousseau fait-il entre liberté naturelle et liberté civile ?',
    answer: 'La liberté naturelle n’a pour borne que la force de l’individu (illusoire et dangereuse). La liberté civile est garantie par la loi et la volonté générale : "L’obéissance à la loi qu’on s’est prescrite est liberté".',
    tip: 'Extrait du Contrat Social (Livre I, chap. 8).'
  },
  {
    id: 'fc-6',
    category: 'Maths',
    level: 'Terminale S',
    question: 'Quelle est la limite de [ln(x) / x] quand x tend vers +∞ ?',
    answer: 'La limite est 0 (par théorème des croissances comparées). L’axe des abscisses est asymptote horizontale à la courbe.',
    tip: 'La puissance de x domine le logarithme népérien.'
  },
  {
    id: 'fc-7',
    category: 'Maths',
    level: 'Terminale S',
    question: 'Comment calcule-t-on le module d’un nombre complexe z = a + ib ?',
    answer: '|z| = √(a² + b²). Géométriquement, cela représente la distance entre l’origine O et le point image M(z).',
    tip: 'Propriété : |z × z\'| = |z| × |z\'|.'
  },
  {
    id: 'fc-8',
    category: 'Maths',
    level: '3ème (BFEM)',
    question: 'Énoncer la réciproque du théorème de Pythagore.',
    answer: 'Si dans un triangle ABC, le carré du plus grand côté est égal à la somme des carrés des deux autres côtés (BC² = AB² + AC²), alors le triangle ABC est rectangle en A.',
    tip: 'Sert à démontrer qu’un triangle est rectangle.'
  },
  {
    id: 'fc-9',
    category: 'Physique-Chimie',
    level: 'Terminale S',
    question: 'Quelle est l’expression de la deuxième loi de Newton dans un référentiel galiléen ?',
    answer: '∑ F_ext = m × a_G. La somme vectorielle des forces extérieures est égale à la masse multipliée par l’accélération du centre d’inertie.',
    tip: 'En chute libre sans frottement : a_G = g.'
  },
  {
    id: 'fc-10',
    category: 'Physique-Chimie',
    level: 'Terminale S',
    question: 'Comment calcule-t-on le pH d’une solution aqueuse connaissant [H₃O⁺] ?',
    answer: 'pH = -log([H₃O⁺]) avec [H₃O⁺] en mol/L. Réciproquement : [H₃O⁺] = 10^(-pH).',
    tip: 'À 25°C, solution neutre : pH = 7.'
  },
  {
    id: 'fc-11',
    category: 'SVT',
    level: '2nde & 1ère S',
    question: 'Quelle est l’équation-bilan globale de la photosynthèse chez les plantes vertes ?',
    answer: '6 CO₂ + 6 H₂O + Énergie Lumineuse ➔ C₆H₁₂O₆ (Glucose) + 6 O₂.',
    tip: 'Le dioxygène libéré provient de la photolyse de l’eau.'
  },
  {
    id: 'fc-12',
    category: 'Français',
    level: 'Toutes classes',
    question: 'Quelle est la règle d’accord du participe passé employé avec l’auxiliaire avoir ?',
    answer: 'Il ne s’accorde jamais avec le sujet. Il s’accorde en genre et en nombre avec le COD UNIQUEMENT si celui-ci est placé AVANT le verbe.',
    tip: 'Exemple : "Les mangues qu’il a cueillies".'
  }
];

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({ isOpen, onClose }) => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem('senegal_custom_flashcards');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...DEFAULT_FLASHCARDS, ...parsed];
      }
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_FLASHCARDS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [toReviewIds, setToReviewIds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Touch gesture support for Android
  const touchStartXRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diffX > 50) {
      handlePrev(); // Swipe right ➔ Retour
    } else if (diffX < -50) {
      handleNext(); // Swipe left ➔ Avance
    }
    touchStartXRef.current = null;
  };

  // New card form
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<Flashcard['category']>('Maths');
  const [newLevel, setNewLevel] = useState('Terminale S');

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'Tous') return cards;
    return cards.filter((c) => c.category === selectedCategory);
  }, [cards, selectedCategory]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  if (!isOpen) return null;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < filteredCards.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleMarkMastered = (id: string) => {
    if (!masteredIds.includes(id)) {
      setMasteredIds((prev) => [...prev, id]);
      setToReviewIds((prev) => prev.filter((i) => i !== id));
    }
    handleNext();
  };

  const handleMarkToReview = (id: string) => {
    if (!toReviewIds.includes(id)) {
      setToReviewIds((prev) => [...prev, id]);
      setMasteredIds((prev) => prev.filter((i) => i !== id));
    }
    handleNext();
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newCard: Flashcard = {
      id: 'custom_' + Date.now(),
      category: newCategory,
      level: newLevel,
      question: newQuestion,
      answer: newAnswer
    };

    const updated = [newCard, ...cards];
    setCards(updated);

    try {
      const customOnly = updated.filter((c) => c.id.startsWith('custom_'));
      localStorage.setItem('senegal_custom_flashcards', JSON.stringify(customOnly));
    } catch (err) {
      console.warn(err);
    }

    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-700 via-indigo-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              🗂️
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Flashcards Mémo Sénégal
              </h3>
              <p className="text-xs text-white/80">
                Cartes de mémorisation rapide du CI au Baccalauréat 🇸🇳
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              title="Ajouter ma propre carte mémoire"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Créer une carte</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Card Form Modal Accordion */}
        {showAddForm && (
          <form onSubmit={handleAddCard} className="p-4 bg-indigo-50/80 border-b border-indigo-100 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950">
                ✨ Créer une nouvelle Flashcard personnelle :
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Discipline</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Flashcard['category'])}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Maths">Maths</option>
                  <option value="Physique-Chimie">Physique-Chimie</option>
                  <option value="SVT">SVT</option>
                  <option value="Philosophie">Philosophie</option>
                  <option value="Français">Français</option>
                  <option value="Histoire du Sénégal">Histoire du Sénégal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Niveau</label>
                <input
                  type="text"
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  placeholder="Ex: Terminale S, 3ème, CM2..."
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Question (Recto)</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ex: Quelle est la formule de la portée d'un projectile ?"
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Réponse (Verso)</label>
              <textarea
                rows={2}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Ex: X_p = [v_0² × sin(2α)] / g"
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
            >
              Enregistrer la carte
            </button>
          </form>
        )}

        {/* Categories Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex gap-1.5 overflow-x-auto">
            {['Tous', 'Histoire du Sénégal', 'Philosophie', 'Maths', 'Physique-Chimie', 'SVT', 'Français'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleShuffle}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer shrink-0"
            title="Mélanger les cartes au hasard"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Flashcard Area */}
        <div className="p-5 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto bg-slate-100/50">
          {/* Progress and status */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
            <span>
              Carte <strong>{currentIndex + 1}</strong> sur {filteredCards.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                ✓ {masteredIds.length} maîtrisées
              </span>
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                ⏳ {toReviewIds.length} à revoir
              </span>
            </div>
          </div>

          {/* Flashcard container */}
          {currentCard ? (
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[280px] sm:min-h-[320px] bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:border-violet-400 select-none"
            >
              {/* Lateral tap buttons for rapid thumb navigation on Android */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-violet-100 text-slate-600 hover:text-violet-700 flex items-center justify-center transition-all shadow-xs z-10 sm:opacity-0 sm:group-hover:opacity-100"
                title="Carte précédente"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-violet-100 text-slate-600 hover:text-violet-700 flex items-center justify-center transition-all shadow-xs z-10 sm:opacity-0 sm:group-hover:opacity-100"
                title="Carte suivante"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
                  {currentCard.category} • {currentCard.level}
                </span>

                <span className="text-xs text-slate-400 group-hover:text-violet-600 flex items-center gap-1 font-medium transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Voir la question' : 'Retourner la carte'}</span>
                </span>
              </div>

              {/* Card Center Content */}
              <div className="my-6 text-center px-4">
                {!isFlipped ? (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      QUESTION (RECTO)
                    </span>
                    <h4 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                      {currentCard.question}
                    </h4>
                    {currentCard.tip && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-xl mt-4 inline-block max-w-md">
                        💡 Indice : {currentCard.tip}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-2">
                      RÉPONSE PÉDAGOGIQUE (VERSO)
                    </span>
                    <p className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed max-w-lg mx-auto whitespace-pre-line">
                      {currentCard.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Hint */}
              <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-center gap-2">
                <span className="sm:hidden">👉 Glissez à gauche/droite pour naviguer</span>
                <span className="hidden sm:inline">Cliquez n'importe où sur la carte pour révéler la réponse</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Aucune carte disponible dans cette catégorie.
            </div>
          )}

          {/* Bottom Actions and Evaluation */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Nav Prev / Next buttons for Android */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
                title="Carte précédente"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <button
                onClick={handleNext}
                className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
                title="Carte suivante"
              >
                <span>Avance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Self-grading buttons */}
            {currentCard && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleMarkToReview(currentCard.id)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 min-h-[44px]"
                >
                  <XCircle className="w-4 h-4 text-amber-600" />
                  <span>À Revoir</span>
                </button>

                <button
                  onClick={() => handleMarkMastered(currentCard.id)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Je Savais !</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
