import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Award, RotateCcw, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  level: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    level: 'Terminale-S',
    subject: 'Mathématiques',
    question: 'Quelle est la limite quand x tend vers +∞ de (ln(x) / x) ?',
    options: ['+∞', '1', '0', 'e'],
    correctIndex: 2,
    explanation: 'Par théorème des croissances comparées, la fonction x l\'emporte sur le logarithme népérien en +∞, donc lim (ln(x)/x) = 0.'
  },
  {
    id: 2,
    level: 'Terminale-L',
    subject: 'Philosophie',
    question: 'Qui est l\'auteur de la citation : "L\'obéissance à la loi qu\'on s\'est prescrite est liberté" ?',
    options: ['Jean-Jacques Rousseau', 'Thomas Hobbes', 'Friedrich Nietzsche', 'Karl Marx'],
    correctIndex: 0,
    explanation: 'Cette citation célèbre est extraite du "Contrat Social" (Livre I, chapitre 8) de Jean-Jacques Rousseau pour définir la liberté civile.'
  },
  {
    id: 3,
    level: '3e',
    subject: 'Mathématiques (BFEM)',
    question: 'Dans un triangle rectangle dont les côtés de l\'angle droit mesurent 3 cm et 4 cm, quelle est la longueur de l\'hypoténuse ?',
    options: ['7 cm', '5 cm', '12 cm', '6 cm'],
    correctIndex: 1,
    explanation: 'D\'après le théorème de Pythagore : 3² + 4² = 9 + 16 = 25. La racine carrée de 25 est 5 cm.'
  },
  {
    id: 4,
    level: '3e',
    subject: 'Histoire du Sénégal',
    question: 'Où et en quelle année est tombé le Damel Lat-Dior Ngoné Latyr Diop ?',
    options: ['À Dékheulé en 1886', 'À Ngolgol en 1863', 'À Nder en 1820', 'À Dakar en 1914'],
    correctIndex: 0,
    explanation: 'Lat-Dior est mort au combat le 27 octobre 1886 lors de la bataille héroïque de Dékheulé contre les troupes de Faidherbe.'
  },
  {
    id: 5,
    level: 'CM2',
    subject: 'Français (CFEE)',
    question: 'Dans la phrase : "Les mangues que j\'ai mangées étaient douces", pourquoi "mangées" prend-il "ées" ?',
    options: [
      'Parce que le verbe est toujours au féminin',
      'Parce que le COD "que" (mis pour "les mangues") est placé avant le verbe avec avoir',
      'Parce qu\'il y a l\'auxiliaire être',
      'C\'est une faute de frappe'
    ],
    correctIndex: 1,
    explanation: 'Avec l\'auxiliaire avoir, le participe passé s\'accorde uniquement avec le COD si celui-ci est placé AVANT le verbe. Ici le COD est le pronom relatif "que" dont l\'antécédent est "les mangues" (fém. pluriel).'
  }
];

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = SAMPLE_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < SAMPLE_QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-white/15 rounded-xl">🎓</span>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Quiz d'Entraînement & Révisions
              </h3>
              <p className="text-xs text-white/80">
                Questions types CFEE • BFEM • BACCALAURÉAT 🇸🇳
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-6">
          {!isFinished ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>
                  Question {currentIndex + 1} sur {SAMPLE_QUIZ_QUESTIONS.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                  {currentQ.level} • {currentQ.subject}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / SAMPLE_QUIZ_QUESTIONS.length) * 100}%`
                  }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  let styleClass = 'bg-white border-slate-200 hover:border-indigo-400 text-slate-800';

                  if (hasAnswered) {
                    if (idx === currentQ.correctIndex) {
                      styleClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    } else if (selectedOption === idx) {
                      styleClass = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                    } else {
                      styleClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (selectedOption === idx) {
                    styleClass = 'border-indigo-600 bg-indigo-50/50 text-indigo-900';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-sm cursor-pointer ${styleClass}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {hasAnswered && selectedOption === idx && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after answering */}
              {hasAnswered && (
                <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs sm:text-sm text-indigo-950 animate-in fade-in duration-200">
                  <strong className="block mb-1 font-bold text-indigo-800">
                    💡 Explication pédagogique :
                  </strong>
                  {currentQ.explanation}
                </div>
              )}

              {/* Navigation Buttons (Retour & Avance) */}
              <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>

                {hasAnswered ? (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95 min-h-[44px]"
                  >
                    <span>
                      {currentIndex + 1 < SAMPLE_QUIZ_QUESTIONS.length
                        ? 'Avance'
                        : 'Voir les résultats'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentIndex + 1 >= SAMPLE_QUIZ_QUESTIONS.length}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs min-h-[44px]"
                  >
                    <span>Passer / Avance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Finished Results Screen */
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
                🏆
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">
                Félicitations pour vos révisions !
              </h4>
              <p className="text-sm text-slate-600 mb-6">
                Votre score : <strong className="text-indigo-600 text-lg">{score} / {SAMPLE_QUIZ_QUESTIONS.length}</strong>
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 mb-6 max-w-sm mx-auto">
                {score === SAMPLE_QUIZ_QUESTIONS.length ? (
                  <p>🌟 Excellent ! Mention Très Bien pour votre maîtrise des notions fondamentales du programme sénégalais.</p>
                ) : score >= 3 ? (
                  <p>👏 Bon travail ! Continuez à réviser vos fiches de cours pour décrocher la mention au CFEE, BFEM ou BAC.</p>
                ) : (
                  <p>💪 Courage ! Relisez attentivement les fascicules de cours et entraînez-vous régulièrement.</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRestart}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer le quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Retour aux documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
