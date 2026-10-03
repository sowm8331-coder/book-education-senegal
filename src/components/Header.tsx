import React from 'react';
import { BookOpen, User, ShieldCheck, Upload, Sparkles, LogOut, GraduationCap, Sun, Moon, BarChart3 } from 'lucide-react';
import { UserAuth } from '../types';

interface HeaderProps {
  auth: UserAuth;
  currentTab: 'home' | 'catalog' | 'dashboard';
  onSelectTab: (tab: 'home' | 'catalog' | 'dashboard') => void;
  onOpenLogin: (type: 'admin' | 'student') => void;
  onLogoutAdmin: () => void;
  onLogoutStudent: () => void;
  onOpenUpload: () => void;
  onToggleAssistant: () => void;
  onOpenQuiz: () => void;
  onOpenSimulator: () => void;
  onOpenGenerator: () => void;
  onOpenFormula: () => void;
  onOpenDictee: () => void;
  onOpenChrono: () => void;
  onOpenFlashcards: () => void;
  onOpenWolofAudio?: () => void;
  onOpenPassScolaire?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  auth,
  currentTab,
  onSelectTab,
  onOpenLogin,
  onLogoutAdmin,
  onLogoutStudent,
  onOpenUpload,
  onToggleAssistant,
  onOpenQuiz,
  onOpenSimulator,
  onOpenGenerator,
  onOpenFormula,
  onOpenDictee,
  onOpenChrono,
  onOpenFlashcards,
  onOpenWolofAudio,
  onOpenPassScolaire,
  isDark = false,
  onToggleTheme
}) => {
  return (
    <header className="relative w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand */}
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  Book Education Sénégal
                </h1>
                <span className="text-base" title="Sénégal">🇸🇳</span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>Plateforme officielle du</span>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.2 rounded">CI au Baccalauréat</span>
              </p>
            </div>
          </div>

          {/* Quick Tools & Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Main Tabs Switcher */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => onSelectTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏠 Accueil
              </button>
              <button
                onClick={() => onSelectTab('catalog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'catalog'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📚 Cours & Classes</span>
                {!auth.isStudent && !auth.isAdmin && (
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-extrabold flex items-center gap-0.5">
                    <span>🔒 Code</span>
                  </span>
                )}
              </button>
              {auth.isAdmin && (
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'dashboard'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300'
                  }`}
                  title="Tableau de bord de gestion et statistiques"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>📊 Tableau de Bord</span>
                </button>
              )}
            </div>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden md:inline-block" />

            {/* Global Dark Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
                aria-label="Basculer le mode sombre"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline text-[11px]">Mode Clair</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline text-[11px]">Mode Sombre</span>
                  </>
                )}
              </button>
            )}

            {/* Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Calculer sa moyenne avec les coefficients officiels du Sénégal"
            >
              <span>📊</span>
              <span>Simulateur</span>
            </button>

            {/* Exam Generator Button */}
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Générer une épreuve et son corrigé avec l'IA"
            >
              <span>✨</span>
              <span className="hidden sm:inline">Générateur Épreuves</span>
            </button>

            {/* Formula Cheat Sheet */}
            <button
              onClick={onOpenFormula}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Formulaire officiel de Maths & Sciences"
            >
              <span>📐</span>
              <span className="hidden sm:inline">Formulaire</span>
            </button>

            {/* Audio Dictation */}
            <button
              onClick={onOpenDictee}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Entraînement à la dictée lue à haute voix"
            >
              <span>🎙️</span>
              <span className="hidden sm:inline">Dictée</span>
            </button>

            {/* Audio Wolof & Synthèse Vocale */}
            {onOpenWolofAudio && (
              <button
                onClick={onOpenWolofAudio}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Synthèse vocale et cours audio expliqués en Wolof et Français"
              >
                <span>🔊</span>
                <span>Audio Wolof</span>
              </button>
            )}

            {/* Quiz Practice Mode */}
            <button
              onClick={onOpenQuiz}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Tester ses connaissances avec les quiz d'entraînement"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Quiz</span>
            </button>

            {/* Chrono & Planning */}
            <button
              onClick={onOpenChrono}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Chrono d'épreuves officielles et compte à rebours des examens"
            >
              <span>⏳</span>
              <span className="hidden xl:inline">Chrono</span>
            </button>

            {/* Flashcards Mémo */}
            <button
              onClick={onOpenFlashcards}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Flashcards interactives pour mémoriser les notions clés"
            >
              <span>🗂️</span>
              <span className="hidden sm:inline">Flashcards</span>
            </button>

            {/* Pass Scolaire Annuel 2000 F Button */}
            {onOpenPassScolaire && (
              <button
                type="button"
                onClick={onOpenPassScolaire}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/25 cursor-pointer active:scale-95"
                title="Pass Scolaire Annuel : 2 000 FCFA pour toute l'année scolaire"
              >
                <span>💎</span>
                <span>Pass 2 000 F</span>
              </button>
            )}

            {/* WhatsApp Contact Button */}
            <a
              href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20vous%20contacte%20depuis%20Book%20Education%20S%C3%A9n%C3%A9gal."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
              title="Contacter sur WhatsApp au 70 565 72 77"
            >
              <span className="text-xs">💬</span>
              <span className="hidden sm:inline">WhatsApp :</span>
              <span>70 565 72 77</span>
            </a>

            {/* Divider */}
            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 hidden md:inline-block" />

            {/* Status Badges */}
            {auth.isAdmin && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </span>
            )}

            {/* Student Auth Button */}
            {auth.isStudent ? (
              <button
                onClick={onLogoutStudent}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Déconnexion
              </button>
            ) : (
              <button
                onClick={() => onOpenLogin('student')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Élève</span>
              </button>
            )}

            {/* Admin Auth Button */}
            {auth.isAdmin ? (
              <button
                onClick={onLogoutAdmin}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Admin Off
              </button>
            ) : (
              <button
                onClick={() => onOpenLogin('admin')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </button>
            )}

            {/* Upload Button (Admin only) */}
            {auth.isAdmin && (
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Importer des documents PDF / Word dans chaque classe"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Documents</span>
              </button>
            )}

            {/* AI Assistant Button */}
            <button
              onClick={onToggleAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>IA Tutor</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
