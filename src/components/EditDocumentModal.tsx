import React, { useState, useEffect } from 'react';
import { EducationalDocument, SchoolLevel, SubjectCategory } from '../types';
import { BIBLIOTHEQUES_PAR_NIVEAU } from '../data/curriculumData';
import { X, Save, Trash2, Layers, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

interface EditDocumentModalProps {
  document: EducationalDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDoc: EducationalDocument) => void;
  onDelete: (docId: string) => void;
  isAdmin?: boolean;
}

const ALL_LEVELS: { code: SchoolLevel; label: string; cycle: string }[] = Object.values(
  BIBLIOTHEQUES_PAR_NIVEAU
).map((b) => ({
  code: b.code,
  label: b.name,
  cycle: b.cycle
}));

const CATEGORIES: SubjectCategory[] = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT',
  'Français',
  'Philosophie',
  'Histoire-Géo',
  'Anglais',
  'Sciences',
  'Éveil',
  'Général'
];

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isAdmin = false
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<SubjectCategory>('Mathématiques');
  const [primaryLevel, setPrimaryLevel] = useState<SchoolLevel>('Terminale-S');
  const [additionalLevels, setAdditionalLevels] = useState<SchoolLevel[]>([]);
  const [pages, setPages] = useState<number | string>(1);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setAuthor(doc.author);
      setCategory(doc.category);
      setPrimaryLevel(doc.level as SchoolLevel);
      setAdditionalLevels((doc.additionalLevels as SchoolLevel[]) || []);
      setPages(doc.pages);
      setDescription(doc.description || '');
      setTagsInput(doc.tags ? doc.tags.join(', ') : '');
      setContent(doc.content || '');
      setErrorMsg(null);
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const toggleAdditionalLevel = (lvl: SchoolLevel) => {
    if (lvl === primaryLevel) return; // Cannot be additional if it's primary
    setAdditionalLevels((prev) =>
      prev.includes(lvl) ? prev.filter((item) => item !== lvl) : [...prev, lvl]
    );
  };

  // Quick Presets
  const applyPreset = (preset: 'terminales' | 'lycee' | 'college' | 'primaire' | 'clear') => {
    if (preset === 'clear') {
      setAdditionalLevels([]);
      return;
    }

    let levelsToAdd: SchoolLevel[] = [];
    if (preset === 'terminales') {
      levelsToAdd = ['Terminale', 'Terminale-S', 'Terminale-L'];
    } else if (preset === 'lycee') {
      levelsToAdd = ['2nde', '2nde-S', '2nde-L', '1ere', '1ere-S', '1ere-L', 'Terminale', 'Terminale-S', 'Terminale-L'];
    } else if (preset === 'college') {
      levelsToAdd = ['6e', '5e', '4e', '3e'];
    } else if (preset === 'primaire') {
      levelsToAdd = ['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
    }

    // Filter out the primary level
    const finalSet = new Set([...additionalLevels, ...levelsToAdd]);
    finalSet.delete(primaryLevel);
    setAdditionalLevels(Array.from(finalSet));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Le titre du document ne peut pas être vide.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedDoc: EducationalDocument = {
      ...doc,
      title: title.trim(),
      author: author.trim() || 'Enseignant Sénégalais',
      category,
      level: primaryLevel,
      additionalLevels: additionalLevels.filter((lvl) => lvl !== primaryLevel),
      pages: Number(pages) || 1,
      description: description.trim(),
      tags: parsedTags.length > 0 ? parsedTags : doc.tags,
      content: content.trim() ? content.trim() : undefined
    };

    onSave(updatedDoc);
    onClose();
  };

  const handleDelete = () => {
    if (!isAdmin) return;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le document :\n"${doc.title}" ?`)) {
      onDelete(doc.id);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-xl">
              ✏️
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Modifier le Document Pédagogique
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mettre à jour les informations, partager dans plusieurs classes ou supprimer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Titre du document *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Épreuve Officielle Mathématiques 2024"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Auteur ou Source officielle
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: DEXCO, Office du Bac, Inspection..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Matière / Discipline
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubjectCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Class & Multi-Classes Assignment */}
          <div className="p-4 sm:p-5 bg-indigo-50/60 dark:bg-slate-800/60 rounded-2xl border border-indigo-200/80 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Assignation Multi-Classes (Partage inter-classes)</span>
                </h4>
                <p className="text-[11px] text-indigo-800 dark:text-slate-400 mt-0.5">
                  Ce document peut être automatiquement disponible dans une ou plusieurs classes simultanément.
                </p>
              </div>
            </div>

            {/* Primary Level Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Classe Principale :
              </label>
              <select
                value={primaryLevel}
                onChange={(e) => {
                  const newPrimary = e.target.value as SchoolLevel;
                  setPrimaryLevel(newPrimary);
                  setAdditionalLevels((prev) => prev.filter((l) => l !== newPrimary));
                }}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 cursor-pointer"
              >
                {ALL_LEVELS.map((lvl) => (
                  <option key={lvl.code} value={lvl.code}>
                    {lvl.label} ({lvl.cycle})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Presets for Additional Classes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Partager aussi avec d'autres classes :
                </span>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => applyPreset('terminales')}
                    className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-200 cursor-pointer font-bold"
                  >
                    + Toutes Terminales
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('lycee')}
                    className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200 cursor-pointer font-bold"
                  >
                    + Tout Lycée
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('college')}
                    className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 hover:bg-sky-200 cursor-pointer font-bold"
                  >
                    + Tout Collège
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('primaire')}
                    className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 cursor-pointer font-bold"
                  >
                    + Tout Primaire
                  </button>
                  {additionalLevels.length > 0 && (
                    <button
                      type="button"
                      onClick={() => applyPreset('clear')}
                      className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Class Checkboxes Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {ALL_LEVELS.map((lvl) => {
                  const isPrimary = lvl.code === primaryLevel;
                  const isChecked = additionalLevels.includes(lvl.code) || isPrimary;
                  return (
                    <button
                      type="button"
                      key={lvl.code}
                      disabled={isPrimary}
                      onClick={() => toggleAdditionalLevel(lvl.code)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center ${
                        isPrimary
                          ? 'bg-indigo-600 text-white border-indigo-600 opacity-90 shadow-2xs cursor-default'
                          : isChecked
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-400 dark:border-indigo-700 cursor-pointer'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 cursor-pointer'
                      }`}
                    >
                      <span className="truncate w-full">{lvl.code}</span>
                      <span className="text-[9px] font-normal opacity-80 truncate w-full">
                        {isPrimary ? 'Principale' : isChecked ? 'Partagé' : '+ Ajouter'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pages, Tags & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre de pages
              </label>
              <input
                type="number"
                min="1"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mots-clés (séparés par des virgules)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: Bac, Annales 2024, Sujet officiel, Corrigé"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description / Résumé du cours
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Présentation rapide du document..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Optional Rich Text Content */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contenu textuel / Fiche de cours (optionnel)
              </label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Texte complet de la leçon, exercices ou corrigé..."
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Danger Zone: Delete (Strictly Admin Only) */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Zone de suppression (Admin)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supprime définitivement ce document de la bibliothèque
                </div>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer ce document</span>
              </button>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  );
};
