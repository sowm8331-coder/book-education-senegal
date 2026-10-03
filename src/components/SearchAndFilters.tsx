import React from 'react';
import { Search, X, Star, Filter, Sparkles, BookOpen } from 'lucide-react';
import { SchoolLevel } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilter: string;
  onSelectFilter: (f: string) => void;
  favoritesCount: number;
  showingFavorites: boolean;
  onToggleFavorites: () => void;
  totalFilteredDocs: number;
  totalAllDocs: number;
}

const LEVEL_BUTTONS: { label: string; value: string; badge?: string }[] = [
  { label: 'Tous', value: 'all' },
  { label: '⭐ Mieux Notés', value: 'top-rated', badge: '★ Avis' },
  { label: '🏆 Sujets CFEE', value: 'CFEE', badge: '2024' },
  { label: '🏆 Sujets BFEM', value: 'BFEM', badge: '2024' },
  { label: '🏆 Sujets BAC', value: 'BAC', badge: '2024' },
  { label: 'CI', value: 'CI', badge: 'Primaire' },
  { label: 'CP', value: 'CP' },
  { label: 'CE1', value: 'CE1' },
  { label: 'CE2', value: 'CE2' },
  { label: 'CM1', value: 'CM1' },
  { label: 'CM2 (CFEE)', value: 'CM2', badge: 'CFEE' },
  { label: '6ème', value: '6e', badge: 'Collège' },
  { label: '5ème', value: '5e' },
  { label: '4ème', value: '4e' },
  { label: '3ème (BFEM)', value: '3e', badge: 'BFEM' },
  { label: 'Seconde', value: '2nde', badge: 'Lycée' },
  { label: 'Seconde S', value: '2nde-S' },
  { label: 'Seconde L', value: '2nde-L' },
  { label: 'Première', value: '1ere' },
  { label: 'Première S', value: '1ere-S' },
  { label: 'Première L', value: '1ere-L' },
  { label: 'Terminale', value: 'Terminale', badge: 'Bac' },
  { label: 'Terminale S', value: 'Terminale-S', badge: 'Bac S' },
  { label: 'Terminale L', value: 'Terminale-L', badge: 'Bac L' },
  { label: '📐 Mathématiques', value: 'Mathématiques' },
  { label: '📖 Français', value: 'Français' },
  { label: '🔬 Sciences & Physique', value: 'Sciences' },
  { label: '🌍 Histoire-Géo', value: 'Histoire-Géo' },
  { label: '🤔 Philosophie', value: 'Philosophie' },
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  favoritesCount,
  showingFavorites,
  onToggleFavorites,
  totalFilteredDocs,
  totalAllDocs
}) => {
  return (
    <div className="space-y-4">
      {/* Search Bar & Document Count */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Rechercher : titre, chapitre, niveau (ex: Bac S, BFEM, Thalès, Lat-Dior)..."
            className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavorites}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer shadow-xs active:scale-95 ${
              showingFavorites
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 hover:border-amber-200 dark:hover:border-amber-800'
            }`}
          >
            <Star className={`w-4 h-4 ${showingFavorites ? 'fill-current' : 'text-amber-500'}`} />
            <span>Favoris</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              showingFavorites ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {favoritesCount}
            </span>
          </button>

          {/* Document count badge */}
          <div className="px-3.5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap shadow-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalFilteredDocs}</span> / {totalAllDocs} documents
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          {LEVEL_BUTTONS.map((btn) => {
            const isActive = !showingFavorites && activeFilter === btn.value;
            return (
              <button
                key={btn.value}
                onClick={() => onSelectFilter(btn.value)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>{btn.label}</span>
                {btn.badge && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {btn.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
