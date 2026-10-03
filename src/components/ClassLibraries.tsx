import React from 'react';
import { BIBLIOTHEQUES_PAR_NIVEAU } from '../data/curriculumData';
import { SchoolLevel, ViewMode, UserAuth } from '../types';
import { BookOpen, Folder, LayoutGrid, Upload, ArrowRight, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface ClassLibrariesProps {
  currentView: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onSelectClass: (levelCode: SchoolLevel) => void;
  onOpenUploadForClass: (levelCode: SchoolLevel) => void;
  auth: UserAuth;
  docCountsByLevel: Record<string, number>;
}

export const ClassLibraries: React.FC<ClassLibrariesProps> = ({
  currentView,
  onViewChange,
  onSelectClass,
  onOpenUploadForClass,
  auth,
  docCountsByLevel
}) => {
  const levels = Object.values(BIBLIOTHEQUES_PAR_NIVEAU);

  return (
    <section className="mt-8 mb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              🎓 Bibliothèques de Classe
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300">
              Programme Officiel 🇸🇳
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sélectionnez une classe pour explorer ses fascicules, cours et annales d'examens
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => onViewChange('tablet')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentView === 'tablet'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Vue Tablettes
          </button>
          <button
            onClick={() => onViewChange('folder')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currentView === 'folder'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Vue Dossiers
          </button>
        </div>
      </div>

      {/* Grid of Class Libraries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {levels.map((item) => {
          const docCount = docCountsByLevel[item.code] || 0;

          if (currentView === 'tablet') {
            return (
              <div
                key={item.code}
                onClick={() => onSelectClass(item.code)}
                style={{
                  background: `linear-gradient(135deg, ${item.color} 0%, #1e1b4b 160%)`
                }}
                className="group relative rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[200px]"
              >
                {/* Subtle pattern background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Top header */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold tracking-tight">{item.name.split(' - ')[0]}</span>
                      {item.exam && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950 shadow-xs">
                          {item.exam}
                        </span>
                      )}
                      {!auth.isStudent && !auth.isAdmin && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 text-white backdrop-blur-xs flex items-center gap-1 border border-white/30">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Code</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/80 mt-1 line-clamp-1">
                      {item.name.split(' - ')[1] || item.cycle}
                    </p>
                  </div>
                  <div className="text-3xl p-2 bg-white/15 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>

                {/* Middle description */}
                <div className="relative z-10 my-3">
                  <p className="text-xs text-white/85 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom stats and button */}
                <div className="relative z-10 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold text-white/90">
                      📚 {docCount} document{docCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-white/80">
                      {item.matieres.length} matières
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClass(item.code);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white text-slate-900 hover:bg-white/90 transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      {!auth.isStudent && !auth.isAdmin ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Code requis</span>
                        </>
                      ) : (
                        <>
                          <span>Ouvrir</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {auth.isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenUploadForClass(item.code);
                        }}
                        className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all flex items-center gap-1 cursor-pointer"
                        title={`Importer des documents pour la ${item.code}`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Folder View
          return (
            <div
              key={item.code}
              onClick={() => onSelectClass(item.code)}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                style={{ backgroundColor: item.color }}
              />

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {item.name}
                      </h3>
                      {!auth.isStudent && !auth.isAdmin && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Code</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.cycle}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* Subject Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.matieres.slice(0, 3).map((mat) => (
                    <span
                      key={mat}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {mat}
                    </span>
                  ))}
                  {item.matieres.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      +{item.matieres.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {docCount} document{docCount !== 1 ? 's' : ''}
                </span>

                <div className="flex items-center gap-1">
                  {auth.isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenUploadForClass(item.code);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Ajouter des documents"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!auth.isStudent && !auth.isAdmin ? (
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Code requis</span>
                    </span>
                  ) : (
                    <span className="p-1.5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
