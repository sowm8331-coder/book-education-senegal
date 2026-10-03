import React from 'react';
import { EducationalDocument, UserAuth } from '../types';
import { getDocumentRatingStats } from '../utils/reviewsStorage';
import { getDirectDocumentUrl } from '../utils/documentStorage';
import { BookOpen, Download, Trash2, Star, FileText, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';

interface DocumentGridProps {
  documents: EducationalDocument[];
  onOpenViewer: (doc: EducationalDocument) => void;
  onDownload: (doc: EducationalDocument) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onDeleteDocument: (id: string) => void;
  auth: UserAuth;
  onRequireAuth: () => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onOpenViewer,
  onDownload,
  onToggleFavorite,
  isFavorite,
  onDeleteDocument,
  auth,
  onRequireAuth
}) => {
  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center my-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mx-auto mb-4">
          📚
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Aucun document trouvé
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Essayez d'ajuster vos termes de recherche ou de sélectionner une autre classe dans les filtres ci-dessus.
        </p>
      </div>
    );
  }

  // Level Badge Color Mapping matching Senegal curriculum styling
  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'CI': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800';
      case 'CP': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
      case 'CE1': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800';
      case 'CE2': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
      case 'CM1': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800';
      case 'CM2': return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800';
      case '6e': return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      case '5e': return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
      case '4e': return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800';
      case '3e': return 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800';
      case '2nde': return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800';
      case '2nde-S': return 'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800';
      case '2nde-L': return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800';
      case '1ere': return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/80 dark:text-green-300 dark:border-green-800';
      case '1ere-S': return 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800';
      case '1ere-L': return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800';
      case 'Terminale': return 'bg-slate-900 text-slate-100 border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600';
      case 'Terminale-S': return 'bg-amber-950 text-amber-100 border-amber-800 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700';
      case 'Terminale-L': return 'bg-indigo-950 text-indigo-100 border-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-6">
      {documents.map((doc) => {
        const favorite = isFavorite(doc.id);
        const canAccess = auth.isAdmin || auth.isStudent;

        return (
          <div
            key={doc.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
          >
            {/* Top Thumbnail Image */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <img
                src={doc.thumb}
                alt={doc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80';
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

              {/* Badges on top of image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-xs ${getLevelBadgeClass(
                    doc.level
                  )}`}
                >
                  {doc.level}
                </span>

                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-white/50 dark:border-slate-700 backdrop-blur-xs">
                  {doc.fileType}
                </span>
              </div>

              {/* Favorite Star Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(doc.id);
                }}
                className={`absolute top-3 right-3 p-1.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                  favorite
                    ? 'bg-amber-400 text-amber-950 shadow-md scale-110'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-amber-500'
                }`}
                title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Star className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>

              {/* Subject Tag in bottom left of image */}
              <div className="absolute bottom-2.5 left-3 text-white text-xs font-semibold drop-shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{doc.category}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
                  <span className="truncate">{doc.author}</span>
                  <span>•</span>
                  <span className="shrink-0">{doc.pages} pages</span>
                </p>

                {/* Rating & Reviews Count */}
                {(() => {
                  const ratingStats = getDocumentRatingStats(doc.id);
                  return (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center text-amber-500 font-extrabold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        <span>{ratingStats.average}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        ({ratingStats.count > 0 ? `${ratingStats.count} avis` : 'Recommandé'})
                      </span>
                    </div>
                  );
                })()}

                {doc.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {/* Read in New Tab Button (Opens the PDF directly in a new browser tab) */}
                <div className="flex items-center gap-1.5">
                  <a
                    href={getDirectDocumentUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!canAccess) {
                        e.preventDefault();
                        onRequireAuth();
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      canAccess
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                    title="Ouvrir et lire le PDF dans un nouvel onglet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lire</span>
                  </a>

                  {/* Details, Exercises & Review Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!canAccess) {
                        onRequireAuth();
                      } else {
                        onOpenViewer(doc);
                      }
                    }}
                    className="p-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Voir les exercices, corrigés et fiches"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                {/* Download and Admin Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!canAccess) {
                        onRequireAuth();
                      } else {
                        onDownload(doc);
                      }
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      canAccess
                        ? 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {auth.isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
                      title="Supprimer ce document (Admin)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
