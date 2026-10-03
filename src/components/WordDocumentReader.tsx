import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import { 
  FileText, 
  Loader2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Search, 
  AlertCircle, 
  Maximize2, 
  Minimize2,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface WordDocumentReaderProps {
  fileUrl: string;
  documentTitle: string;
  onDownload: () => void;
}

export const WordDocumentReader: React.FC<WordDocumentReaderProps> = ({
  fileUrl,
  documentTitle,
  onDownload
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPaperMode, setIsPaperMode] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadWordFile() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Impossible de charger le fichier Word (Code ${response.status})`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (isCancelled) return;

        // Convert docx arrayBuffer to HTML using mammoth
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "p[style-name='Title'] => h1.doc-title:fresh",
              "p[style-name='Subtitle'] => p.doc-subtitle:fresh",
              "r[style-name='Strong'] => strong"
            ]
          }
        );

        const textResult = await mammoth.extractRawText({ arrayBuffer });

        if (!isCancelled) {
          if (!result.value || result.value.trim().length === 0) {
            // If empty HTML, use raw text with line breaks
            setHtmlContent(textResult.value ? textResult.value.replace(/\n/g, '<br/>') : '<p>Ce document Word ne contient pas de texte lisible.</p>');
          } else {
            setHtmlContent(result.value);
          }
          setRawText(textResult.value || '');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Error reading Word document with Mammoth:', err);
        if (!isCancelled) {
          setError(
            err.message ||
              "Ce format de document (.doc ancien ou protégé) ne peut pas être converti directement en HTML. Vous pouvez le télécharger pour l'ouvrir dans Microsoft Word ou WPS Office."
          );
          setIsLoading(false);
        }
      }
    }

    if (fileUrl) {
      loadWordFile();
    } else {
      setError("Aucune URL de fichier valide n'a été fournie.");
      setIsLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [fileUrl]);

  const handleCopyText = () => {
    if (rawText) {
      navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const wordCount = rawText ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-3xl">
            📘
          </div>
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin absolute -bottom-1 -right-1" />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
            Ouverture du document Word en cours...
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conversion des styles, tableaux et paragraphes pour une lecture fluide
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-lg mx-auto p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center space-y-4 my-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
            Lecture directe non disponible
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            {error}
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={onDownload}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le fichier Word (.docx)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      {/* Top Toolbar for Word Reader */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2.5 rounded-2xl mb-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* Document Stats & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            W
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {documentTitle}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>{wordCount} mots</span>
              <span>•</span>
              <span>~{estimatedReadTime} min de lecture</span>
            </div>
          </div>
        </div>

        {/* Reader Controls: Font Size, Copy, Paper Mode, Print, Download */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Font Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setFontSize((s) => Math.max(12, s - 2))}
              className="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg font-bold transition-colors cursor-pointer"
              title="Diminuer la police"
            >
              A-
            </button>
            <span className="px-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(26, s + 2))}
              className="px-2 py-1 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg font-bold transition-colors cursor-pointer"
              title="Agrandir la police"
            >
              A+
            </button>
          </div>

          {/* Paper View Toggle */}
          <button
            onClick={() => setIsPaperMode(!isPaperMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isPaperMode
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
            }`}
            title="Basculer en mode page A4"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Page A4</span>
          </button>

          {/* Copy full text */}
          <button
            onClick={handleCopyText}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Copier le texte"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copié !' : 'Copier'}</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Imprimer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          {/* Download Original Word File */}
          <button
            onClick={onDownload}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Télécharger le fichier original"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Télécharger</span>
          </button>
        </div>
      </div>

      {/* Rendered Word Document Container */}
      <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-6 rounded-2xl flex justify-center">
        <div
          className={`w-full transition-all duration-200 ${
            isPaperMode
              ? 'max-w-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-12 rounded-2xl sm:rounded-3xl shadow-md border border-slate-200 dark:border-slate-800'
              : 'w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 sm:p-8 rounded-2xl shadow-sm'
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {/* Word content with standard typography classes */}
          <div
            className="word-content leading-relaxed space-y-4 font-sans select-text [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:border-b [&_h1]:border-slate-200 dark:[&_h1]:border-slate-800 [&_h1]:pb-2 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-indigo-900 dark:[&_h2]:text-indigo-300 [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_td]:border [&_td]:border-slate-300 dark:[&_td]:border-slate-700 [&_td]:p-2.5 [&_th]:border [&_th]:border-slate-300 dark:[&_th]:border-slate-700 [&_th]:p-2.5 [&_th]:bg-slate-100 dark:[&_th]:bg-slate-800 [&_th]:font-bold [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-3 [&_img]:mx-auto [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
};
