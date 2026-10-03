import React, { useState, useMemo } from 'react';
import { EducationalDocument, SchoolLevel, SubjectCategory, UserAuth } from '../types';
import { BIBLIOTHEQUES_PAR_NIVEAU } from '../data/curriculumData';
import { 
  BarChart3, 
  BookOpen, 
  Upload, 
  Trash2, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  FileText, 
  TrendingUp, 
  Database, 
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  AlertTriangle,
  GitMerge,
  Copy
} from 'lucide-react';

interface AdminDashboardProps {
  documents: EducationalDocument[];
  onOpenUploadForClass: (levelCode?: SchoolLevel) => void;
  onOpenViewer: (doc: EducationalDocument) => void;
  onDownload: (doc: EducationalDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onEditDocument?: (doc: EducationalDocument) => void;
  onMergeDocuments?: (targetDocId: string, sourceDocIds: string[]) => void;
  onUpdateDocument?: (doc: EducationalDocument) => void;
  onBackToCatalog: () => void;
  auth: UserAuth;
  onRequireAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  documents,
  onOpenUploadForClass,
  onOpenViewer,
  onDownload,
  onDeleteDocument,
  onEditDocument,
  onMergeDocuments,
  onUpdateDocument,
  onBackToCatalog,
  auth,
  onRequireAuth
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'all' | 'imported' | 'official'>('all');
  const [isDuplicateSectionOpen, setIsDuplicateSectionOpen] = useState(true);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const importedDocs = documents.filter((d) => d.isLocal).length;
    const officialDocs = totalDocs - importedDocs;

    // By level
    const byLevel: Record<string, number> = {};
    Object.keys(BIBLIOTHEQUES_PAR_NIVEAU).forEach((code) => {
      byLevel[code] = 0;
    });
    documents.forEach((d) => {
      byLevel[d.level] = (byLevel[d.level] || 0) + 1;
    });

    // By cycle
    let primaireCount = 0;
    let collegeCount = 0;
    let lyceeCount = 0;

    documents.forEach((d) => {
      const lvl = d.level;
      if (['CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'].includes(lvl)) {
        primaireCount++;
      } else if (['6e', '5e', '4e', '3e'].includes(lvl)) {
        collegeCount++;
      } else {
        lyceeCount++;
      }
    });

    // By category
    const byCategory: Record<string, number> = {};
    documents.forEach((d) => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    });

    // Classes with at least 1 document
    const coveredClasses = Object.values(byLevel).filter((c) => c > 0).length;

    return {
      totalDocs,
      importedDocs,
      officialDocs,
      primaireCount,
      collegeCount,
      lyceeCount,
      byLevel,
      byCategory,
      coveredClasses
    };
  }, [documents]);

  // Intelligent Duplicate Detection Algorithm
  const duplicateGroups = useMemo(() => {
    // 1. Group by exact ID if any
    const idMap: Record<string, EducationalDocument[]> = {};
    documents.forEach((d) => {
      if (!idMap[d.id]) idMap[d.id] = [];
      idMap[d.id].push(d);
    });

    // 2. Group by normalized title & category
    const titleCatMap: Record<string, EducationalDocument[]> = {};
    documents.forEach((d) => {
      const cleanTitle = d.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');
      const key = `${cleanTitle}__${d.category.toLowerCase()}`;
      if (!titleCatMap[key]) titleCatMap[key] = [];
      titleCatMap[key].push(d);
    });

    const groups: {
      id: string;
      title: string;
      category: string;
      reason: string;
      primaryDoc: EducationalDocument;
      duplicateDocs: EducationalDocument[];
      allDocs: EducationalDocument[];
    }[] = [];

    const recordedPairs = new Set<string>();

    // Exact ID duplicates
    Object.entries(idMap).forEach(([id, docs]) => {
      if (docs.length > 1) {
        groups.push({
          id: `id_${id}`,
          title: docs[0].title,
          category: docs[0].category,
          reason: `Identifiant identique (${id})`,
          primaryDoc: docs[0],
          duplicateDocs: docs.slice(1),
          allDocs: docs
        });
        docs.forEach((d) => recordedPairs.add(d.id));
      }
    });

    // Title & category duplicates
    Object.entries(titleCatMap).forEach(([key, docs]) => {
      if (docs.length > 1) {
        const uniqueDocs = docs.filter(
          (d, idx, arr) => arr.findIndex((x) => x.id === d.id) === idx
        );
        if (uniqueDocs.length > 1) {
          // Select best primary: official document first, or with rich content
          const sorted = [...uniqueDocs].sort((a, b) => {
            if (!a.isLocal && b.isLocal) return -1;
            if (a.isLocal && !b.isLocal) return 1;
            return (b.content?.length || 0) - (a.content?.length || 0);
          });
          const pairKey = sorted.map((d) => d.id).sort().join('_');
          if (!recordedPairs.has(pairKey)) {
            recordedPairs.add(pairKey);
            groups.push({
              id: `title_${key}`,
              title: sorted[0].title,
              category: sorted[0].category,
              reason: `Même titre et discipline (« ${sorted[0].title} »)`,
              primaryDoc: sorted[0],
              duplicateDocs: sorted.slice(1),
              allDocs: sorted
            });
          }
        }
      }
    });

    return groups;
  }, [documents]);

  const handleMergeGroup = (primaryDoc: EducationalDocument, duplicateDocs: EducationalDocument[]) => {
    if (onMergeDocuments) {
      onMergeDocuments(primaryDoc.id, duplicateDocs.map((d) => d.id));
    }
  };

  const handleAutoMergeAll = () => {
    if (!onMergeDocuments) return;
    if (duplicateGroups.length === 0) return;

    if (window.confirm(`Voulez-vous fusionner automatiquement les ${duplicateGroups.length} groupes de doublons ? Les classes cibles seront combinées dans chaque document unique.`)) {
      duplicateGroups.forEach((grp) => {
        onMergeDocuments(grp.primaryDoc.id, grp.duplicateDocs.map((d) => d.id));
      });
      setScanMessage('Tous les doublons ont été fusionnés avec succès !');
      setTimeout(() => setScanMessage(null), 4000);
    }
  };

  // Filtered documents table
  const filteredTableDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return documents.filter((doc) => {
      if (selectedSourceFilter === 'imported' && !doc.isLocal) return false;
      if (selectedSourceFilter === 'official' && doc.isLocal) return false;
      if (selectedLevelFilter !== 'all' && doc.level !== selectedLevelFilter) return false;
      if (selectedCategoryFilter !== 'all' && doc.category !== selectedCategoryFilter) return false;

      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.author.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.level.toLowerCase().includes(q) ||
        (doc.description && doc.description.toLowerCase().includes(q))
      );
    });
  }, [documents, searchQuery, selectedLevelFilter, selectedCategoryFilter, selectedSourceFilter]);

  // Export inventory JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `book_education_senegal_inventaire_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!auth.isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
          🔒
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Espace Administrateur Réservé
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Vous devez être connecté avec le code d'administration pour accéder au tableau de bord des statistiques et de gestion.
        </p>
        <button
          onClick={onRequireAuth}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
        >
          Connexion Administrateur
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 sm:py-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tableau de Bord Administrateur • Vue Complète</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Gestion de la Bibliothèque Nationale
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Supervisez les 19 niveaux scolaires, suivez les documents importés et enrichissez les bibliothèques de cours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenUploadForClass()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>+ Importer Fichiers & Dossiers</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="Télécharger une copie de sauvegarde JSON de tout le catalogue"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Inventaire</span>
            </button>

            <button
              onClick={onBackToCatalog}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              Voir Catalogue Public
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Ressources</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.totalDocs}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.officialDocs} officielles • {stats.importedDocs} importées
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Classes Couvertes</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {stats.coveredClasses} / 19
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Du CI au Baccalauréat
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Documents Locaux</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {stats.importedDocs}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Persistants dans IndexedDB
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Assistance WhatsApp</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              💬
            </span>
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
            70 565 72 77
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            Support administrateur actif
          </div>
        </div>
      </div>

      {/* Cycle Progress & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* By Cycle breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Répartition par Cycle Scolaire</span>
          </h3>

          <div className="space-y-3">
            {/* Primaire */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>🌱 Élémentaire (CI à CM2 - CFEE)</span>
                <span>{stats.primaireCount} docs</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.primaireCount / Math.max(1, stats.totalDocs)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Collège */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>📘 Moyen (6e à 3e - BFEM)</span>
                <span>{stats.collegeCount} docs</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.collegeCount / Math.max(1, stats.totalDocs)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Lycée */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>🎓 Secondaire (2nde à Tle - BAC)</span>
                <span>{stats.lyceeCount} docs</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.lyceeCount / Math.max(1, stats.totalDocs)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* By Subject (Matières) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Répartition par Matière Principale</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <div
                key={cat}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{cat}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {((count / Math.max(1, stats.totalDocs)) * 100).toFixed(0)}% du total
                  </div>
                </div>
                <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-xs font-black text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Matrix Quick Importer Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Bibliothèques par Classe (19 Niveaux)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cliquez sur « + Importer » pour alimenter directement une classe en fascicules ou épreuves.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((lib) => {
            const count = stats.byLevel[lib.code] || 0;
            return (
              <div
                key={lib.code}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {lib.code}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      {count}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-2">
                    {lib.name.split(' - ')[1] || lib.cycle}
                  </div>
                </div>

                <button
                  onClick={() => onOpenUploadForClass(lib.code)}
                  className="w-full py-1.5 px-2 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title={`Importer un document pour la classe de ${lib.code}`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Importer</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan Alert Notification */}
      {scanMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{scanMessage}</span>
          </div>
          <button
            onClick={() => setScanMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Duplicate Detection & Auto-Merge Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-850 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
              duplicateGroups.length > 0
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {duplicateGroups.length > 0 ? '⚠️' : '🛡️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Détection des Doublons & Fusion Intelligente
                </h3>
                {duplicateGroups.length > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white animate-pulse">
                    {duplicateGroups.length} Conflit{duplicateGroups.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Base 100% Saine
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {duplicateGroups.length > 0
                  ? "Des documents similaires ont été détectés. Fusionnez leurs classes en un document unique ou mettez à jour l'existant."
                  : "Aucun document en double ou conflit d'identifiant détecté dans votre base de données."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {duplicateGroups.length > 0 && onMergeDocuments && (
              <button
                onClick={handleAutoMergeAll}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Fusionner automatiquement tous les doublons en combinant leurs classes"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Tout fusionner ({duplicateGroups.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                setScanMessage(`Scan d'intégrité terminé : ${duplicateGroups.length} doublon(s) identifié(s) sur ${documents.length} documents.`);
                setTimeout(() => setScanMessage(null), 4000);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              title="Rescanner la base"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Duplicate Groups List */}
        {duplicateGroups.length > 0 && (
          <div className="p-4 sm:p-6 space-y-4 bg-amber-50/20 dark:bg-slate-900/40">
            {duplicateGroups.map((grp) => (
              <div
                key={grp.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-200/80 dark:border-amber-900/60 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                      ⚠️ Conflit détecté
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {grp.reason}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMergeGroup(grp.primaryDoc, grp.duplicateDocs)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Combiner les classes dans le document principal et supprimer la copie en double"
                    >
                      <GitMerge className="w-3 h-3" />
                      <span>Fusionner les classes</span>
                    </button>
                  </div>
                </div>

                {/* Items in Conflict */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Primary Doc */}
                  <div className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-300/50 dark:border-emerald-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[10px] uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        Document Principal (À Conserver)
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {grp.primaryDoc.isLocal ? '📁 Importé' : '✅ Officiel'}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {grp.primaryDoc.title}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Classe : <strong>{grp.primaryDoc.level}</strong></span>
                      {grp.primaryDoc.additionalLevels && grp.primaryDoc.additionalLevels.length > 0 && (
                        <span>(+{grp.primaryDoc.additionalLevels.join(', ')})</span>
                      )}
                      <span>•</span>
                      <span>{grp.primaryDoc.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => onOpenViewer(grp.primaryDoc)}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold text-[10px] hover:text-indigo-600 cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Lire</span>
                      </button>
                      {onEditDocument && (
                        <button
                          onClick={() => onEditDocument(grp.primaryDoc)}
                          className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold text-[10px] hover:text-amber-600 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conflict / Duplicate Docs */}
                  {grp.duplicateDocs.map((dup) => (
                    <div
                      key={dup.id}
                      className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-300/50 dark:border-rose-800/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[10px] uppercase text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                          Doublon / Conflit ({dup.level})
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {dup.isLocal ? '📁 Importé' : '✅ Officiel'}
                        </span>
                      </div>

                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {dup.title}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span>Classe : <strong>{dup.level}</strong></span>
                        <span>•</span>
                        <span>{dup.category}</span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleMergeGroup(grp.primaryDoc, [dup])}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800 cursor-pointer flex items-center gap-1"
                          title={`Fusionner la classe ${dup.level} dans le document principal`}
                        >
                          <GitMerge className="w-3 h-3" />
                          <span>Fusionner vers {grp.primaryDoc.level}</span>
                        </button>

                        <button
                          onClick={() => onDeleteDocument(dup.id)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-800 cursor-pointer flex items-center gap-1"
                          title="Supprimer définitivement ce doublon"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Inventaire Général des Documents ({filteredTableDocs.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consultez, téléchargez ou supprimez n'importe quelle ressource pédagogique
              </p>
            </div>
          </div>

          {/* Table Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, auteur..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Source Filter */}
            <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
            >
              <option value="all">Toutes les sources</option>
              <option value="imported">Importés uniquement (Locaux)</option>
              <option value="official">Fiches officielles intégrées</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-semibold cursor-pointer"
            >
              <option value="all">Toutes les classes</option>
              {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Titre du Document</th>
                <th className="py-3 px-4">Classe</th>
                <th className="py-3 px-4">Matière</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTableDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Aucun document ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredTableDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs sm:max-w-md">
                        {doc.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {doc.author} • {doc.pages} pages
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {doc.level}
                        </span>
                        {doc.additionalLevels && doc.additionalLevels.map((extraLvl) => (
                          <span
                            key={extraLvl}
                            className="px-1.5 py-0.2 rounded-md font-semibold text-[9px] bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            title={`Partagé aussi avec la classe de ${extraLvl}`}
                          >
                            +{extraLvl}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {doc.category}
                    </td>

                    <td className="py-3 px-4 uppercase font-bold text-[10px] text-slate-500 dark:text-slate-400">
                      {doc.fileType}
                    </td>

                    <td className="py-3 px-4">
                      {doc.isLocal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                          <span>📁</span>
                          <span>Importé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <span>✅</span>
                          <span>Officiel</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onOpenViewer(doc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Consulter et lire"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {onEditDocument && (
                          <button
                            onClick={() => onEditDocument(doc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Modifier ce document (titre, classes partagées, suppression)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onDownload(doc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Télécharger le fichier"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title="Supprimer ce document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
