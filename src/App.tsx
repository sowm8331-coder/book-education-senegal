/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { EducationalDocument, SchoolLevel, ViewMode, UserAuth } from './types';
import { INITIAL_DOCUMENTS } from './data/initialDocs';
import { Header } from './components/Header';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ClassLibraries } from './components/ClassLibraries';
import { DocumentGrid } from './components/DocumentGrid';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { AssistantModal } from './components/AssistantModal';
import { LoginModal } from './components/LoginModal';
import { UploadModal } from './components/UploadModal';
import { QuizModal } from './components/QuizModal';
import { GradeSimulatorModal } from './components/GradeSimulatorModal';
import { ExerciseGeneratorModal } from './components/ExerciseGeneratorModal';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { DicteeAudioModal } from './components/DicteeAudioModal';
import { ChronoPlanningModal } from './components/ChronoPlanningModal';
import { FlashcardsModal } from './components/FlashcardsModal';
import { LandingHeroView } from './components/LandingHeroView';
import { AdminDashboard } from './components/AdminDashboard';
import { EditDocumentModal } from './components/EditDocumentModal';
import { WolofAudioTutorModal } from './components/WolofAudioTutorModal';
import { PassScolaireModal } from './components/PassScolaireModal';
import { 
  getLiveUrlForDocument, 
  deleteFileFromStorage, 
  fetchServerDocuments, 
  saveDocumentToServer, 
  updateDocumentOnServer, 
  deleteDocumentFromServer,
  downloadDocumentFile
} from './utils/documentStorage';
import { getDocumentRatingStats } from './utils/reviewsStorage';
import { getInitialTheme, applyTheme } from './utils/theme';
import { Sparkles, BookOpen, Star, AlertCircle, CheckCircle, GraduationCap, ArrowUp, Info, Calculator, Mic, FileCode2, ArrowLeft, ArrowRight, Clock, Layers, Sun, Moon, BarChart3 } from 'lucide-react';

const STORAGE_KEY_DOCS = 'book_education_senegal_docs';
const STORAGE_KEY_FAVORITES = 'student_favorites';
const STORAGE_KEY_ADMIN = 'isAdmin';
const STORAGE_KEY_STUDENT = 'isStudent';

export default function App() {
  // Global Dark Mode state
  const [isDark, setIsDark] = useState<boolean>(() => getInitialTheme());

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  // Auth state
  const [auth, setAuth] = useState<UserAuth>(() => ({
    isAdmin: localStorage.getItem(STORAGE_KEY_ADMIN) === 'true',
    isStudent: localStorage.getItem(STORAGE_KEY_STUDENT) === 'true'
  }));

  // Documents state
  const [documents, setDocuments] = useState<EducationalDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, EducationalDocument>();
          INITIAL_DOCUMENTS.forEach((d) => map.set(d.id, d));
          parsed.forEach((d: EducationalDocument) => map.set(d.id, d));
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.error('Failed to parse saved documents:', e);
    }
    return INITIAL_DOCUMENTS;
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showingFavorites, setShowingFavorites] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewMode>('tablet');

  // Modals state
  const [activeViewerDoc, setActiveViewerDoc] = useState<EducationalDocument | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isDicteeOpen, setIsDicteeOpen] = useState(false);
  const [isChronoOpen, setIsChronoOpen] = useState(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isWolofAudioOpen, setIsWolofAudioOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [wolofAudioInitialText, setWolofAudioInitialText] = useState<string>('');
  const [editingDoc, setEditingDoc] = useState<EducationalDocument | null>(null);
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'dashboard'>('home');
  const [loginModalState, setLoginModalState] = useState<{
    isOpen: boolean;
    defaultTab: 'admin' | 'student';
  }>({
    isOpen: false,
    defaultTab: 'student'
  });
  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    defaultLevel?: SchoolLevel;
  }>({
    isOpen: false
  });

  // Toast alert state
  const [alert, setAlert] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Sync docs to localStorage
  useEffect(() => {
    try {
      const customDocs = documents.filter((d) => d.isLocal);
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(customDocs));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [documents]);

  // Load persistent server documents on mount and merge with local state
  useEffect(() => {
    let isMounted = true;
    fetchServerDocuments()
      .then((serverDocs) => {
        if (!isMounted || !Array.isArray(serverDocs) || serverDocs.length === 0) return;
        setDocuments((prev) => {
          const merged = [...prev];
          for (const sDoc of serverDocs) {
            const idx = merged.findIndex((d) => d.id === sDoc.id);
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...sDoc };
            } else {
              merged.unshift(sDoc);
            }
          }
          return merged;
        });
      })
      .catch((err) => {
        console.warn('Could not fetch server documents on startup:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
  }, [favorites]);

  const showAlert = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ text, type });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Auth Handlers
  const handleAdminLoginSuccess = () => {
    setAuth((prev) => ({ ...prev, isAdmin: true }));
    localStorage.setItem(STORAGE_KEY_ADMIN, 'true');
    setCurrentTab('dashboard');
    showAlert('Connexion Administrateur réussie ! Bienvenue sur votre tableau de bord 🔐', 'success');
  };

  const handleStudentLoginSuccess = () => {
    setAuth((prev) => ({ ...prev, isStudent: true }));
    localStorage.setItem(STORAGE_KEY_STUDENT, 'true');
    setCurrentTab('catalog');
    showAlert('Connexion Élève/Enseignant réussie ! Bienvenue 🇸🇳', 'success');
  };

  const handleLogoutAdmin = () => {
    setAuth((prev) => ({ ...prev, isAdmin: false }));
    localStorage.removeItem(STORAGE_KEY_ADMIN);
    showAlert('Déconnexion Administrateur effectuée.', 'info');
  };

  const handleLogoutStudent = () => {
    setAuth((prev) => ({ ...prev, isStudent: false }));
    localStorage.removeItem(STORAGE_KEY_STUDENT);
    showAlert('Déconnexion Élève/Enseignant effectuée.', 'info');
  };

  // Favorite toggle
  const handleToggleFavorite = (docId: string) => {
    if (!auth.isAdmin && !auth.isStudent) {
      showAlert('Veuillez vous connecter pour gérer vos favoris.', 'error');
      setLoginModalState({ isOpen: true, defaultTab: 'student' });
      return;
    }

    setFavorites((prev) => {
      const exists = prev.includes(docId);
      if (exists) {
        showAlert('Document retiré des favoris.', 'info');
        return prev.filter((id) => id !== docId);
      } else {
        showAlert('Document ajouté aux favoris ⭐', 'success');
        return [...prev, docId];
      }
    });
  };

  const isDocFavorite = (id: string) => favorites.includes(id);

  // Document deletion (Admin)
  const handleDeleteDocument = async (docId: string) => {
    if (!auth.isAdmin) {
      showAlert("Action refusée : Seul l'administrateur (M. Sow) est autorisé à supprimer des documents.", 'error');
      return;
    }

    if (window.confirm('Voulez-vous vraiment supprimer ce document de la plateforme ?')) {
      await deleteFileFromStorage(docId);
      deleteDocumentFromServer(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      setFavorites((prev) => prev.filter((id) => id !== docId));
      showAlert('Document supprimé avec succès.', 'success');
    }
  };

  // Document update (Admin)
  const handleSaveEditedDocument = (updatedDoc: EducationalDocument) => {
    updateDocumentOnServer(updatedDoc);
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    if (activeViewerDoc && activeViewerDoc.id === updatedDoc.id) {
      setActiveViewerDoc(updatedDoc);
    }
    showAlert(`Le document "${updatedDoc.title}" a été mis à jour avec succès !`, 'success');
  };

  // Document merge (combining classes & resolving duplicates)
  const handleMergeDocuments = (targetDocId: string, sourceDocIds: string[]) => {
    setDocuments((prev) => {
      const targetDoc = prev.find((d) => d.id === targetDocId);
      if (!targetDoc) return prev;

      const sourceDocs = prev.filter((d) => sourceDocIds.includes(d.id));
      const allLevels = new Set<string>(targetDoc.additionalLevels || []);

      sourceDocs.forEach((s) => {
        if (s.level !== targetDoc.level) {
          allLevels.add(s.level);
        }
        if (s.additionalLevels && Array.isArray(s.additionalLevels)) {
          s.additionalLevels.forEach((l) => {
            if (l !== targetDoc.level) allLevels.add(l);
          });
        }
      });

      const mergedDoc: EducationalDocument = {
        ...targetDoc,
        additionalLevels: Array.from(allLevels),
        tags: Array.from(
          new Set([...targetDoc.tags, ...sourceDocs.flatMap((s) => s.tags || [])])
        ),
        description: targetDoc.description || sourceDocs.find((s) => s.description)?.description
      };

      // Clean storage for duplicate files if local
      sourceDocIds.forEach((id) => {
        deleteFileFromStorage(id);
        deleteDocumentFromServer(id);
      });

      updateDocumentOnServer(mergedDoc);

      showAlert(`Fusion réussie : « ${mergedDoc.title} » est désormais partagé entre toutes les classes concernées !`, 'success');

      return prev
        .filter((d) => !sourceDocIds.includes(d.id))
        .map((d) => (d.id === targetDocId ? mergedDoc : d));
    });
  };

  // Document download
  const handleDownload = async (doc: EducationalDocument) => {
    // Auto-grant student session if not already logged in
    if (!auth.isAdmin && !auth.isStudent) {
      setAuth((prev) => ({ ...prev, isStudent: true }));
      localStorage.setItem(STORAGE_KEY_STUDENT, 'true');
    }

    showAlert(`Préparation du fichier PDF pour "${doc.title}"...`, 'info');
    const success = await downloadDocumentFile(doc);
    if (success) {
      showAlert(`Téléchargement de "${doc.title}" réussi !`, 'success');
    } else {
      showAlert(`Impossible de télécharger "${doc.title}".`, 'error');
    }
  };

  // Add single document
  const handleAddDocument = (newDoc: EducationalDocument) => {
    saveDocumentToServer(newDoc);
    setDocuments((prev) => [newDoc, ...prev]);
    showAlert(`Document "${newDoc.title}" ajouté à la classe ${newDoc.level} !`, 'success');
  };

  // Add multiple documents
  const handleAddDocuments = (newDocs: EducationalDocument[]) => {
    if (newDocs.length === 0) return;
    newDocs.forEach((d) => saveDocumentToServer(d));
    setDocuments((prev) => [...newDocs, ...prev]);
    showAlert(
      newDocs.length > 1
        ? `${newDocs.length} documents importés avec succès !`
        : `Document "${newDocs[0]?.title}" importé avec succès !`,
      'success'
    );
  };

  // Filtering documents
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = documents.filter((doc) => {
      // Favorites filter
      if (showingFavorites && !favorites.includes(doc.id)) {
        return false;
      }

      // Search match
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.level.toLowerCase().includes(q) ||
        (doc.description && doc.description.toLowerCase().includes(q)) ||
        (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(q)));

      if (!matchSearch) return false;

      // Filter button match
      if (activeFilter === 'all') return true;

      // Special top-rated filter
      if (activeFilter === 'top-rated') {
        const stats = getDocumentRatingStats(doc.id);
        return stats.average >= 4.5;
      }

      // Special national exam filters
      if (activeFilter === 'CFEE') {
        return doc.level === 'CM2' || (doc.tags && doc.tags.some(t => t.toLowerCase().includes('cfee')));
      }
      if (activeFilter === 'BFEM') {
        return doc.level === '3e' || (doc.tags && doc.tags.some(t => t.toLowerCase().includes('bfem')));
      }
      if (activeFilter === 'BAC') {
        return doc.level.startsWith('Terminale') || (doc.tags && doc.tags.some(t => t.toLowerCase().includes('bac')));
      }

      // Check level match (primary level or additional shared classes)
      if (
        doc.level === activeFilter ||
        (doc.additionalLevels && doc.additionalLevels.includes(activeFilter))
      ) {
        return true;
      }

      // Check subject match
      if (doc.category === activeFilter) return true;
      if (activeFilter === 'Sciences' && (doc.category === 'Sciences' || doc.category === 'SVT' || doc.category === 'Physique-Chimie')) {
        return true;
      }

      return false;
    });

    if (activeFilter === 'top-rated') {
      return [...filtered].sort((a, b) => {
        const statsA = getDocumentRatingStats(a.id);
        const statsB = getDocumentRatingStats(b.id);
        if (statsB.average !== statsA.average) {
          return statsB.average - statsA.average;
        }
        return statsB.count - statsA.count;
      });
    }

    return filtered;
  }, [documents, searchQuery, activeFilter, showingFavorites, favorites]);

  // Document counts per level (including shared classes)
  const docCountsByLevel = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach((doc) => {
      counts[doc.level] = (counts[doc.level] || 0) + 1;
      if (doc.additionalLevels && Array.isArray(doc.additionalLevels)) {
        doc.additionalLevels.forEach((extraLvl) => {
          counts[extraLvl] = (counts[extraLvl] || 0) + 1;
        });
      }
    });
    return counts;
  }, [documents]);

  const ORDERED_LEVELS: SchoolLevel[] = [
    'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6e', '5e', '4e', '3e',
    '2nde', '2nde-S', '2nde-L',
    '1ere', '1ere-S', '1ere-L',
    'Terminale', 'Terminale-S', 'Terminale-L'
  ];

  const currentLevelIdx = ORDERED_LEVELS.indexOf(activeFilter as SchoolLevel);
  const prevLevel = currentLevelIdx > 0 ? ORDERED_LEVELS[currentLevelIdx - 1] : null;
  const nextLevel =
    currentLevelIdx !== -1 && currentLevelIdx < ORDERED_LEVELS.length - 1
      ? ORDERED_LEVELS[currentLevelIdx + 1]
      : null;

  const handlePrevClass = () => {
    if (prevLevel) {
      handleSelectClass(prevLevel);
    } else {
      setActiveFilter('all');
    }
  };

  const handleNextClass = () => {
    if (nextLevel) {
      handleSelectClass(nextLevel);
    } else if (currentLevelIdx === -1) {
      handleSelectClass(ORDERED_LEVELS[0]);
    }
  };

  // Navigation entre documents dans la visionneuse (Retour et Avance)
  const currentViewerIndex = useMemo(() => {
    if (!activeViewerDoc) return -1;
    return filteredDocuments.findIndex((d) => d.id === activeViewerDoc.id);
  }, [activeViewerDoc, filteredDocuments]);

  const handlePrevViewerDoc = () => {
    if (currentViewerIndex > 0) {
      setActiveViewerDoc(filteredDocuments[currentViewerIndex - 1]);
    }
  };

  const handleNextViewerDoc = () => {
    if (currentViewerIndex >= 0 && currentViewerIndex + 1 < filteredDocuments.length) {
      setActiveViewerDoc(filteredDocuments[currentViewerIndex + 1]);
    }
  };

  const handleSelectClass = (levelCode: SchoolLevel) => {
    if (!auth.isAdmin && !auth.isStudent) {
      showAlert("Accès réservé : Veuillez entrer votre code d'inscription pour visiter cette classe.", 'error');
      setLoginModalState({ isOpen: true, defaultTab: 'student' });
      return;
    }
    setActiveFilter(levelCode);
    setShowingFavorites(false);
    // Smooth scroll to documents grid
    const el = document.getElementById('documents-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTab = (tab: 'home' | 'catalog' | 'dashboard') => {
    if (tab === 'catalog') {
      if (!auth.isAdmin && !auth.isStudent) {
        showAlert("Accès réservé : Veuillez entrer votre code d'inscription pour accéder aux classes.", 'error');
        setLoginModalState({ isOpen: true, defaultTab: 'student' });
        return;
      }
    }
    if (tab === 'dashboard') {
      if (!auth.isAdmin) {
        showAlert("Accès réservé à l'administrateur.", 'error');
        setLoginModalState({ isOpen: true, defaultTab: 'admin' });
        return;
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAIAboutDoc = (doc: EducationalDocument) => {
    setIsAssistantOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-200">
      {/* Toast Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
              alert.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : alert.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                : 'bg-indigo-50 dark:bg-indigo-950/90 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
            }`}
          >
            {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            {alert.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
            {alert.type === 'info' && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
            <span className="text-xs sm:text-sm font-semibold">{alert.text}</span>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header
        auth={auth}
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenLogin={(type) => setLoginModalState({ isOpen: true, defaultTab: type })}
        onLogoutAdmin={handleLogoutAdmin}
        onLogoutStudent={handleLogoutStudent}
        onOpenUpload={() => setUploadModalState({ isOpen: true })}
        onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenFormula={() => setIsFormulaOpen(true)}
        onOpenDictee={() => setIsDicteeOpen(true)}
        onOpenChrono={() => setIsChronoOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onOpenWolofAudio={() => {
          setWolofAudioInitialText('');
          setIsWolofAudioOpen(true);
        }}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenPassScolaire={() => setIsPassModalOpen(true)}
      />

      {/* Hero Welcome Banner (Visible in Catalog tab ONLY when logged in) */}
      {currentTab === 'catalog' && (auth.isStudent || auth.isAdmin) && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-sm">
        {/* Decorative background grid & circles */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3">
                <span>🇸🇳</span>
                <span>Portail Éducatif National du Sénégal</span>
                <span className="text-amber-300">• Examens 2024-2026</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                L'excellence scolaire pour tous, <br className="hidden sm:inline" />
                du <span className="text-amber-300">CI au Baccalauréat</span>.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl leading-relaxed">
                Accédez aux annales corrigées officielles du <strong>CFEE</strong>, <strong>BFEM</strong> et <strong>BAC (S1, S2, L1, L2)</strong>, fascicules de cours complets et un assistant pédagogique disponible 24h/24.
              </p>
            </div>

            {/* Quick Fast-Action Cards */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <div
                onClick={() => handleSelectClass('CM2')}
                className="flex-1 min-w-[130px] p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-amber-300 text-xl font-bold">CFEE</div>
                <div className="text-xs text-white/90 font-medium">Élémentaire (CM2)</div>
                <div className="text-[11px] text-indigo-200 mt-1">Arithmétique & Histoire</div>
              </div>

              <div
                onClick={() => handleSelectClass('3e')}
                className="flex-1 min-w-[130px] p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-emerald-300 text-xl font-bold">BFEM</div>
                <div className="text-xs text-white/90 font-medium">Collège (3ème)</div>
                <div className="text-[11px] text-indigo-200 mt-1">Maths, Dictée & Sciences</div>
              </div>

              <div
                onClick={() => handleSelectClass('Terminale-S')}
                className="flex-1 min-w-[130px] p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-purple-300 text-xl font-bold">BAC</div>
                <div className="text-xs text-white/90 font-medium">Lycée (Terminale)</div>
                <div className="text-[11px] text-indigo-200 mt-1">Séries S & L</div>
              </div>
            </div>
          </div>

          {/* Quick Interactive Tools Bar */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 mr-1">
              <span>⚡</span> Outils Révisions :
            </span>

            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>📊</span>
              <span>Simulateur Moyenne & Mention</span>
            </button>

            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 text-xs font-bold border border-purple-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>✨</span>
              <span>Générateur d'Épreuves IA</span>
            </button>

            <button
              onClick={() => setIsFormulaOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 text-xs font-bold border border-emerald-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>📐</span>
              <span>Formulaire Maths & PC</span>
            </button>

            <button
              onClick={() => setIsDicteeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/30 hover:bg-orange-500/40 text-orange-200 text-xs font-bold border border-orange-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>🎙️</span>
              <span>Dictée Vocale CFEE & BFEM</span>
            </button>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-xs font-bold border border-amber-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>🎓</span>
              <span>Quiz d'Entraînement</span>
            </button>

            <button
              onClick={() => setIsChronoOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/30 hover:bg-sky-500/40 text-sky-200 text-xs font-bold border border-sky-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>⏳</span>
              <span>Chrono & Examens</span>
            </button>

            <button
              onClick={() => setIsFlashcardsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/30 hover:bg-violet-500/40 text-violet-200 text-xs font-bold border border-violet-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>🗂️</span>
              <span>Flashcards Mémo</span>
            </button>

            <button
              onClick={() => {
                setWolofAudioInitialText('');
                setIsWolofAudioOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 text-xs font-bold border border-emerald-400/30 backdrop-blur-sm transition-all cursor-pointer hover:scale-105"
            >
              <span>🔊</span>
              <span>Audio & Wolof</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 pb-28 sm:pb-12">
        {currentTab === 'home' ? (
          <LandingHeroView
            auth={auth}
            onOpenLogin={(type) => setLoginModalState({ isOpen: true, defaultTab: type })}
            onSelectClass={(code) => {
              handleSelectClass(code);
            }}
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenChrono={() => setIsChronoOpen(true)}
            onOpenFlashcards={() => setIsFlashcardsOpen(true)}
            onOpenPassScolaire={() => setIsPassModalOpen(true)}
          />
        ) : currentTab === 'dashboard' ? (
          <AdminDashboard
            documents={documents}
            onOpenUploadForClass={(code) => setUploadModalState({ isOpen: true, defaultLevel: code || 'Terminale-S' })}
            onOpenViewer={setActiveViewerDoc}
            onDownload={handleDownload}
            onDeleteDocument={handleDeleteDocument}
            onEditDocument={(doc) => setEditingDoc(doc)}
            onMergeDocuments={handleMergeDocuments}
            onUpdateDocument={handleSaveEditedDocument}
            onBackToCatalog={() => {
              handleSelectTab('catalog');
            }}
            auth={auth}
            onRequireAuth={() => setLoginModalState({ isOpen: true, defaultTab: 'admin' })}
          />
        ) : !auth.isStudent && !auth.isAdmin ? (
          /* Locked Paywall Screen: Strict Access Restriction */
          <div className="py-12 px-4 max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-4xl mx-auto shadow-inner border border-amber-200 dark:border-amber-800">
              🔒
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
                Accès Restreint aux Classes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Code d'Inscription Requis
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                Personne ne peut visiter les classes ou consulter les cours sans code d'inscription personnel. Les <strong>19 classes (du CI à la Terminale)</strong>, les annales officielles et les corrigés nécessitent un accès validé ou le <strong>Pass Annuel (2 000 FCFA)</strong>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setLoginModalState({ isOpen: true, defaultTab: 'student' })}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Entrer mon Code d'Inscription</span>
                </button>

                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Obtenir mon Pass Annuel (2 000 F)</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <button
                  onClick={() => {
                    setCurrentTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:underline font-bold cursor-pointer"
                >
                  ← Retourner à la page d'accueil
                </button>

                <a
                  href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20souhaite%20obtenir%20mon%20code%20d'acc%C3%A8s%20pour%20acc%C3%A9der%20aux%20classes%20de%20Book%20Education%20S%C3%A9n%C3%A9gal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>💬 Contacter M. Sow (70 565 72 77)</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search, Filter Bar and Favorites */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onSelectFilter={(f) => {
            setActiveFilter(f);
            setShowingFavorites(false);
          }}
          favoritesCount={favorites.length}
          showingFavorites={showingFavorites}
          onToggleFavorites={() => setShowingFavorites(!showingFavorites)}
          totalFilteredDocs={filteredDocuments.length}
          totalAllDocs={documents.length}
        />

        {/* Favorites Header if Active */}
        {showingFavorites && (
          <div className="mt-8 mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <Star className="w-5 h-5 fill-current text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base">
                Mes Ressources Favorites ({favorites.length})
              </h3>
            </div>
            <button
              onClick={() => setShowingFavorites(false)}
              className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
            >
              Afficher tout le catalogue
            </button>
          </div>
        )}

        {/* Class Libraries Section (Hidden when searching or viewing only favorites) */}
        {!showingFavorites && !searchQuery && (
          <ClassLibraries
            currentView={currentView}
            onViewChange={setCurrentView}
            onSelectClass={handleSelectClass}
            onOpenUploadForClass={(code) => setUploadModalState({ isOpen: true, defaultLevel: code })}
            auth={auth}
            docCountsByLevel={docCountsByLevel}
          />
        )}

        {/* Documents Grid Section */}
        <section id="documents-section" className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📚</span>
              <span>
                {showingFavorites
                  ? 'Vos fiches & exercices favoris'
                  : activeFilter === 'all'
                  ? 'Toutes les ressources pédagogiques'
                  : `Ressources : ${activeFilter}`}
              </span>
            </h3>

            {/* Android / Desktop Quick Navigation Bar (Touches Retour & Avance) */}
            {activeFilter !== 'all' && (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
                <button
                  onClick={handlePrevClass}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  title="Niveau précédent ou retour"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <div className="px-2 sm:px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs truncate max-w-[130px] sm:max-w-none">
                  {activeFilter}
                </div>

                <button
                  onClick={handleNextClass}
                  disabled={!nextLevel}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                  title="Niveau suivant"
                >
                  <span>Avance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveFilter('all')}
                  className="ml-2 text-xs font-semibold text-indigo-600 hover:underline px-1.5 py-1 cursor-pointer"
                >
                  Tout
                </button>
              </div>
            )}
          </div>

          <DocumentGrid
            documents={filteredDocuments}
            onOpenViewer={(doc) => setActiveViewerDoc(doc)}
            onDownload={handleDownload}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isDocFavorite}
            onDeleteDocument={handleDeleteDocument}
            auth={auth}
            onRequireAuth={() => setLoginModalState({ isOpen: true, defaultTab: 'student' })}
          />
        </section>
        </>
        )}
      </main>

      {/* Floating Action Button for Assistant */}
      <div className="fixed bottom-20 sm:bottom-5 right-4 sm:right-5 z-40">
        <button
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-bold shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all cursor-pointer border border-white/20 active:scale-95"
          title="Ouvrir l'Assistant Pédagogique IA"
        >
          <span className="text-lg sm:text-xl animate-bounce">🤖</span>
          <span className="text-xs sm:text-sm hidden xs:inline">Assistant IA</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* Mobile Android Floating Bottom Navigation Dock */}
      <nav
        aria-label="Navigation mobile Android"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
      >
        <button
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center ${
            currentTab === 'home' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
          title="Page d'accueil"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            currentTab === 'home' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <span className="text-xs">🏠</span>
          </div>
          <span className="text-[10px]">Accueil</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('catalog');
            setActiveFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center ${
            currentTab === 'catalog' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300'
          }`}
          title="Toutes les classes"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            currentTab === 'catalog' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}>
            <BookOpen className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <span className="text-[10px]">Classes</span>
        </button>

        <button
          onClick={handlePrevClass}
          className="flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center"
          title="Classe précédente ou retour"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <span className="text-[10px] font-bold">Retour</span>
        </button>

        <button
          onClick={() => setIsFlashcardsOpen(true)}
          className="flex flex-col items-center gap-0.5 text-violet-700 dark:text-violet-400 hover:text-violet-900 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center"
          title="Flashcards Mémo"
        >
          <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-xs">
            🗂️
          </div>
          <span className="text-[10px] font-bold">Mémo</span>
        </button>

        <button
          onClick={() => setIsChronoOpen(true)}
          className="flex flex-col items-center gap-0.5 text-sky-700 dark:text-sky-400 hover:text-sky-900 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center"
          title="Chrono Examen"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-xs">
            ⏳
          </div>
          <span className="text-[10px] font-bold">Chrono</span>
        </button>

        {auth.isAdmin && (
          <button
            onClick={() => {
              setCurrentTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-0.5 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center ${
              currentTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
            }`}
            title="Tableau de bord Admin"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              currentTab === 'dashboard' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[10px]">Admin</span>
          </button>
        )}

        <button
          onClick={handleToggleTheme}
          className="flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-300 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center"
          title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          </div>
          <span className="text-[10px] font-bold">{isDark ? "Clair" : "Sombre"}</span>
        </button>

        <button
          onClick={handleNextClass}
          className="flex flex-col items-center gap-0.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-1 cursor-pointer active:scale-95 min-h-[44px] justify-center"
          title="Classe suivante"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">Avance</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-16 py-10 px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-base">
            <span>📚 Book Education Sénégal</span>
            <span>🇸🇳</span>
          </div>
          <p className="max-w-md">
            Plateforme complète d'apprentissage, fascicules de cours, épreuves d'examens et révisions interactives du Cours d'Initiation (CI) au Baccalauréat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 dark:text-slate-400 pt-2 font-medium">
            <span>CI - CM2 (CFEE)</span>
            <span>•</span>
            <span>6e - 3e (BFEM)</span>
            <span>•</span>
            <span>Seconde - Terminale (BAC S & L)</span>
          </div>

          {/* WhatsApp Direct Contact in Footer */}
          <div className="pt-2">
            <a
              href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20vous%20contacte%20depuis%20Book%20Education%20S%C3%A9n%C3%A9gal."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs transition-all shadow-2xs active:scale-95"
            >
              <span className="text-base">💬</span>
              <span>Contact & Renseignements WhatsApp : +221 70 565 72 77</span>
            </a>
          </div>

          <div className="pt-2 text-slate-400 dark:text-slate-500 text-[11px]">
            © {new Date().getFullYear()} Book Education Sénégal - Conforme aux programmes officiels de l'Éducation Nationale.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DocumentViewerModal
        document={activeViewerDoc}
        onClose={() => setActiveViewerDoc(null)}
        onDownload={handleDownload}
        onAskAIAboutDoc={handleAskAIAboutDoc}
        onPrevDoc={handlePrevViewerDoc}
        onNextDoc={handleNextViewerDoc}
        hasPrevDoc={currentViewerIndex > 0}
        hasNextDoc={currentViewerIndex >= 0 && currentViewerIndex + 1 < filteredDocuments.length}
        onOpenWolofAudio={(text) => {
          setWolofAudioInitialText(text || '');
          setIsWolofAudioOpen(true);
        }}
        onEdit={(doc) => setEditingDoc(doc)}
        isAdmin={auth.isAdmin}
      />

      <AssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeLevel={activeFilter !== 'all' ? activeFilter : 'Général'}
      />

      <LoginModal
        isOpen={loginModalState.isOpen}
        defaultTab={loginModalState.defaultTab}
        onClose={() => setLoginModalState({ isOpen: false, defaultTab: 'student' })}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onStudentLoginSuccess={handleStudentLoginSuccess}
        onOpenPassScolaire={() => setIsPassModalOpen(true)}
      />

      <UploadModal
        isOpen={uploadModalState.isOpen}
        defaultLevel={uploadModalState.defaultLevel}
        existingDocuments={documents}
        onClose={() => setUploadModalState({ isOpen: false })}
        onAddDocument={handleAddDocument}
        onAddDocuments={handleAddDocuments}
        onUpdateDocument={handleSaveEditedDocument}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />

      <GradeSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      <ExerciseGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onSaveAsDocument={handleAddDocument}
      />

      <FormulaSheetModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
      />

      <DicteeAudioModal
        isOpen={isDicteeOpen}
        onClose={() => setIsDicteeOpen(false)}
      />

      <ChronoPlanningModal
        isOpen={isChronoOpen}
        onClose={() => setIsChronoOpen(false)}
      />

      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
      />

      <WolofAudioTutorModal
        isOpen={isWolofAudioOpen}
        onClose={() => setIsWolofAudioOpen(false)}
        initialTextToRead={wolofAudioInitialText}
      />

      <EditDocumentModal
        document={editingDoc}
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        onSave={handleSaveEditedDocument}
        onDelete={handleDeleteDocument}
        isAdmin={auth.isAdmin}
      />

      <PassScolaireModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        onOpenLogin={() => setLoginModalState({ isOpen: true, defaultTab: 'student' })}
      />
    </div>
  );
}
