import React from 'react';
import { SchoolLevel, UserAuth } from '../types';
import { BookOpen, Sparkles, GraduationCap, ShieldCheck, CheckCircle2, ArrowRight, Clock, Star, Brain, Award, Users, BookMarked, Lock } from 'lucide-react';

interface LandingHeroViewProps {
  auth: UserAuth;
  onOpenLogin: (type: 'admin' | 'student') => void;
  onSelectClass: (level: SchoolLevel) => void;
  onOpenChrono: () => void;
  onOpenFlashcards: () => void;
  onOpenQuiz: () => void;
  onOpenPassScolaire?: () => void;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  auth,
  onOpenLogin,
  onSelectClass,
  onOpenChrono,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenPassScolaire
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-8">
      {/* Hero Header with Senegal National Pride */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white p-6 sm:p-12 md:p-16 shadow-2xl border border-indigo-800/40">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-indigo-100 shadow-inner">
            <span className="text-base">🇸🇳</span>
            <span>République du Sénégal • Ministère de l'Éducation Nationale</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-none text-balance">
            La Clé de Votre Succès <br className="hidden sm:inline" />
            du <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">CI au Baccalauréat</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-indigo-100/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Accédez à la plus grande bibliothèque numérique du Sénégal : fascicules officiels, épreuves corrigées du <strong>CFEE</strong>, <strong>BFEM</strong> et <strong>BAC</strong>, quiz interactifs et simulateur de mention.
          </p>

          {/* Special Back to School 2000 F Offer Banner */}
          <div 
            onClick={onOpenPassScolaire}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/20 via-amber-300/25 to-yellow-400/20 border-2 border-amber-300/60 backdrop-blur-md text-left flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-amber-300 transition-all hover:scale-[1.01] shadow-lg shadow-amber-500/10 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                🎒
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider mb-1">
                  <span>⚡ Rentrée Scolaire la Semaine Prochaine</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  Pass Annuel Complet : <span className="text-amber-300 font-extrabold underline decoration-amber-400">2 000 FCFA</span> pour toute l'année scolaire !
                </h3>
                <p className="text-xs text-indigo-100/90 mt-0.5 font-medium">
                  Payez par Wave ou Orange Money (70 565 72 77) et recevez immédiatement votre lien et code personnel sur WhatsApp.
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <span className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md group-hover:scale-105 transition-all">
                <span>Obtenir mon Pass (2 000 F)</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => onOpenLogin('student')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base border border-white/25 backdrop-blur-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-indigo-200" />
              <span>Se Connecter avec mon Code</span>
            </button>

            <button
              onClick={onOpenPassScolaire}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Pass Annuel Scolaire (2 000 F)</span>
            </button>
          </div>

          {/* Security & Access Notice with WhatsApp direct link */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-xs text-indigo-200/90">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Codes d'accès délivrés par l'administration</span>
            </div>
            <span className="hidden sm:inline opacity-40">•</span>
            <a
              href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20souhaite%20obtenir%20mon%20code%20d'acc%C3%A8s%20pour%20Book%20Education%20S%C3%A9n%C3%A9gal."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span>💬 WhatsApp :</span>
              <span className="underline decoration-emerald-400/60 font-black">70 565 72 77</span>
            </a>
          </div>
        </div>
      </section>

      {/* Visual Showcase: Senegalese Students of Diverse Complexions */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-md h-64 sm:h-80 group">
            <img
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
              alt="Élèves sénégalais de différents teints étudiant ensemble avec fierté"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold w-fit mb-2">
                <span>🇸🇳</span>
                <span>Jeunesse & Excellence Sénégalaise</span>
              </span>
              <p className="text-sm sm:text-base font-extrabold leading-snug">
                Élèves et candidats de toutes les régions : Dakar, Thiès, Ziguinchor, Saint-Louis, Kaolack, Tamba.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              <span>🎓</span>
              <span>Une Éducation Inclusive & Représentative</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              Pour Chaque Élève Sénégalais, Sans Exception
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Book Education Sénégal célèbre la richesse et la diversité de nos apprenants. Des cours clairs, des exercices corrigés et des outils adaptés pour que chaque fille et chaque garçon réussisse avec brio ses examens d'État.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 block">100%</span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Programme Officiel</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">14 Régions</span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Accès Partout au Sénégal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Numbers / Trust Badges */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
            📚
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">19 Classes</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Du CI à la Terminale</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
            ✅
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">100%</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Conforme Programme Sénégal</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🏆
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">CFEE • BFEM • BAC</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Annales Corrigées Officielles</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🤖
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">24h/24</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">Tuteur Pédagogique Intelligent</span>
        </div>
      </section>

      {/* Interactive Features Preview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Des Outils Modernes Pour Réussir
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            Tout le matériel d'examen dans votre poche
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conçu pour offrir les mêmes chances de réussite à chaque élève à Dakar, Thiès, Ziguinchor, Saint-Louis et dans toutes les régions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Chrono & Compte à Rebours */}
          <div 
            onClick={onOpenChrono}
            className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⏳
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Chrono d'Examen Réel
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Entraînez-vous dans les conditions exactes de l'examen (4h Maths S, 4h Dissertation Philo, 2h BFEM) avec conseils pédagogiques en cours d'épreuve.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Tester le chrono officiel</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2: Flashcards Mémo */}
          <div 
            onClick={onOpenFlashcards}
            className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🗂️
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Flashcards Mémo Sénégal
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Cartes interactives recto-verso : formules de physique, repères historiques (Lat-Dior, Aline Sitoé Diatta) et concepts philosophiques essentiels.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:translate-x-1 transition-transform">
              <span>Mémoriser les notions clés</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3: Quiz d'Entraînement */}
          <div 
            onClick={onOpenQuiz}
            className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎓
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Quiz & Évaluations Directes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Testez vos connaissances en temps réel avec des QCM conformes aux critères de notation des jurys d'examens nationaux.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Lancer un quiz d'entraînement</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exam Cycles Quick Access */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Examens Clés du Système Sénégalais
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Préparez votre diplôme dès aujourd'hui
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Accédez aux cours et épreuves spécifiques de votre cycle
            </p>
          </div>

          <button
            onClick={() => onOpenLogin('student')}
            className="self-start md:self-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs sm:text-sm text-white transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Accéder à mon espace</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Baccalauréat */}
          <div 
            onClick={() => {
              if (!auth.isStudent && !auth.isAdmin) {
                onOpenLogin('student');
              } else {
                onSelectClass('Terminale-S');
              }
            }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-white/10 transition-all cursor-pointer group relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-400">LYCÉE (S1, S2, L1, L2)</span>
              {!auth.isStudent && !auth.isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Code requis</span>
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-base sm:text-lg group-hover:text-amber-300 transition-colors">
              Baccalauréat Sénégalais
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Maths, Sciences Physiques, SVT, Philosophie, Français, Histoire-Géo.
            </p>
          </div>

          {/* BFEM */}
          <div 
            onClick={() => {
              if (!auth.isStudent && !auth.isAdmin) {
                onOpenLogin('student');
              } else {
                onSelectClass('3e');
              }
            }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-white/10 transition-all cursor-pointer group relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-sky-400">COLLÈGE (3ÈME)</span>
              {!auth.isStudent && !auth.isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-300/30">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Code requis</span>
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-base sm:text-lg group-hover:text-sky-300 transition-colors">
              BFEM (Brevet Moyen)
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Texte suivi de questions, dictées, activités numériques et géométrie.
            </p>
          </div>

          {/* CFEE */}
          <div 
            onClick={() => {
              if (!auth.isStudent && !auth.isAdmin) {
                onOpenLogin('student');
              } else {
                onSelectClass('CM2');
              }
            }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 transition-all cursor-pointer group relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400">ÉLÉMENTAIRE (CM2)</span>
              {!auth.isStudent && !auth.isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Code requis</span>
                </span>
              )}
            </div>
            <h4 className="font-extrabold text-base sm:text-lg group-hover:text-emerald-300 transition-colors">
              CFEE & Entrée en 6ème
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Contrôle des connaissances, calcul rapide, résolution de problèmes.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials from Senegal Students and Teachers */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Ils révisent avec Book Education Sénégal
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Témoignages d'élèves et enseignants dans les lycées et collèges du Sénégal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                « Les épreuves corrigées du Bac S2 et le chrono d'examen m'ont permis de gérer mon stress. J'ai décroché ma mention Très Bien au centre de Dakar ! »
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Amadou Diallo</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Terminale S2 • Dakar</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                « Pour ma classe de 3ème à Thiès, les dictées audio et les fiches mémo en mathématiques ont augmenté le taux de réussite de nos élèves au BFEM. »
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                FN
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Mme Fatou Ndiaye</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Professeure de Lettres • Thiès</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex text-amber-400 text-xs">
                ★★★★★
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                « Une ressource inestimable. Tous les fascicules de cours conformes aux programmes officiels sont disponibles sans connexion permanente. »
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                IS
              </div>
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">Ibrahima Sarr</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Élève en 1ère S • Saint-Louis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Motivational Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black">
          Prêt(e) à Réussir Votre Année Scolaire ?
        </h3>
        <p className="text-xs sm:text-base text-indigo-100 max-w-xl mx-auto">
          Connectez-vous dès maintenant avec votre code personnel pour sauvegarder vos cours favoris et commencer vos entraînements chronométrés.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenLogin('student')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            🔐 Entrer mon Code d'Accès
          </button>

          <a
            href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20je%20souhaite%20obtenir%20des%20informations%20ou%20un%20code%20d'acc%C3%A8s%20pour%20Book%20Education%20S%C3%A9n%C3%A9gal."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <span>💬 WhatsApp : 70 565 72 77</span>
          </a>

          <button
            onClick={() => onOpenLogin('admin')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer active:scale-95"
          >
            🛡️ Espace Gestionnaire
          </button>
        </div>
      </section>
    </div>
  );
};
