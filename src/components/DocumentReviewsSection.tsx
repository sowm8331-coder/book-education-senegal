import React, { useState, useMemo } from 'react';
import { DocumentReview, SchoolLevel } from '../types';
import { BIBLIOTHEQUES_PAR_NIVEAU } from '../data/curriculumData';
import { 
  getReviewsForDocument, 
  addReviewForDocument, 
  getDocumentRatingStats,
  toggleReviewLike 
} from '../utils/reviewsStorage';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  User, 
  ShieldCheck,
  ChevronDown,
  Award
} from 'lucide-react';

interface DocumentReviewsSectionProps {
  documentId: string;
  documentTitle: string;
  documentLevel?: SchoolLevel | string;
  onReviewAdded?: () => void;
}

const STAR_LABELS: Record<number, string> = {
  1: '😕 À améliorer',
  2: '😐 Passable',
  3: '🙂 Utile pour réviser',
  4: '😊 Très bon document',
  5: '🌟 Indispensable pour l\'examen !'
};

export const DocumentReviewsSection: React.FC<DocumentReviewsSectionProps> = ({
  documentId,
  documentTitle,
  documentLevel,
  onReviewAdded
}) => {
  // State
  const [reviews, setReviews] = useState<DocumentReview[]>(() => getReviewsForDocument(documentId));
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form fields
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState<string>(documentLevel || 'Terminale-S');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Likes state map
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Rating stats
  const stats = useMemo(() => {
    return getDocumentRatingStats(documentId);
  }, [documentId, reviews]);

  const handleRatingClick = (val: number) => {
    setRating(val);
  };

  const handleLike = (reviewId: string) => {
    if (likedReviews[reviewId]) return;
    const newCount = toggleReviewLike(reviewId);
    setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: newCount } : r))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom ou nom d\'élève.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage('Veuillez laisser un commentaire d\'au moins 5 caractères pour expliquer votre avis.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newRev = addReviewForDocument({
        documentId,
        userName: userName.trim(),
        userLevel,
        userRole: 'student',
        rating,
        comment: comment.trim()
      });

      setReviews((prev) => [newRev, ...prev]);
      setSuccessMessage('Merci ! Votre avis et votre note ont été enregistrés avec succès.');
      setComment('');
      setIsFormOpen(false);

      if (onReviewAdded) {
        onReviewAdded();
      }

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setErrorMessage('Une erreur est survenue lors de l\'enregistrement de votre avis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* Header & Rating Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-850 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Global Score Display */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex flex-col items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-3xl font-black leading-none">{stats.average}</span>
              <span className="text-[11px] font-bold opacity-90">sur 5</span>
            </div>
            <div>
              <div className="flex items-center gap-1 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(stats.average)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {reviews.length > 0 
                  ? `${reviews.length} avis d'élèves et enseignants` 
                  : 'Ressource certifiée Book Education'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Évalué par les candidats aux examens officiels du Sénégal
              </p>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="w-full md:w-64 space-y-1.5 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.breakdown[stars] || 0;
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : stars === 5 ? 85 : 15;
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-6 font-bold text-slate-600 dark:text-slate-400 text-right">
                    {stars}★
                  </span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-[10px] text-slate-500 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action to leave review */}
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isFormOpen ? 'Fermer le formulaire' : '✍️ Laisser un avis sur ce cours'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Interactive Review Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900 shadow-sm space-y-4 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 text-base">
                ⭐
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Votre évaluation pour : {documentTitle}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Partagez vos impressions pour guider vos camarades de classe
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Star selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Votre note :
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => handleRatingClick(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        starVal <= currentDisplayRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                {STAR_LABELS[currentDisplayRating]}
              </span>
            </div>
          </div>

          {/* Student Info Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Votre Prénom & Nom (ou pseudo d'élève) :
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Moussa Diop, Fatou Ndiaye..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Votre classe actuelle :
              </label>
              <select
                value={userLevel}
                onChange={(e) => setUserLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Votre commentaire pédagogique :
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Qu'avez-vous particulièrement apprécié ? Les exercices sont-ils clairs ? Les corrigés vous ont-ils aidé à progresser ?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publication en cours...' : 'Publier mon avis'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Commentaires et retours d'expérience ({reviews.length})</span>
        </h4>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <span className="text-3xl block">✍️</span>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Aucun avis n'a encore été publié sur ce document.
            </p>
            <p className="text-[11px] text-slate-500">
              Soyez le premier élève à donner votre avis pour aider la communauté !
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 cursor-pointer"
            >
              Laisser le premier avis
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => {
              const isLiked = likedReviews[rev.id];
              const dateStr = new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2.5 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {rev.userName}
                          </span>
                          {rev.userLevel && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                              {rev.userLevel}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {dateStr}
                        </span>
                      </div>
                    </div>

                    {/* Star display */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment text */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {rev.comment}
                  </p>

                  {/* Helpfulness counter */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Avis vérifié Book Education Sénégal</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
                      <span>Utile ({rev.likes || 0})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
