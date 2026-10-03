import React, { useState, useMemo } from 'react';
import { X, Calculator, Award, AlertTriangle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface SubjectConfig {
  name: string;
  coeff: number;
  placeholder?: number;
}

type ExamProfile = 'BAC_S2' | 'BAC_S1' | 'BAC_L' | 'BFEM' | 'CFEE';

const EXAM_CONFIGS: Record<ExamProfile, { title: string; subtitle: string; subjects: SubjectConfig[] }> = {
  BAC_S2: {
    title: 'Baccalauréat Série S2 (Sciences Expérimentales)',
    subtitle: 'Coefficients officiels Office du Baccalauréat du Sénégal',
    subjects: [
      { name: 'SVT (Sciences de la Vie et de la Terre)', coeff: 6, placeholder: 14 },
      { name: 'Mathématiques', coeff: 5, placeholder: 13 },
      { name: 'Sciences Physiques (PC)', coeff: 5, placeholder: 12 },
      { name: 'Philosophie', coeff: 2, placeholder: 11 },
      { name: 'Français', coeff: 2, placeholder: 12 },
      { name: 'Histoire - Géographie', coeff: 2, placeholder: 13 },
      { name: 'Anglais (LV1)', coeff: 2, placeholder: 14 },
      { name: 'Éducation Physique et Sportive (EPS)', coeff: 1, placeholder: 15 }
    ]
  },
  BAC_S1: {
    title: 'Baccalauréat Série S1 (Mathématiques & Sciences Physiques)',
    subtitle: 'Coefficients officiels Office du Baccalauréat du Sénégal',
    subjects: [
      { name: 'Mathématiques renforcées', coeff: 6, placeholder: 15 },
      { name: 'Sciences Physiques', coeff: 6, placeholder: 14 },
      { name: 'SVT', coeff: 3, placeholder: 13 },
      { name: 'Philosophie', coeff: 2, placeholder: 11 },
      { name: 'Français', coeff: 2, placeholder: 12 },
      { name: 'Histoire - Géographie', coeff: 2, placeholder: 12 },
      { name: 'Anglais (LV1)', coeff: 2, placeholder: 14 },
      { name: 'EPS', coeff: 1, placeholder: 15 }
    ]
  },
  BAC_L: {
    title: 'Baccalauréat Séries L (L1 / L2 / L\')',
    subtitle: 'Coefficients officiels Office du Baccalauréat du Sénégal',
    subjects: [
      { name: 'Philosophie', coeff: 6, placeholder: 14 },
      { name: 'Français (Dissertation / Texte)', coeff: 5, placeholder: 13 },
      { name: 'Histoire - Géographie', coeff: 4, placeholder: 13 },
      { name: 'Langue Vivante 1 (Anglais / Arabe)', coeff: 3, placeholder: 14 },
      { name: 'Langue Vivante 2 (Espagnol / Allemand)', coeff: 3, placeholder: 12 },
      { name: 'Mathématiques L', coeff: 2, placeholder: 11 },
      { name: 'EPS', coeff: 1, placeholder: 15 }
    ]
  },
  BFEM: {
    title: 'BFEM - Brevet de Fin d’Études Moyennes (3ème)',
    subtitle: 'Coefficients officiels DEXCO Sénégal',
    subjects: [
      { name: 'Français (Texte & Dictée)', coeff: 3, placeholder: 13 },
      { name: 'Mathématiques', coeff: 3, placeholder: 14 },
      { name: 'Sciences Physiques', coeff: 2, placeholder: 12 },
      { name: 'SVT', coeff: 2, placeholder: 13 },
      { name: 'Histoire - Géographie', coeff: 2, placeholder: 14 },
      { name: 'Anglais', coeff: 2, placeholder: 13 },
      { name: 'EPS', coeff: 1, placeholder: 16 }
    ]
  },
  CFEE: {
    title: 'CFEE & Entrée en 6ème (CM2)',
    subtitle: 'Direction des Examens et Concours du Sénégal',
    subjects: [
      { name: 'Arithmétique & Opérations', coeff: 2, placeholder: 15 },
      { name: 'Résolution de Problèmes', coeff: 2, placeholder: 14 },
      { name: 'Texte Suivi de Questions', coeff: 2, placeholder: 13 },
      { name: 'Contrôle des Connaissances (Éveil/Sciences)', coeff: 1, placeholder: 14 },
      { name: 'Histoire - Géographie du Sénégal', coeff: 1, placeholder: 15 }
    ]
  }
};

interface GradeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeSimulatorModal: React.FC<GradeSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<ExamProfile>('BAC_S2');
  const [grades, setGrades] = useState<Record<string, number>>({});

  const currentConfig = EXAM_CONFIGS[profile];

  const handleGradeChange = (subjectName: string, val: string) => {
    const num = parseFloat(val);
    setGrades((prev) => ({
      ...prev,
      [subjectName]: isNaN(num) ? 0 : Math.min(20, Math.max(0, num))
    }));
  };

  const handleFillRealistic = () => {
    const realistic: Record<string, number> = {};
    currentConfig.subjects.forEach((s) => {
      realistic[s.name] = s.placeholder || 12;
    });
    setGrades(realistic);
  };

  const handleReset = () => {
    setGrades({});
  };

  // Calculation
  const stats = useMemo(() => {
    let totalPoints = 0;
    let totalCoeffs = 0;

    currentConfig.subjects.forEach((sub) => {
      const g = grades[sub.name] !== undefined ? grades[sub.name] : 10;
      totalPoints += g * sub.coeff;
      totalCoeffs += sub.coeff;
    });

    const average = totalCoeffs > 0 ? totalPoints / totalCoeffs : 0;

    let verdict = '';
    let verdictColor = '';
    let mention = '';

    if (average >= 16) {
      verdict = "Admis d'office au 1er Tour 🥇";
      mention = 'Mention TRÈS BIEN';
      verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    } else if (average >= 14) {
      verdict = "Admis d'office au 1er Tour 🥈";
      mention = 'Mention BIEN';
      verdictColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    } else if (average >= 12) {
      verdict = "Admis d'office au 1er Tour 🥉";
      mention = 'Mention ASSEZ BIEN';
      verdictColor = 'text-blue-700 bg-blue-50 border-blue-300';
    } else if (average >= 10) {
      verdict = "Admis d'office au 1er Tour ✅";
      mention = 'Mention PASSABLE';
      verdictColor = 'text-teal-700 bg-teal-50 border-teal-300';
    } else if (average >= 9) {
      verdict = 'Admissible au 2ème Tour (Oral de rattrapage) ⚠️';
      mention = 'Rattrapage requis';
      verdictColor = 'text-amber-800 bg-amber-50 border-amber-300';
    } else {
      verdict = 'Ajourné (Moyenne insuffisante) ❌';
      mention = 'Non admis';
      verdictColor = 'text-rose-700 bg-rose-50 border-rose-300';
    }

    return { totalPoints, totalCoeffs, average, verdict, verdictColor, mention };
  }, [currentConfig, grades]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              📊
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Simulateur de Moyenne & Mention Officiel
              </h3>
              <p className="text-xs text-white/80">
                Coefficients officiels du Sénégal (CFEE • BFEM • BAC S & L 🇸🇳)
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

        {/* Profile Tabs */}
        <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => { setProfile('BAC_S2'); setGrades({}); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profile === 'BAC_S2'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bac S2 (SVT)
          </button>
          <button
            onClick={() => { setProfile('BAC_S1'); setGrades({}); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profile === 'BAC_S1'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bac S1 (Maths)
          </button>
          <button
            onClick={() => { setProfile('BAC_L'); setGrades({}); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profile === 'BAC_L'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bac L (L1/L2)
          </button>
          <button
            onClick={() => { setProfile('BFEM'); setGrades({}); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profile === 'BFEM'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            BFEM (3ème)
          </button>
          <button
            onClick={() => { setProfile('CFEE'); setGrades({}); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              profile === 'CFEE'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            CFEE (CM2)
          </button>
        </div>

        {/* Simulator Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Saisissez vos notes sur 20 pour chaque matière :
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleFillRealistic}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Exemple type
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Vider
              </button>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {currentConfig.subjects.map((sub) => {
              const val = grades[sub.name] !== undefined ? grades[sub.name] : '';
              return (
                <div
                  key={sub.name}
                  className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 block truncate">
                      {sub.name}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      Coeff. {sub.coeff}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.25"
                      value={val}
                      placeholder="10"
                      onChange={(e) => handleGradeChange(sub.name, e.target.value)}
                      className="w-16 sm:w-20 px-2.5 py-1.5 text-center bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    />
                    <span className="text-xs text-slate-400 font-medium">/ 20</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Card */}
          <div className={`p-5 rounded-2xl border-2 transition-all shadow-sm ${stats.verdictColor}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Résultat Délibération Prévisionnelle
                </span>
                <h4 className="text-base sm:text-lg font-black mt-0.5">
                  {stats.verdict}
                </h4>
                <p className="text-xs font-medium mt-1">
                  Mention : <strong>{stats.mention}</strong> • Total : {stats.totalPoints.toFixed(1)} / {stats.totalCoeffs * 20} points
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-current/20 sm:pl-5 shrink-0">
                <span className="text-xs font-bold opacity-80 block">Moyenne Générale</span>
                <span className="text-3xl font-black">
                  {stats.average.toFixed(2)}
                  <span className="text-sm font-normal opacity-80"> / 20</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
