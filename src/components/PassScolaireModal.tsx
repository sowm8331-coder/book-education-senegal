import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Copy, Check, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

interface PassScolaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const PassScolaireModal: React.FC<PassScolaireModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin
}) => {
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isOpen) return null;

  const PHONE_NUMBER = '70 565 72 77';
  const RAW_PHONE = '221705657277';
  const WHATSAPP_LINK = `https://wa.me/${RAW_PHONE}?text=${encodeURIComponent(
    "Bonjour M. Sow, j'ai effectué le paiement de 2 000 FCFA par Wave/Orange Money pour le Pass Annuel Book Education Sénégal. Merci de me transmettre mon lien et mon code d'accès personnel pour l'année scolaire."
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText('705657277');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Banner Header with Senegal Pride */}
        <div className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white p-6 sm:p-7 shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 font-extrabold text-xs mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFRE RENTRÉE SCOLAIRE 🇸🇳</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Pass Scolaire Annuel : <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">2 000 FCFA</span>
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 font-medium leading-relaxed">
            Pour la rentrée qui commence la semaine prochaine : accédez à toutes les annales officielles, cours, corrigés et tuteurs pour <strong>toute l'année scolaire</strong> !
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Tarification Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
                Tarif Unique & Transparent
              </span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start mt-0.5">
                <span className="text-4xl font-black text-slate-900 dark:text-white">2 000</span>
                <span className="text-base font-bold text-amber-700 dark:text-amber-300">FCFA</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ an</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Aucun frais caché. Valable du <strong>CI à la Terminale</strong> (CFEE, BFEM, BAC S & L).
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Année Scolaire Complète</span>
              </span>
            </div>
          </div>

          {/* Comment obtenir mon code en 3 étapes */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span>
              <span>Comment obtenir votre lien et code d'accès :</span>
            </h4>

            {/* Étape 1 : Paiement */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Envoyez 2 000 FCFA par Wave ou Orange Money
                  </span>
                </div>
              </div>

              {/* Numéro de paiement */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <span className="w-7 h-7 rounded-full bg-sky-500 text-white font-black text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs" title="Wave">
                      🌊
                    </span>
                    <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-black text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs" title="Orange Money">
                      🟧
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Numéro Officiel (M. Sow) :</span>
                    <span className="text-base font-black text-slate-900 dark:text-white tracking-wide">
                      {PHONE_NUMBER}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    copiedNumber
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? 'Numéro Copié !' : 'Copier le numéro'}</span>
                </button>
              </div>
            </div>

            {/* Étape 2 : Confirmation WhatsApp */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span className="font-extrabold text-xs text-emerald-950 dark:text-emerald-300">
                  Transmettez votre capture de paiement sur WhatsApp
                </span>
              </div>
              
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                Dès réception, M. Sow vous transmet immédiatement votre lien et votre code d'accès personnel pour toute l'année scolaire.
              </p>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-98"
              >
                <span className="text-base">💬</span>
                <span>Ouvrir WhatsApp pour valider mon Pass (70 565 72 77)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Étape 3 : Connexion */}
            <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Déjà reçu votre code ? Connectez-vous directement :</span>
              </div>
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] shrink-0 transition-all cursor-pointer active:scale-95"
                >
                  Entrer mon code
                </button>
              )}
            </div>
          </div>

          {/* Avantages Inclus */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <h5 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Tout ce qui est débloqué avec votre Pass 2 000 FCFA :
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>19 classes complètes (CI au BAC)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Annales corrigées CFEE, BFEM & BAC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Téléchargement illimité des PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Chrono d'examen réel & Flashcards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tuteur audio en Wolof & Français</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Assistance WhatsApp toute l'année</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Service Pédagogique Officiel • République du Sénégal</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
