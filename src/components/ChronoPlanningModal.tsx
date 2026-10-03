import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Clock, Calendar, CheckCircle2, AlertTriangle, Sparkles, Bell, Volume2, Maximize2, Minimize2, ArrowRight } from 'lucide-react';

interface ExamCountdown {
  name: string;
  cycle: string;
  targetDate: string; // ISO date string
  description: string;
  badgeColor: string;
}

const OFFICIAL_EXAMS: ExamCountdown[] = [
  {
    name: 'Baccalauréat Général (Séries S & L)',
    cycle: 'Lycée (Terminale)',
    targetDate: '2026-07-02T08:00:00',
    description: 'Épreuves écrites obligatoires du premier groupe dans tous les centres académiques du Sénégal.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    name: 'BFEM - Brevet de Fin d’Études Moyennes',
    cycle: 'Collège (3ème)',
    targetDate: '2026-07-16T08:00:00',
    description: 'Examens nationaux de passage au second cycle (Lycée).',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    name: 'CFEE & Entrée en 6ème',
    cycle: 'Élémentaire (CM2)',
    targetDate: '2026-06-25T08:00:00',
    description: 'Certificat de Fin d’Études Élémentaires et concours d’entrée en sixième.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    name: 'Concours Général Sénégalais',
    cycle: 'Première & Terminale',
    targetDate: '2026-05-18T08:00:00',
    description: 'Compétition nationale d’excellence distinguant les meilleurs élèves du pays.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];

interface PresetDuration {
  id: string;
  label: string;
  durationMinutes: number;
  exam: string;
  milestones: { atMinutesRemaining: number; tip: string }[];
}

const PRESET_DURATIONS: PresetDuration[] = [
  {
    id: 'bac-maths-s',
    label: 'Bac S : Mathématiques (4h)',
    durationMinutes: 240,
    exam: 'Terminale S1/S2',
    milestones: [
      { atMinutesRemaining: 180, tip: '1h écoulée : vous devriez avoir terminé l’exercice 1 et entamé le problème d’analyse.' },
      { atMinutesRemaining: 60, tip: 'Dernière heure : terminez les questions restantes et abordez le problème de géométrie/probabilités.' },
      { atMinutesRemaining: 15, tip: '15 min restantes : relisez soigneusement vos calculs, encadrez vos résultats finaux et vérifiez la numérotation.' }
    ]
  },
  {
    id: 'bac-philo-l',
    label: 'Bac L : Dissertation Philo (4h)',
    durationMinutes: 240,
    exam: 'Terminale L1/L2',
    milestones: [
      { atMinutesRemaining: 200, tip: 'Brouillon terminé : votre problématique et votre plan dialectique (Thèse / Antithèse / Synthèse) doivent être posés.' },
      { atMinutesRemaining: 60, tip: 'Abordez la 3ème partie (Dépassement) et préparez la rédaction soignée de votre conclusion.' },
      { atMinutesRemaining: 20, tip: 'Relecture impérative : chassez les fautes d’orthographe, accords de verbes et clarté des citations.' }
    ]
  },
  {
    id: 'bac-pc',
    label: 'Bac S : Sciences Physiques (4h)',
    durationMinutes: 240,
    exam: 'Terminale S',
    milestones: [
      { atMinutesRemaining: 120, tip: 'Mi-parcours : la partie Chimie (dosages, cinétique) doit être finalisée.' },
      { atMinutesRemaining: 20, tip: 'Vérifiez systématiquement les unités (SI) et le nombre de chiffres significatifs !' }
    ]
  },
  {
    id: 'bfem-maths',
    label: 'BFEM : Mathématiques (2h)',
    durationMinutes: 120,
    exam: '3ème',
    milestones: [
      { atMinutesRemaining: 60, tip: '1 heure écoulée : les activités numériques doivent être terminées. Passez à la géométrie (Thalès / Pythagore).' },
      { atMinutesRemaining: 10, tip: '10 min restantes : vérifiez les figures géométriques et vos calculs de racines carrées.' }
    ]
  },
  {
    id: 'bfem-français',
    label: 'BFEM : Texte & Dictée (2h)',
    durationMinutes: 120,
    exam: '3ème',
    milestones: [
      { atMinutesRemaining: 30, tip: 'Relecture de la dictée : vérifiez l’accord de chaque participe passé et les pluriels.' }
    ]
  },
  {
    id: 'cfee-arithmetique',
    label: 'CFEE : Résolution de Problèmes (1h30)',
    durationMinutes: 90,
    exam: 'CM2',
    milestones: [
      { atMinutesRemaining: 20, tip: 'Vérifiez bien que vous avez posé les opérations avec les bonnes unités (FCFA, km/h, litres).' }
    ]
  },
  {
    id: 'pomodoro-25',
    label: 'Pomodoro Révision Intense (25 min)',
    durationMinutes: 25,
    exam: 'Étude autonome',
    milestones: [
      { atMinutesRemaining: 5, tip: 'Encore 5 minutes de concentration absolue avant une pause bien méritée de 5 minutes !' }
    ]
  }
];

interface ChronoPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChronoPlanningModal: React.FC<ChronoPlanningModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chrono' | 'planning'>('chrono');

  // Chrono state
  const [selectedPreset, setSelectedPreset] = useState<PresetDuration>(PRESET_DURATIONS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(PRESET_DURATIONS[0].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<string | null>(null);

  // Audio beep
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            return 0;
          }

          // Check milestones
          const minutesRemaining = Math.floor((prev - 1) / 60);
          const foundMilestone = selectedPreset.milestones.find(
            (m) => m.atMinutesRemaining === minutesRemaining && (prev - 1) % 60 === 0
          );
          if (foundMilestone) {
            setCurrentTip(foundMilestone.tip);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, selectedPreset]);

  if (!isOpen) return null;

  const handleSelectPreset = (p: PresetDuration) => {
    setIsRunning(false);
    setSelectedPreset(p);
    setTimeLeft(p.durationMinutes * 60);
    setCurrentTip(null);
  };

  const handleToggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedPreset.durationMinutes * 60);
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedPreset.durationMinutes * 60);
    setCurrentTip(null);
  };

  const handleAddFiveMinutes = () => {
    setTimeLeft((prev) => prev + 300);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('AudioContext not supported');
    }
  };

  // Formatter
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = selectedPreset.durationMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  // Calculate days remaining for official exams
  const getDaysLeft = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        className={`bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-4xl rounded-3xl max-h-[92vh]'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center text-xl shadow-inner">
              ⏳
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Chrono Examen & Calendrier Officiel
              </h3>
              <p className="text-xs text-indigo-200/80">
                Gestion du temps en condition réelle d'examen au Sénégal 🇸🇳
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title={isFullScreen ? 'Quitter le mode plein écran' : 'Plein écran immersion'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('chrono')}
            className={`py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'chrono'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chrono Épreuves & Pomodoro</span>
          </button>

          <button
            onClick={() => setActiveTab('planning')}
            className={`py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'planning'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Compte à Rebours & Calendrier Examens</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'chrono' ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Presets Grid */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Choisissez votre épreuve ou mode d'étude :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_DURATIONS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedPreset.id === preset.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{preset.label}</div>
                      <div className={`text-[10px] mt-0.5 ${selectedPreset.id === preset.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {preset.exam}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Digital Chrono Display */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-center shadow-xl border border-slate-800 text-white relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-300 border border-white/10 mb-4">
                    {selectedPreset.label}
                  </span>

                  <div className="font-mono text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md select-none">
                    {formatTime(timeLeft)}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-md mx-auto h-2.5 bg-slate-800 rounded-full overflow-hidden mt-6">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft < 600 ? 'bg-rose-500' : timeLeft < 1800 ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={handleResetTimer}
                      className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer active:scale-95"
                      title="Réinitialiser le chrono"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleToggleTimer}
                      className={`px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isRunning
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-5 h-5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>{timeLeft === 0 ? 'Recommencer' : 'Démarrer l\'épreuve'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAddFiveMinutes}
                      className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all cursor-pointer active:scale-95"
                      title="Ajouter 5 minutes"
                    >
                      +5 min
                    </button>
                  </div>
                </div>
              </div>

              {/* Milestone Teacher Tip */}
              {currentTip && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-start gap-3 animate-in fade-in duration-200">
                  <span className="text-xl">💡</span>
                  <div>
                    <strong className="block font-bold text-amber-900 mb-0.5">
                      Repère Pédagogique en cours d'épreuve :
                    </strong>
                    <span>{currentTip}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Planning & Official Countdown */
            <div className="space-y-6">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  📅 Calendrier & Compte à Rebours des Examens Nationaux
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Dates officielles prévisionnelles du Ministère de l'Éducation Nationale du Sénégal
                </p>
              </div>

              {/* Exam Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFICIAL_EXAMS.map((exam, idx) => {
                  const daysLeft = getDaysLeft(exam.targetDate);
                  return (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${exam.badgeColor}`}>
                            {exam.cycle}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            Prévu en {new Date(exam.targetDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </span>
                        </div>

                        <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {exam.name}
                        </h5>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {exam.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                            {daysLeft}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            jours restants
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            setActiveTab('chrono');
                            const match = PRESET_DURATIONS.find((p) => p.exam.toLowerCase().includes(exam.cycle.toLowerCase()));
                            if (match) handleSelectPreset(match);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          <span>Lancer une épreuve chrono</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly Revision Strategy Guide */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
                <h5 className="font-bold text-indigo-950 text-sm sm:text-base flex items-center gap-2 mb-3">
                  <span>🧭</span>
                  <span>Guide Stratégique de Révision pour le Sénégal</span>
                </h5>

                <div className="space-y-3 text-xs sm:text-sm text-indigo-900 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700 shrink-0">À J-60 :</span>
                    <span>Consolidation des cours théoriques et fiches de synthèse sur chaque chapitre (formules, vocabulaire philosophique, dates d'histoire).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700 shrink-0">À J-30 :</span>
                    <span>Entraînement exclusif sur les annales officielles des 5 dernières années en temps réel avec le chrono.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-700 shrink-0">À J-7 :</span>
                    <span>Relecture calme des formulaires, gestion du sommeil et préparation matérielle (calculatrice non programmable, règle, stylos).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
