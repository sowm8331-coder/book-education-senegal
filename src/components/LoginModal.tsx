import React, { useState } from 'react';
import { ShieldCheck, User, Eye, EyeOff, X, Lock, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'admin' | 'student';
  onAdminLoginSuccess: () => void;
  onStudentLoginSuccess: () => void;
  onOpenPassScolaire?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'student',
  onAdminLoginSuccess,
  onStudentLoginSuccess,
  onOpenPassScolaire
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>(defaultTab);
  const [adminPassword, setAdminPassword] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '70637Sow') {
      setErrorMsg(null);
      onAdminLoginSuccess();
      onClose();
    } else {
      setErrorMsg('Mot de passe administrateur invalide. Veuillez vérifier vos identifiants.');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentCode === '7063736') {
      setErrorMsg(null);
      onStudentLoginSuccess();
      onClose();
    } else {
      setErrorMsg("Code d'accès invalide. Rapprochez-vous de l'administrateur pour obtenir votre code officiel.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
              🔐
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Espace d'Accès Sécurisé
              </h3>
              <p className="text-xs text-slate-500">
                Book Education Sénégal 🇸🇳
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-white">
          <button
            onClick={() => {
              setActiveTab('student');
              setErrorMsg(null);
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Élève / Enseignant</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg(null);
            }}
            className={`py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Administrateur</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Code d'inscription Élève / Enseignant
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="Entrez votre code d'inscription"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confidential Notice */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                <span className="text-base shrink-0">ℹ️</span>
                <span>Votre code d'accès personnel vous est fourni directement par M. Sow après souscription du Pass Scolaire.</span>
              </div>

              {/* Pass 2 000 FCFA Offer Banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    Rentrée : 2 000 F / an
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    Pas encore de code d'accès ?
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Obtenez votre Pass Annuel pour toute l'année scolaire via Wave / OM.
                  </p>
                </div>
                {onOpenPassScolaire && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPassScolaire();
                    }}
                    className="shrink-0 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    Voir l'offre
                  </button>
                )}
              </div>

              {/* Direct WhatsApp request button */}
              <a
                href="https://wa.me/221705657277?text=Bonjour,%20je%20souhaite%20obtenir%20mon%20code%20d'acc%C3%A8s%20pour%20la%20plateforme%20Book%20Education%20S%C3%A9n%C3%A9gal."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-base">💬</span>
                <span>Demander mon code sur WhatsApp : 70 565 72 77</span>
              </a>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-98"
              >
                Se connecter en tant qu'Élève
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mot de passe Administrateur
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Entrez le mot de passe administrateur"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confidential Notice */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <span className="text-base shrink-0">🛡️</span>
                <span>Zone réservée à la gestion administrative des épreuves, documents et utilisateurs.</span>
              </div>

              {/* Direct WhatsApp admin support link */}
              <a
                href="https://wa.me/221705657277?text=Bonjour%20M.%20Sow,%20concernant%20l'espace%20administrateur%20Book%20Education%20S%C3%A9n%C3%A9gal."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span className="text-base">💬</span>
                <span>Support Admin sur WhatsApp : 70 565 72 77</span>
              </a>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md shadow-slate-900/20 cursor-pointer active:scale-98"
              >
                Se connecter en tant qu'Administrateur
              </button>
            </form>
          )}

          <button
            onClick={onClose}
            className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
