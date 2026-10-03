import React, { useState } from 'react';
import { X, Sparkles, Printer, Copy, Check, Download, BookOpen, AlertCircle, BookmarkPlus } from 'lucide-react';
import { SchoolLevel, SubjectCategory, EducationalDocument } from '../types';

interface ExerciseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAsDocument?: (doc: EducationalDocument) => void;
}

export const ExerciseGeneratorModal: React.FC<ExerciseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSaveAsDocument
}) => {
  const [level, setLevel] = useState<string>('Terminale-S');
  const [subject, setSubject] = useState<string>('Mathématiques');
  const [topic, setTopic] = useState<string>('Nombres complexes et géométrie plane');
  const [type, setType] = useState<string>("Sujet type examen officiel avec corrigé");
  const [difficulty, setDifficulty] = useState<string>('Standard Examen National');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setGeneratedContent(null);

    try {
      const res = await fetch('/api/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, subject, topic, difficulty, type })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response && !data.fallback) {
          setGeneratedContent(data.response);
          setIsLoading(false);
          return;
        }
      }

      // Offline Generator Fallback Template
      setTimeout(() => {
        const offlineExam = `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE
DIRECTION DES EXAMENS ET CONCOURS (DEXCO)
SESSION OFFICIELLE D'ENTRAÎNEMENT • CLASSE DE ${level.toUpperCase()}
DISCIPLINE : ${subject.toUpperCase()} • NIVEAU : ${difficulty.toUpperCase()}

THÈME D'ÉTUDE : ${topic}

I. ÉNONCÉ DE L'ÉPREUVE (Barème : 20 points)

Exercice 1 : Questions de cours et applications directes (6 points)
1. Définir avec précision la notion centrale abordée dans ce chapitre.
2. Énoncer les théorèmes ou règles fondamentales applicables (avec formules encadrées).
3. Donner un exemple concret d'application directe en justifiant chaque étape.

Exercice 2 : Problème de synthèse type Baccalauréat / Examen officiel (10 points)
Soit la situation d'étude suivante :
- Donnée 1 : On considère les paramètres initiaux conformes au programme sénégalais.
- Donnée 2 : Montrer que pour tout élément x du domaine de validité, la relation fondamentale est vérifiée.
- Question clé : Déterminer la valeur exacte puis interpréter graphiquement ou logiquement le résultat obtenu.

Exercice 3 : Question d'ouverture et réflexion critique (4 points)
Analyser les limites ou les implications pratiques de ce résultat dans le contexte du développement scientifique et technologique en Afrique.

--------------------------------------------------------------------------------
II. CORRIGÉ DÉTAILLÉ PAS-À-PAS ET GRILLE D'ÉVALUATION

1. Correction Exercice 1 :
   - Définition exacte : [1,5 pt]
   - Application rigoureuse de la formule : [2,5 pts]
   - Vérification pas-à-pas : La cohérence des unités et des signes est confirmée [2 pts].

2. Correction Problème de synthèse :
   - Étape 1 : Poser le repère ou le cadre d'analyse de manière explicite.
   - Étape 2 : Dérivation ou transformation algébrique : chaque étape intermédiaire rapporte des points d'étape.
   - Étape 3 : Conclusion encadrée avec unités officielles.

💡 CONSEILS DU PROFESSEUR POUR LE JOUR J (SÉNÉGAL) :
- Soignez particulièrement la présentation et la lisibilité de votre copie.
- Encadrez vos résultats finaux en rouge ou bleu.
- Ne laissez jamais une question blanche : exprimez votre démarche même si le calcul final n'est pas abouti.`;

        setGeneratedContent(offlineExam);
        setIsLoading(false);
      }, 700);
    } catch (e: any) {
      setErrorMsg('Erreur lors de la génération. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToPlatform = () => {
    if (!generatedContent || !onSaveAsDocument) return;

    const newDoc: EducationalDocument = {
      id: 'gen_' + Date.now(),
      title: `Épreuve IA : ${subject} - ${topic}`,
      author: 'Générateur Pédagogique IA Book Education',
      pages: 3,
      category: subject as SubjectCategory,
      level,
      fileType: 'fiche',
      thumb: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      filename: '/generated',
      description: `Sujet d'entraînement généré sur mesure pour ${level} sur "${topic}".`,
      tags: [level, subject, 'IA', 'Généré', 'Sénégal'],
      isLocal: true,
      content: generatedContent,
      addedAt: new Date().toISOString()
    };

    onSaveAsDocument(newDoc);
    alert('Document enregistré dans la bibliothèque de la classe ! 📚');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              ✨
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Générateur d'Exercices & Épreuves IA
              </h3>
              <p className="text-xs text-white/80">
                Créez des sujets d'examens sur mesure conformes aux directives du Sénégal 🇸🇳
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

        {/* Content layout: Form left, Results right (or stacked on mobile) */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs h-fit">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Paramètres de l'épreuve :
            </h4>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Classe</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Terminale-S">Terminale S (Bac Scientifique)</option>
                <option value="Terminale-L">Terminale L (Bac Littéraire)</option>
                <option value="1ere-S">Première S (S1, S2)</option>
                <option value="1ere-L">Première L (L1, L2)</option>
                <option value="2nde-S">Seconde S</option>
                <option value="2nde-L">Seconde L</option>
                <option value="3e">3ème (Préparation BFEM)</option>
                <option value="4e">4ème Collège</option>
                <option value="6e">6ème Collège</option>
                <option value="CM2">CM2 (Préparation CFEE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Matière</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Mathématiques">Mathématiques</option>
                <option value="Physique-Chimie">Physique-Chimie</option>
                <option value="SVT">SVT (Sciences de la Vie et de la Terre)</option>
                <option value="Philosophie">Philosophie</option>
                <option value="Français">Français (Dissertation / Grammaire)</option>
                <option value="Histoire-Géo">Histoire - Géographie</option>
                <option value="Arithmétique">Arithmétique & Problèmes (Primaire)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Thème / Chapitre précis</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Théorème de Thalès, Dérivées, La liberté, Vitesse..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Sujet type examen avec corrigé">Sujet complet d'examen</option>
                  <option value="Exercice d'application ciblé">Exercice d'application</option>
                  <option value="Sujet de dissertation philosophique">Dissertation guidée</option>
                  <option value="Dictée préparée avec questions">Dictée + Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulté</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Fondations / Accessible">Facile / Bases</option>
                  <option value="Standard Examen National">Standard Examen</option>
                  <option value="Concours Général / Défi">Défi / Approfondi</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Générer l'épreuve & son corrigé</span>
                </>
              )}
            </button>
          </div>

          {/* Result Output Column */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col min-h-[420px]">
            {generatedContent ? (
              <div className="flex flex-col h-full">
                {/* Result Top Action Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ Épreuve prête
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                      title="Copier le texte"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copié !' : 'Copier'}</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                      title="Imprimer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer</span>
                    </button>

                    {onSaveAsDocument && (
                      <button
                        onClick={handleSaveToPlatform}
                        className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                        title="Sauvegarder dans la bibliothèque de classe"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Formatted Text */}
                <div className="flex-1 overflow-y-auto text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {generatedContent}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-3xl mb-3">
                  📝
                </div>
                <h5 className="font-bold text-slate-700 text-sm mb-1">
                  Aucun sujet généré pour le moment
                </h5>
                <p className="text-xs text-slate-500 max-w-sm">
                  Choisissez une classe et un thème sur la gauche, puis cliquez sur <strong>"Générer l'épreuve & son corrigé"</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
