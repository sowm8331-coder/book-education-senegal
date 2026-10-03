import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EducationalDocument } from '../types';
import { getLiveUrlForDocument, getDirectDocumentUrl } from '../utils/documentStorage';
import { getDocumentRatingStats } from '../utils/reviewsStorage';
import { DocumentReviewsSection } from './DocumentReviewsSection';
import { WordDocumentReader } from './WordDocumentReader';
import { PdfDocumentReader } from './PdfDocumentReader';
import { X, Download, Printer, BookOpen, CheckCircle, ChevronDown, ChevronUp, Sparkles, FileText, Maximize2, Minimize2, ArrowLeft, ArrowRight, Loader2, ExternalLink, AlertTriangle, Edit2, Star } from 'lucide-react';

interface DocumentViewerModalProps {
  document: EducationalDocument | null;
  onClose: () => void;
  onDownload: (doc: EducationalDocument) => void;
  onAskAIAboutDoc?: (doc: EducationalDocument) => void;
  onPrevDoc?: () => void;
  onNextDoc?: () => void;
  hasPrevDoc?: boolean;
  hasNextDoc?: boolean;
  onOpenWolofAudio?: (text?: string) => void;
  onEdit?: (doc: EducationalDocument) => void;
  isAdmin?: boolean;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose,
  onDownload,
  onAskAIAboutDoc,
  onPrevDoc,
  onNextDoc,
  hasPrevDoc = false,
  hasNextDoc = false,
  onOpenWolofAudio,
  onEdit,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'exercises' | 'pdf' | 'reviews'>('pdf');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [liveFileUrl, setLiveFileUrl] = useState<string>('');
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(true);
  const [reviewsVersion, setReviewsVersion] = useState(0);

  // Compute live review stats
  const reviewStats = useMemo(() => {
    if (!doc) return { average: 4.8, count: 0, breakdown: {} };
    return getDocumentRatingStats(doc.id);
  }, [doc?.id, reviewsVersion]);

  // Touch gesture support for Android
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (doc) {
      setIsLoadingFile(true);
      // Prioritize the actual PDF / Word reader directly
      setActiveTab('pdf');

      getLiveUrlForDocument(doc)
        .then((url) => {
          if (isMounted) {
            setLiveFileUrl(url);
            setIsLoadingFile(false);
          }
        })
        .catch((err) => {
          console.warn('Could not load live document URL:', err);
          if (isMounted) {
            setLiveFileUrl('');
            setIsLoadingFile(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [doc]);

  if (!doc) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;

    // Swipe threshold of 60px
    if (diffX > 60 && hasPrevDoc && onPrevDoc) {
      onPrevDoc(); // Swipe right ➔ Document Précédent (Retour)
    } else if (diffX < -60 && hasNextDoc && onNextDoc) {
      onNextDoc(); // Swipe left ➔ Document Suivant (Avance)
    }
    touchStartXRef.current = null;
  };

  const toggleSolution = (index: number) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Quick Retour on Mobile */}
            <button
              onClick={hasPrevDoc && onPrevDoc ? onPrevDoc : onClose}
              className="p-2 sm:hidden text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Retour"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  {doc.level}
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">
                  {doc.category}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                  title="Voir les avis des élèves"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{reviewStats.average}</span>
                  <span className="text-[10px] text-amber-700/80">({reviewStats.count})</span>
                </button>
              </div>
              <h3 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                {doc.title}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Nav Prev / Next buttons for desktop and tablet */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={onPrevDoc}
                disabled={!hasPrevDoc}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Document précédent"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour</span>
              </button>
              <span className="w-px h-4 bg-slate-200 my-auto" />
              <button
                onClick={onNextDoc}
                disabled={!hasNextDoc}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Document suivant"
              >
                <span>Avance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {onAskAIAboutDoc && (
              <button
                onClick={() => onAskAIAboutDoc(doc)}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer shadow-xs"
                title="Poser des questions à l'assistant IA sur cette leçon"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expliquer avec l'IA</span>
              </button>
            )}

            {onOpenWolofAudio && (
              <button
                onClick={() => onOpenWolofAudio(doc.content || `${doc.title}. ${doc.description || ''}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Écouter l'explication audio en Wolof ou Français"
              >
                <span>🔊</span>
                <span className="hidden md:inline">Audio Wolof</span>
              </button>
            )}

            {isAdmin && onEdit && (
              <button
                onClick={() => onEdit(doc)}
                className="p-1.5 sm:p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                title="Modifier ce document (Admin)"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            {/* Direct Open in New Tab Button */}
            <a
              href={liveFileUrl || getDirectDocumentUrl(doc)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs active:scale-95"
              title="Ouvrir le document dans un nouvel onglet plein écran"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nouvel Onglet</span>
            </a>

            <button
              onClick={handlePrint}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Imprimer cette fiche de cours"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDownload(doc)}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer hidden sm:block"
              title={isFullScreen ? 'Quitter plein écran' : 'Plein écran'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-1"
              title="Fermer (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6 overflow-x-auto">
          {/* Tab 1: Official PDF / Word Document Reader */}
          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pdf'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {doc.fileType === 'word' ? '📘 Document Word Officiel' : '📄 Document PDF Officiel'}
          </button>

          {/* Tab 2: Exercises and Official Exam Solutions */}
          {doc.exercises && doc.exercises.length > 0 && (
            <button
              onClick={() => setActiveTab('exercises')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'exercises'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              ✍️ Exercices & Corrigés
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                {doc.exercises.length}
              </span>
            </button>
          )}

          {/* Tab 3: Study Sheet / Notes summary if available */}
          {doc.content && (
            <button
              onClick={() => setActiveTab('content')}
              className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'content'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              📖 Fiche & Résumé
            </button>
          )}

          {/* Tab 4: Student Reviews */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ⭐ Avis des Élèves
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {reviewStats.count > 0 ? `${reviewStats.average}★ (${reviewStats.count})` : 'Avis'}
            </span>
          </button>
        </div>

        {/* Modal Main Reader Area */}
        {/* Scrollable Document Content with Touch Gestures */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50/50 flex flex-col"
        >
          {activeTab === 'content' && doc.content ? (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs print:p-0 print:border-none print:shadow-none w-full">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {doc.category} • {doc.level}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 mb-2">
                  {doc.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Auteur / Source : <strong>{doc.author}</strong></span>
                  <span>•</span>
                  <span>Format officiel révisé</span>
                </div>
              </div>

              {/* Formatted Study Sheet Content */}
              <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif space-y-4">
                {doc.content}
              </div>

              {/* Exercises teaser if any */}
              {doc.exercises && doc.exercises.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Prêt pour l'entraînement ?</p>
                    <p className="text-xs text-slate-500">Testez votre compréhension avec les exercices d'application corrigés.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('exercises')}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-xs"
                  >
                    Voir les exercices ({doc.exercises.length})
                  </button>
                </div>
              )}

              {/* Document Reviews & Ratings Section */}
              <DocumentReviewsSection
                documentId={doc.id}
                documentTitle={doc.title}
                documentLevel={doc.level}
                onReviewAdded={() => setReviewsVersion((v) => v + 1)}
              />
            </div>
          ) : activeTab === 'exercises' && doc.exercises && doc.exercises.length > 0 ? (
            /* Exercises Tab */
            <div className="max-w-3xl mx-auto space-y-6 w-full">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                <h4 className="font-bold text-indigo-950 text-sm sm:text-base flex items-center gap-2">
                  <span>🎯</span>
                  Exercices d'application & Annales d'examen
                </h4>
                <p className="text-xs sm:text-sm text-indigo-800 mt-1">
                  Essayez de résoudre chaque question sur votre cahier de brouillon avant d'afficher la solution détaillée.
                </p>
              </div>

              {doc.exercises.map((ex, idx) => {
                const isRevealed = revealedSolutions[idx];
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                        Exercice {idx + 1}
                      </span>
                    </div>

                    <p className="font-medium text-slate-900 mt-3 text-sm sm:text-base leading-relaxed">
                      {ex.question}
                    </p>

                    {ex.hints && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        <strong>💡 Indice pédagogique :</strong> {ex.hints}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => toggleSolution(idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      >
                        {isRevealed ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Masquer la solution
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Afficher le corrigé détaillé
                          </>
                        )}
                      </button>

                      {isRevealed && (
                        <div className="mt-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed font-sans whitespace-pre-line animate-in fade-in duration-200">
                          <strong className="block mb-1 text-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Corrigé officiel :
                          </strong>
                          {ex.solution}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Uploaded file preview (PDF / Word) */
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              {isLoadingFile ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-semibold">Préparation du document pédagogique...</p>
                </div>
              ) : liveFileUrl ? (
                <div className="w-full flex-1 flex flex-col items-center">
                  {/* Top full-page banner to easily open in new tab */}
                  <div className="w-full bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 border border-indigo-100 dark:border-slate-700 rounded-2xl p-3 sm:p-4 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0">
                        {doc.fileType === 'word' ? 'DOC' : 'PDF'}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                          Lecture Plein Écran dans un Nouvel Onglet
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                          Consultez ce document avec le lecteur natif haute résolution de votre navigateur.
                        </p>
                      </div>
                    </div>
                    <a
                      href={liveFileUrl || getDirectDocumentUrl(doc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lire en Plein Écran (Nouvel Onglet)</span>
                    </a>
                  </div>

                  {doc.fileType === 'word' ? (
                    <WordDocumentReader
                      fileUrl={liveFileUrl}
                      documentTitle={doc.title}
                      onDownload={() => onDownload(doc)}
                    />
                  ) : (
                    <PdfDocumentReader
                      fileUrl={liveFileUrl}
                      documentTitle={doc.title}
                      onDownload={() => onDownload(doc)}
                    />
                  )}
                </div>
              ) : (
                /* Missing or previous session unpersisted file fallback */
                <div className="p-8 text-center bg-white rounded-3xl border border-amber-200 max-w-md mx-auto shadow-xs space-y-4 my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Fichier source non disponible</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Ce document a été ajouté lors d'une session sans stockage persistant ou le fichier a été nettoyé.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/70 rounded-xl text-xs text-indigo-900 text-left border border-indigo-100">
                    💡 <strong>Solution rapide :</strong> Utilisez le bouton <strong>« + PDF »</strong> en mode Administrateur pour réimporter ce fichier. Il sera désormais stocké de façon permanente !
                  </div>
                  <a
                    href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20souhaite%20obtenir%20le%20document%20p%C3%A9dagogique%20sur%20Book%20Education%20S%C3%A9n%C3%A9gal."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <span>💬 Contacter l'administrateur WhatsApp (70 565 72 77)</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl mx-auto w-full bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs my-4">
              <DocumentReviewsSection
                documentId={doc.id}
                documentTitle={doc.title}
                documentLevel={doc.level}
                onReviewAdded={() => setReviewsVersion((v) => v + 1)}
              />
            </div>
          )}
        </div>

        {/* Android / Mobile Sticky Bottom Navigation Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0 sm:hidden">
          <button
            onClick={onPrevDoc}
            disabled={!hasPrevDoc}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs transition-all cursor-pointer active:scale-95"
          >
            Fermer
          </button>

          <button
            onClick={onNextDoc}
            disabled={!hasNextDoc}
            className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:pointer-events-none text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <span>Avance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
