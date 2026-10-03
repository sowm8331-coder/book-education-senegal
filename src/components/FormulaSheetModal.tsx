import React, { useState } from 'react';
import { X, Search, Bookmark, Copy, Check } from 'lucide-react';

interface FormulaItem {
  category: 'Mathématiques' | 'Sciences Physiques' | 'SVT';
  level: string;
  title: string;
  formula: string;
  description: string;
}

const FORMULAS_DATA: FormulaItem[] = [
  {
    category: 'Mathématiques',
    level: 'Terminale S',
    title: 'Dérivée d\'un quotient et de fonctions composées',
    formula: '(u/v)\' = (u\'v - uv\') / v²\n(e^u)\' = u\' × e^u\n[ln(u)]\' = u\' / u',
    description: 'Règles fondamentales de dérivation pour l\'étude des fonctions au Bac S.'
  },
  {
    category: 'Mathématiques',
    level: 'Terminale S',
    title: 'Croissances comparées (Limites usuelles)',
    formula: 'lim (x->+∞) [ln(x) / x^n] = 0\nlim (x->0+) [x^n × ln(x)] = 0\nlim (x->+∞) [e^x / x^n] = +∞\nlim (x->-∞) [x^n × e^x] = 0',
    description: 'Incontournable pour lever les formes indéterminées en analyse.'
  },
  {
    category: 'Mathématiques',
    level: 'Terminale S',
    title: 'Nombres Complexes : Module, Argument & Forme Trigonométrique',
    formula: 'z = a + ib = r × (cos θ + i sin θ) = r × e^(iθ)\n|z| = √(a² + b²)\nz × z̄ = |z|² = a² + b²',
    description: 'Résolution des équations dans ℂ et transformations géométriques (rotations, homothéties).'
  },
  {
    category: 'Mathématiques',
    level: '3ème (BFEM)',
    title: 'Théorème de Pythagore & Réciproque',
    formula: 'Si ABC est rectangle en A :\nBC² = AB² + AC²\nRéciproque : Si BC² = AB² + AC², alors ABC est rectangle en A.',
    description: 'Calcul de longueurs et démonstration de l\'orthogonalité.'
  },
  {
    category: 'Mathématiques',
    level: '3ème (BFEM)',
    title: 'Théorème de Thalès & Rapports de proportionnalité',
    formula: 'Si (MN) // (BC) :\nAM / AB = AN / AC = MN / BC',
    description: 'Calcul de longueurs et réduction/agrandissement dans le triangle.'
  },
  {
    category: 'Sciences Physiques',
    level: 'Terminale S',
    title: 'Deuxième Loi de Newton (Principe fondamental de la dynamique)',
    formula: '∑ F_ext = m × a_G\nDans un champ de pesanteur uniforme (chute libre) : a_G = g',
    description: 'Mouvement des projectiles, satellites et oscillateurs mécaniques.'
  },
  {
    category: 'Sciences Physiques',
    level: 'Terminale S',
    title: 'Énergie Cinétique & Théorème de l\'Énergie Cinétique',
    formula: 'E_c = 1/2 × m × v²\nΔE_c = E_c(B) - E_c(A) = ∑ W_AB(F_ext)',
    description: 'Conservation et transferts d\'énergie mécanique.'
  },
  {
    category: 'Sciences Physiques',
    level: 'Terminale S',
    title: 'Réactions Acide-Base & Calcul de pH',
    formula: 'pH = -log[H₃O⁺]\n[H₃O⁺] = 10^(-pH)\nProduit ionique de l\'eau à 25°C : Ke = [H₃O⁺] × [HO⁻] = 10^(-14)\npH = pKa + log([Base] / [Acide])',
    description: 'Dosages pH-métriques et solutions tampons.'
  },
  {
    category: 'SVT',
    level: '2nde & 1ère S',
    title: 'La Photosynthèse & Équation Bilan',
    formula: '6 CO₂ + 6 H₂O + Lumière ➔ C₆H₁₂O₆ (Glucose) + 6 O₂',
    description: 'Production de matière organique et libération de dioxygène par les végétaux chlorophylliens.'
  }
];

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<string>('Tous');
  const [search, setSearch] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = FORMULAS_DATA.filter((item) => {
    const matchCat = selectedCat === 'Tous' || item.category === selectedCat;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.formula.toLowerCase().includes(search.toLowerCase()) ||
      item.level.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              📐
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Formulaire Officiel des Formules & Théorèmes
              </h3>
              <p className="text-xs text-white/80">
                Aide-mémoire de Mathématiques, Sciences Physiques et SVT 🇸🇳
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

        {/* Filter bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
          <div className="flex gap-1.5 overflow-x-auto">
            {['Tous', 'Mathématiques', 'Sciences Physiques', 'SVT'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une formule..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Formulas list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Aucune formule trouvée pour cette recherche.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.level}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopy(idx, item.formula)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copier la formule"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Formula display block */}
                <div className="my-2.5 p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm whitespace-pre-line leading-relaxed selection:bg-emerald-500 selection:text-white">
                  {item.formula}
                </div>

                <p className="text-xs text-slate-600">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
