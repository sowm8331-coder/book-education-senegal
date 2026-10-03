import React, { useState, useRef } from 'react';
import { SchoolLevel, SubjectCategory, FileType, EducationalDocument } from '../types';
import { BIBLIOTHEQUES_PAR_NIVEAU } from '../data/curriculumData';
import { saveFileToStorage, saveDocumentToServer } from '../utils/documentStorage';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  Layers,
  Folder,
  FolderUp,
  Sparkles
} from 'lucide-react';

interface FileQueueItem {
  id: string;
  file?: File;
  relativePath?: string; // e.g. "Terminale S/Maths/cours.pdf"
  folderName?: string;   // Root folder name
  title: string;
  category: SubjectCategory;
  level: SchoolLevel;
  author: string;
  pages: number;
  content?: string;
  duplicateAction?: 'create' | 'update' | 'merge';
  matchedExistingDoc?: EducationalDocument;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLevel?: SchoolLevel;
  existingDocuments?: EducationalDocument[];
  onAddDocument?: (doc: EducationalDocument) => void;
  onAddDocuments?: (docs: EducationalDocument[]) => void;
  onUpdateDocument?: (doc: EducationalDocument) => void;
}

interface ExtractedFile {
  file: File;
  relativePath: string;
  folderName?: string;
}

// Auto-detect subject from path or filename
function detectCategoryFromPath(pathOrName: string, defaultCat: SubjectCategory): SubjectCategory {
  const lower = pathOrName.toLowerCase();
  if (lower.includes('math') || lower.includes('algebr') || lower.includes('geom') || lower.includes('analyse') || lower.includes('arithmetique') || lower.includes('proba')) return 'Mathématiques';
  if (lower.includes('physiq') || lower.includes('chimie') || lower.includes(' pc') || lower.includes('pc ') || lower.includes('mecanique') || lower.includes('optique') || lower.includes('electricite')) return 'Physique-Chimie';
  if (lower.includes('svt') || lower.includes('biol') || lower.includes('geol') || lower.includes('genetique') || lower.includes('vivant')) return 'SVT';
  if (lower.includes('philo')) return 'Philosophie';
  if (lower.includes('franc') || lower.includes('gramm') || lower.includes('dict') || lower.includes('litt') || lower.includes('vocabulaire') || lower.includes('conjugaison')) return 'Français';
  if (lower.includes('hist') || lower.includes('geo')) return 'Histoire-Géo';
  if (lower.includes('angl') || lower.includes('english')) return 'Anglais';
  if (lower.includes('scienc')) return 'Sciences';
  if (lower.includes('eveil') || lower.includes('éveil')) return 'Éveil';
  return defaultCat;
}

// Auto-detect school level from path or filename
function detectLevelFromPath(pathOrName: string, defaultLevel: SchoolLevel): SchoolLevel {
  const norm = pathOrName.toLowerCase();
  
  if (norm.includes('terminale s') || norm.includes('tle s') || norm.includes('tle-s') || norm.includes('bac s') || norm.includes('terminale_s') || norm.includes('term s')) return 'Terminale-S';
  if (norm.includes('terminale l') || norm.includes('tle l') || norm.includes('tle-l') || norm.includes('bac l') || norm.includes('terminale_l') || norm.includes('term l')) return 'Terminale-L';
  if (norm.includes('terminale') || norm.includes('baccalaur') || norm.includes('bac')) return 'Terminale-S';
  
  if (norm.includes('1ere s') || norm.includes('1ère s') || norm.includes('premiere s') || norm.includes('1ere-s') || norm.includes('1ere_s')) return '1ere-S';
  if (norm.includes('1ere l') || norm.includes('1ère l') || norm.includes('premiere l') || norm.includes('1ere-l') || norm.includes('1ere_l')) return '1ere-L';
  if (norm.includes('1ere') || norm.includes('1ère') || norm.includes('premiere')) return '1ere-S';
  
  if (norm.includes('2nde s') || norm.includes('seconde s') || norm.includes('2nde-s') || norm.includes('2nde_s')) return '2nde-S';
  if (norm.includes('2nde l') || norm.includes('seconde l') || norm.includes('2nde-l') || norm.includes('2nde_l')) return '2nde-L';
  if (norm.includes('2nde') || norm.includes('seconde')) return '2nde';
  
  if (norm.includes('3e') || norm.includes('3eme') || norm.includes('3ème') || norm.includes('troisieme') || norm.includes('bfem')) return '3e';
  if (norm.includes('4e') || norm.includes('4eme') || norm.includes('4ème') || norm.includes('quatrieme')) return '4e';
  if (norm.includes('5e') || norm.includes('5eme') || norm.includes('5ème') || norm.includes('cinquieme')) return '5e';
  if (norm.includes('6e') || norm.includes('6eme') || norm.includes('6ème') || norm.includes('sixieme')) return '6e';
  
  if (norm.includes('cm2') || norm.includes('cfee')) return 'CM2';
  if (norm.includes('cm1')) return 'CM1';
  if (norm.includes('ce2')) return 'CE2';
  if (norm.includes('ce1')) return 'CE1';
  if (norm.includes('cp')) return 'CP';
  if (norm.includes('ci')) return 'CI';
  
  return defaultLevel;
}

// Recursively traverse FileSystemDirectoryEntry & FileSystemFileEntry
async function readEntriesRecursively(dirReader: any): Promise<any[]> {
  const allEntries: any[] = [];
  const readBatch = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(
        (entries: any[]) => resolve(entries),
        (err: any) => reject(err)
      );
    });
  };

  while (true) {
    const batch = await readBatch();
    if (!batch || batch.length === 0) break;
    allEntries.push(...batch);
  }
  return allEntries;
}

// Extract files from Drag and Drop DataTransfer (handles folders and files recursively)
async function extractFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<ExtractedFile[]> {
  const results: ExtractedFile[] = [];
  const items = dataTransfer.items;

  if (items && items.length > 0 && typeof items[0].webkitGetAsEntry === 'function') {
    const queue: { entry: any; currentPath: string; rootFolder?: string }[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const entry = items[i].webkitGetAsEntry();
      if (entry) {
        queue.push({
          entry,
          currentPath: '',
          rootFolder: entry.isDirectory ? entry.name : undefined
        });
      }
    }

    while (queue.length > 0) {
      const { entry, currentPath, rootFolder } = queue.shift()!;
      if (entry.isFile) {
        const file = await new Promise<File | null>((resolve) => {
          entry.file(
            (f: File) => resolve(f),
            () => resolve(null)
          );
        });
        if (file) {
          const relativePath = currentPath ? `${currentPath}/${file.name}` : file.name;
          results.push({ file, relativePath, folderName: rootFolder });
        }
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        try {
          const children = await readEntriesRecursively(dirReader);
          const nextPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
          for (const child of children) {
            queue.push({
              entry: child,
              currentPath: nextPath,
              rootFolder: rootFolder || entry.name
            });
          }
        } catch (e) {
          console.warn('Could not read directory entry:', e);
        }
      }
    }
  } else if (dataTransfer.files && dataTransfer.files.length > 0) {
    for (let i = 0; i < dataTransfer.files.length; i++) {
      const file = dataTransfer.files[i];
      const relPath = (file as any).webkitRelativePath || file.name;
      results.push({
        file,
        relativePath: relPath,
        folderName: relPath.includes('/') ? relPath.split('/')[0] : undefined
      });
    }
  }

  return results;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  defaultLevel = 'Terminale-S',
  existingDocuments,
  onAddDocument,
  onAddDocuments,
  onUpdateDocument
}) => {
  const [globalLevel, setGlobalLevel] = useState<SchoolLevel>(defaultLevel);
  const [globalAdditionalLevels, setGlobalAdditionalLevels] = useState<SchoolLevel[]>([]);
  const [globalCategory, setGlobalCategory] = useState<SubjectCategory>('Mathématiques');
  const [globalAuthor, setGlobalAuthor] = useState('Professeur / Enseignant Sénégalais');
  
  // List of queued documents to import
  const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);
  const [detectedFolders, setDetectedFolders] = useState<string[]>([]);
  const [isProcessingFolder, setIsProcessingFolder] = useState(false);
  const [autoClassifyByFolder, setAutoClassifyByFolder] = useState(true);
  
  // Text-only mode state
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process list of extracted files (whether from simple file picker, folder picker, or drag & drop)
  const processExtractedFiles = (extractedList: ExtractedFile[]) => {
    const newItems: FileQueueItem[] = [];
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt', '.odt', '.rtf', '.ppt', '.pptx', '.xls', '.xlsx'];
    const folderNamesSet = new Set<string>();

    for (const item of extractedList) {
      const f = item.file;
      // Skip hidden files, system files, or files without extensions
      if (f.name.startsWith('.') || f.name.toLowerCase() === 'thumbs.db' || f.name.toLowerCase() === 'desktop.ini') {
        continue;
      }

      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      // If extension is known and invalid, skip
      if (!validExtensions.includes(ext) && ext.length > 1) {
        continue;
      }

      if (f.size > 50 * 1024 * 1024) {
        setErrorMsg(`Le fichier "${f.name}" dépasse la limite autorisée de 50 Mo.`);
        continue;
      }

      if (item.folderName) {
        folderNamesSet.add(item.folderName);
      }

      const cleanName = f.name
        .replace(/\.[^/.]+$/, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ');

      // Context used for smart detection: combines folder relative path + filename
      const searchContext = `${item.relativePath || ''} ${f.name}`;
      const detectedCat = autoClassifyByFolder
        ? detectCategoryFromPath(searchContext, globalCategory)
        : globalCategory;
      const detectedLevel = autoClassifyByFolder
        ? detectLevelFromPath(searchContext, globalLevel)
        : globalLevel;

      // Check if duplicate exists
      const cleanNorm = cleanName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const matchedDoc = existingDocuments?.find((d) => {
        const dNorm = d.title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
        return (
          dNorm === cleanNorm ||
          (d.filename && d.filename.toLowerCase() === f.name.toLowerCase())
        );
      });

      newItems.push({
        id: 'queue_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        file: f,
        relativePath: item.relativePath,
        folderName: item.folderName,
        title: cleanName,
        category: detectedCat,
        level: detectedLevel,
        author: globalAuthor,
        pages: 4,
        duplicateAction: matchedDoc ? 'update' : 'create',
        matchedExistingDoc: matchedDoc
      });
    }

    if (folderNamesSet.size > 0) {
      setDetectedFolders((prev) => Array.from(new Set([...prev, ...Array.from(folderNamesSet)])));
    }

    if (newItems.length > 0) {
      setFileQueue((prev) => [...prev, ...newItems]);
      setErrorMsg(null);
    } else {
      setErrorMsg("Aucun document compatible (.pdf, .doc, .docx, .txt) trouvé dans la sélection.");
    }
  };

  // Handle standard files selection
  const handleFiles = (incomingFiles: FileList | File[]) => {
    const fileArray = Array.from(incomingFiles);
    const items: ExtractedFile[] = fileArray.map((f) => ({
      file: f,
      relativePath: (f as any).webkitRelativePath || f.name,
      folderName: ((f as any).webkitRelativePath || '').split('/')[0] || undefined
    }));
    processExtractedFiles(items);
  };

  // Handle folder picker selection
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // reset input so the same folder can be picked again if needed
    e.target.value = '';
  };

  // Handle Drag & Drop of files or folders
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessingFolder(true);
    setErrorMsg(null);

    try {
      const extracted = await extractFilesFromDataTransfer(e.dataTransfer);
      if (extracted.length > 0) {
        processExtractedFiles(extracted);
      }
    } catch (err) {
      console.error('Erreur lors de la lecture des dossiers/fichiers:', err);
      setErrorMsg("Erreur lors de l'extraction des fichiers du dossier.");
    } finally {
      setIsProcessingFolder(false);
    }
  };

  const updateQueueItem = (id: string, updates: Partial<FileQueueItem>) => {
    setFileQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeQueueItem = (id: string) => {
    setFileQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const applyGlobalLevelToAll = (newLevel: SchoolLevel) => {
    setGlobalLevel(newLevel);
    setFileQueue((prev) => prev.map((item) => ({ ...item, level: newLevel })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have items or manual entry
    if (fileQueue.length === 0 && (!manualTitle || !manualContent)) {
      setErrorMsg('Veuillez ajouter au moins un fichier ou saisir un document texte.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const createdDocs: EducationalDocument[] = [];

      // Process queued files
      if (fileQueue.length > 0) {
        setUploadProgress({ current: 0, total: fileQueue.length });

        for (let i = 0; i < fileQueue.length; i++) {
          const item = fileQueue[i];

          // Action: UPDATE EXISTING DOCUMENT
          if (item.duplicateAction === 'update' && item.matchedExistingDoc) {
            const targetId = item.matchedExistingDoc.id;
            if (item.file) {
              await saveFileToStorage(targetId, item.file, item.file.name, item.file.type || 'application/pdf');
            }
            const updated: EducationalDocument = {
              ...item.matchedExistingDoc,
              title: item.title || item.matchedExistingDoc.title,
              category: item.category,
              level: item.level,
              author: item.author || item.matchedExistingDoc.author,
              filename: item.file ? item.file.name : item.matchedExistingDoc.filename,
              content: item.content || item.matchedExistingDoc.content,
              additionalLevels: Array.from(new Set([...(item.matchedExistingDoc.additionalLevels || []), ...globalAdditionalLevels])).filter(l => l !== item.level),
              isLocal: true
            };
            const persisted = await saveDocumentToServer(updated, item.file);
            if (onUpdateDocument) onUpdateDocument(persisted);
            setUploadProgress({ current: i + 1, total: fileQueue.length });
            continue;
          }

          // Action: MERGE CLASSES
          if (item.duplicateAction === 'merge' && item.matchedExistingDoc) {
            const merged: EducationalDocument = {
              ...item.matchedExistingDoc,
              additionalLevels: Array.from(new Set([...(item.matchedExistingDoc.additionalLevels || []), item.level, ...globalAdditionalLevels])).filter(l => l !== item.matchedExistingDoc!.level),
              isLocal: true
            };
            const persisted = await saveDocumentToServer(merged);
            if (onUpdateDocument) onUpdateDocument(persisted);
            setUploadProgress({ current: i + 1, total: fileQueue.length });
            continue;
          }

          // Action: CREATE NEW
          const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
          
          let fileType: FileType = 'pdf';
          if (item.file) {
            const ext = item.file.name.split('.').pop()?.toLowerCase();
            if (ext === 'doc' || ext === 'docx') fileType = 'word';
            else if (ext === 'pdf') fileType = 'pdf';

            // Save file securely to persistent IndexedDB
            await saveFileToStorage(docId, item.file, item.file.name, item.file.type || 'application/pdf');
          }

          const doc: EducationalDocument = {
            id: docId,
            title: item.title || item.file?.name || 'Document pédagogique',
            author: item.author || globalAuthor,
            pages: item.pages || 4,
            category: item.category,
            level: item.level,
            additionalLevels: globalAdditionalLevels.filter((l) => l !== item.level),
            fileType,
            thumb: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
            filename: item.file ? item.file.name : '',
            content: item.content,
            description: item.relativePath 
              ? `Document importé depuis le dossier "${item.folderName || 'Dossier'}" (${item.relativePath}). Classe de ${item.level}.`
              : `Document de ${item.category} pour la classe de ${item.level}. Importé par l'administrateur.`,
            tags: [item.level, item.category, 'Importé', 'Sénégal', ...(item.folderName ? [item.folderName] : [])],
            isLocal: true,
            addedAt: new Date().toISOString()
          };

          const persisted = await saveDocumentToServer(doc, item.file);
          createdDocs.push(persisted);
          setUploadProgress({ current: i + 1, total: fileQueue.length });
        }
      }

      // Process manual text document if present
      if (manualTitle.trim() && manualContent.trim()) {
        const docId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const doc: EducationalDocument = {
          id: docId,
          title: manualTitle.trim(),
          author: globalAuthor,
          pages: Math.max(1, Math.ceil(manualContent.length / 1500)),
          category: globalCategory,
          level: globalLevel,
          fileType: 'pdf',
          thumb: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
          filename: '',
          content: manualContent.trim(),
          description: `Fiche de cours ${globalCategory} (${globalLevel}). Saisie directe.`,
          tags: [globalLevel, globalCategory, 'Fiche', 'Sénégal'],
          isLocal: true,
          addedAt: new Date().toISOString()
        };
        const persisted = await saveDocumentToServer(doc);
        createdDocs.push(persisted);
      }

      // Dispatch to state handlers
      if (onAddDocuments) {
        onAddDocuments(createdDocs);
      } else if (onAddDocument) {
        createdDocs.forEach((d) => onAddDocument(d));
      }

      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error('Erreur lors de l\'importation des documents:', err);
      setErrorMsg("Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer.");
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-xs">
              📁
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                <span>Importer Fichiers ou Dossiers</span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  Dossiers Supportés
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Importez des fichiers individuels ou un <strong>dossier complet</strong> avec auto-classement par classe et matière.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Destination Class & Global Settings */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>🎯 Classe par défaut :</span>
              </label>
              <select
                value={globalLevel}
                onChange={(e) => {
                  const newLevel = e.target.value as SchoolLevel;
                  applyGlobalLevelToAll(newLevel);
                  setGlobalAdditionalLevels((prev) => prev.filter((l) => l !== newLevel));
                }}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name} ({item.cycle})
                  </option>
                ))}
              </select>
            </div>

            {/* Smart Folder Detection Option */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoClassifyByFolder}
                  onChange={(e) => setAutoClassifyByFolder(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Classer automatiquement selon les noms des dossiers / sous-dossiers</span>
                </span>
              </label>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                (Ex: 3e, Terminale, Maths, SVT)
              </span>
            </div>

            {/* Multi-Classes Sharing in Upload */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>🔗</span>
                  <span>Partager aussi avec d'autres classes ({globalAdditionalLevels.length}) :</span>
                </span>
                <div className="flex flex-wrap gap-1 text-[9px]">
                  <button
                    type="button"
                    onClick={() => {
                      const list: SchoolLevel[] = ['Terminale', 'Terminale-S', 'Terminale-L'];
                      setGlobalAdditionalLevels(Array.from(new Set([...globalAdditionalLevels, ...list])).filter(l => l !== globalLevel));
                    }}
                    className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-200 cursor-pointer"
                  >
                    + Toutes Terminales
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const list: SchoolLevel[] = ['2nde', '2nde-S', '2nde-L', '1ere', '1ere-S', '1ere-L', 'Terminale', 'Terminale-S', 'Terminale-L'];
                      setGlobalAdditionalLevels(Array.from(new Set([...globalAdditionalLevels, ...list])).filter(l => l !== globalLevel));
                    }}
                    className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-200 cursor-pointer"
                  >
                    + Tout Lycée
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const list: SchoolLevel[] = ['6e', '5e', '4e', '3e'];
                      setGlobalAdditionalLevels(Array.from(new Set([...globalAdditionalLevels, ...list])).filter(l => l !== globalLevel));
                    }}
                    className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold hover:bg-sky-200 cursor-pointer"
                  >
                    + Tout Collège
                  </button>
                  {globalAdditionalLevels.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setGlobalAdditionalLevels([])}
                      className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((lib) => {
                  const isPrimary = lib.code === globalLevel;
                  const isSelected = globalAdditionalLevels.includes(lib.code) || isPrimary;
                  return (
                    <button
                      key={lib.code}
                      type="button"
                      disabled={isPrimary}
                      onClick={() => {
                        setGlobalAdditionalLevels((prev) =>
                          prev.includes(lib.code)
                            ? prev.filter((l) => l !== lib.code)
                            : [...prev, lib.code]
                        );
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                        isPrimary
                          ? 'bg-indigo-600 text-white border-indigo-600 opacity-90'
                          : isSelected
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-400'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {lib.code} {isPrimary ? '(Principale)' : isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Matière par défaut :
                </label>
                <select
                  value={globalCategory}
                  onChange={(e) => setGlobalCategory(e.target.value as SubjectCategory)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Français">Français</option>
                  <option value="Sciences">Sciences</option>
                  <option value="SVT">SVT</option>
                  <option value="Physique-Chimie">Physique-Chimie</option>
                  <option value="Histoire-Géo">Histoire-Géo</option>
                  <option value="Philosophie">Philosophie</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Éveil">Éveil</option>
                  <option value="Général">Général</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Auteur / Établissement :
                </label>
                <input
                  type="text"
                  value={globalAuthor}
                  onChange={(e) => setGlobalAuthor(e.target.value)}
                  placeholder="Ex: IEF Dakar, Lycée Delafosse"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Hidden HTML5 File & Folder inputs */}
          <input
            ref={fileInputRef}
            id="multiFileInput"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.odt,.rtf,.ppt,.pptx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
              e.target.value = '';
            }}
          />

          <input
            ref={folderInputRef}
            id="folderInput"
            type="file"
            {...({ webkitdirectory: '', directory: '' } as any)}
            multiple
            className="hidden"
            onChange={handleFolderSelect}
          />

          {/* Drag & Drop File & Folder Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
                : fileQueue.length > 0
                ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
            }`}
          >
            {isProcessingFolder ? (
              <div className="flex flex-col items-center py-4">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-2" />
                <p className="font-bold text-sm text-slate-800 dark:text-white">
                  Exploration du dossier en cours...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Extraction récursive des fichiers et des sous-dossiers
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shadow-inner">
                    📁
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-inner">
                    📄
                  </div>
                </div>

                <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Glissez vos fichiers ou vos <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-amber-400">dossiers entiers</span> ici
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  Le système explore automatiquement tous les sous-dossiers et extrait les cours, fiches et annales (PDF, Word, Texte).
                </p>

                {/* Selection Buttons: Files vs Folder */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>Choisir des Fichiers</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => folderInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <FolderUp className="w-4 h-4 text-amber-300" />
                    <span>📂 Choisir un Dossier Complet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Detected Folders Banner */}
          {detectedFolders.length > 0 && (
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-extrabold text-indigo-950 dark:text-indigo-200">
                    Dossier(s) détecté(s) :
                  </span>
                  <span className="ml-1 text-indigo-700 dark:text-indigo-300 font-medium">
                    {detectedFolders.join(', ')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md self-start sm:self-auto">
                Arborescence conservée
              </span>
            </div>
          )}

          {/* List of Files in Queue */}
          {fileQueue.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Documents prêts pour l'import ({fileQueue.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setFileQueue([]);
                    setDetectedFolders([]);
                  }}
                  className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                >
                  Tout effacer
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {fileQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateQueueItem(item.id, { title: e.target.value })}
                          className="flex-1 font-bold text-xs text-slate-900 dark:text-slate-100 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-indigo-600 focus:outline-none pb-0.5 truncate"
                          placeholder="Titre du document"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQueueItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                        title="Retirer ce document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Show Folder Path if coming from folder */}
                    {item.relativePath && item.relativePath.includes('/') && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg font-mono truncate">
                        <Folder className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">Chemin : {item.relativePath}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <select
                          value={item.category}
                          onChange={(e) => updateQueueItem(item.id, { category: e.target.value as SubjectCategory })}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                        >
                          <option value="Mathématiques">Mathématiques</option>
                          <option value="Français">Français</option>
                          <option value="Sciences">Sciences</option>
                          <option value="SVT">SVT</option>
                          <option value="Physique-Chimie">Physique-Chimie</option>
                          <option value="Histoire-Géo">Histoire-Géo</option>
                          <option value="Philosophie">Philosophie</option>
                          <option value="Anglais">Anglais</option>
                          <option value="Éveil">Éveil</option>
                          <option value="Général">Général</option>
                        </select>
                      </div>

                      <div>
                        <select
                          value={item.level}
                          onChange={(e) => updateQueueItem(item.id, { level: e.target.value as SchoolLevel })}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 cursor-pointer"
                        >
                          {Object.values(BIBLIOTHEQUES_PAR_NIVEAU).map((b) => (
                            <option key={b.code} value={b.code}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Duplicate Detection Alert & Quick Actions */}
                    {item.matchedExistingDoc && (
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
                        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <span>⚠️</span>
                            <span>Doublon potentiel : Ce document existe déjà dans « {item.matchedExistingDoc.level} »</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => updateQueueItem(item.id, { duplicateAction: 'update' })}
                            className={`px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                              item.duplicateAction === 'update'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            🔄 Mettre à jour l'existant
                          </button>
                          <button
                            type="button"
                            onClick={() => updateQueueItem(item.id, { duplicateAction: 'merge' })}
                            className={`px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                              item.duplicateAction === 'merge'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            🔗 Fusionner les classes (+{item.level})
                          </button>
                          <button
                            type="button"
                            onClick={() => updateQueueItem(item.id, { duplicateAction: 'create' })}
                            className={`px-2 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                              item.duplicateAction === 'create'
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            ➕ Créer un doublon
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Option for Direct Text / Course Note Saisie */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-3 bg-slate-50/70 dark:bg-slate-800/30">
            <button
              type="button"
              onClick={() => setIsManualMode(!isManualMode)}
              className="w-full flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>✍️</span>
                <span>{isManualMode ? 'Masquer la saisie de texte directe' : 'Saisir ou coller une fiche de cours directement'}</span>
              </span>
              <span>{isManualMode ? '▲' : '▼'}</span>
            </button>

            {isManualMode && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Titre de la fiche (Ex: Théorème de Pythagore résumé)"
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  rows={5}
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Collez ici le texte de la leçon, définitions, formules, exercices..."
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || (fileQueue.length === 0 && !manualTitle.trim())}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {uploadProgress
                      ? `Enregistrement sécurisé (${uploadProgress.current}/${uploadProgress.total})...`
                      : 'Enregistrement sécurisé...'}
                  </span>
                </>
              ) : (
                <span>
                  {fileQueue.length > 1
                    ? `Importer les ${fileQueue.length} documents dans les classes`
                    : fileQueue.length === 1
                    ? `Importer le document dans la classe ${fileQueue[0].level}`
                    : 'Enregistrer le document'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
