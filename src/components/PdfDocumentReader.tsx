import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  ExternalLink, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react';

// Configure PDF.js worker from reliable CDN matching installed version
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface PdfDocumentReaderProps {
  fileUrl: string;
  documentTitle: string;
  onDownload: () => void;
}

export const PdfDocumentReader: React.FC<PdfDocumentReaderProps> = ({
  fileUrl,
  documentTitle,
  onDownload
}) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'canvas' | 'native'>('canvas');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    async function loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: fileUrl,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.warn('PDF.js canvas rendering failed, falling back to native iframe/embed:', err);
        if (!isCancelled) {
          setError(err.message || 'Impossible de charger le document PDF');
          setViewMode('native');
          setIsLoading(false);
        }
      }
    }

    if (fileUrl) {
      loadPdf();
    }

    return () => {
      isCancelled = true;
    };
  }, [fileUrl]);

  // Render current page on canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || viewMode !== 'canvas') return;

    let isCancelled = false;

    async function renderPage() {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled || !canvasRef.current) return;

        // Cancel previous rendering if still running
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // ignore cancellation error
          }
        }

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.warn('Error rendering PDF page on canvas:', err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage, scale, rotation, viewMode]);

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(numPages, p + 1));
  };

  const handleZoomIn = () => {
    setScale((s) => Math.min(3.0, s + 0.2));
  };

  const handleZoomOut = () => {
    setScale((s) => Math.max(0.6, s - 0.2));
  };

  const handleResetZoom = () => {
    setScale(1.25);
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-[550px]">
      {/* Top Toolbar for PDF Reader */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2.5 rounded-2xl mb-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        {/* Document Title and Info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
            PDF
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {documentTitle}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Lecteur Haute Définition</span>
              {numPages > 1 && (
                <>
                  <span>•</span>
                  <span>{numPages} pages</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reader Controls: Page Navigator, Zoom, Rotate, Print, Download */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Page Navigation */}
          {numPages > 1 && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-0.5 text-xs font-bold">
              <button
                disabled={currentPage <= 1}
                onClick={handlePrevPage}
                className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Page précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] text-slate-700 dark:text-slate-200 select-none">
                {currentPage} / {numPages}
              </span>
              <button
                disabled={currentPage >= numPages}
                onClick={handleNextPage}
                className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
                title="Page suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-0.5 text-xs">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
              title="Zoom arrière (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer select-none"
              title="Réinitialiser le zoom"
            >
              {Math.round(scale * 100 / 1.25)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors cursor-pointer"
              title="Zoom avant (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rotate Button */}
          <button
            onClick={handleRotate}
            className="p-1.5 sm:px-2 sm:py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Pivoter de 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pivoter</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Imprimer le document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          {/* Open in new window / full tab */}
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plein Écran</span>
          </a>

          {/* Download */}
          <button
            onClick={onDownload}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Télécharger le document PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Télécharger</span>
          </button>
        </div>
      </div>

      {/* Main Reader View Container */}
      <div className="flex-1 w-full min-h-[550px] relative rounded-2xl overflow-auto border border-slate-200 dark:border-slate-700 bg-slate-900/90 shadow-inner flex flex-col items-center justify-start p-3 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3 my-auto">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="font-extrabold text-sm text-white">
              Chargement du PDF Haute Définition...
            </p>
            <p className="text-xs text-slate-400">
              Rendu fluide des pages sans extension requise
            </p>
          </div>
        ) : viewMode === 'canvas' ? (
          <div className="flex flex-col items-center space-y-4 max-w-full">
            {/* The High Definition Rendered PDF Canvas */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 max-w-full">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto block select-none"
              />
            </div>

            {/* Quick Next/Prev Page Bar below canvas */}
            {numPages > 1 && (
              <div className="flex items-center gap-3 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl border border-slate-700 shadow-lg text-xs font-bold">
                <button
                  disabled={currentPage <= 1}
                  onClick={handlePrevPage}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Page précédente</span>
                </button>
                <span className="px-2 text-indigo-300">
                  Page {currentPage} sur {numPages}
                </span>
                <button
                  disabled={currentPage >= numPages}
                  onClick={handleNextPage}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Page suivante</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Native fallback */
          <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center">
            <object
              data={`${fileUrl}#toolbar=1`}
              type="application/pdf"
              className="w-full h-full min-h-[500px] rounded-xl"
            >
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md shadow-xs space-y-4 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  📄
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    Lecture du document PDF
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Ce document PDF est prêt pour consultation immédiate.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ouvrir en Plein Écran</span>
                  </a>
                  <button
                    onClick={onDownload}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            </object>
          </div>
        )}
      </div>
    </div>
  );
};
