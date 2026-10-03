import React, { useState, useEffect } from 'react';
import { X, Volume2, Pause, Play, RotateCcw, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

interface DicteeItem {
  id: string;
  level: string;
  title: string;
  author: string;
  text: string;
  textWithPunctuation: string;
  focusGrammar: string;
}

const SAMPLE_DICTEES: DicteeItem[] = [
  {
    id: 'dictee-bfem',
    level: '3ème (BFEM)',
    title: 'La poussière du Sahel',
    author: 'D’après Léopold Sédar Senghor',
    text: "L'harmattan soufflait sur la savane, emportant avec lui la poussière ocre du Sahel. Dans le village assoupi sous le soleil de midi, les anciens s'étaient rassemblés sous le grand baobab centenaire. Leur parole, lente et mesurée, tissait la mémoire des générations passées.",
    textWithPunctuation: "L'harmattan soufflait sur la savane virgule emportant avec lui la poussière ocre du Sahel point Dans le village assoupi sous le soleil de midi virgule les anciens s'étaient rassemblés sous le grand baobab centenaire point Leur parole virgule lente et mesurée virgule tissait la mémoire des générations passées point",
    focusGrammar: 'Accords des participes passés avec être et comme adjectifs (assoupi, rassemblés, passées), temps de l’imparfait de description.'
  },
  {
    id: 'dictee-cfee',
    level: 'CM2 (CFEE)',
    title: 'Le retour des pêcheurs à Kayar',
    author: 'Auteurs pédagogiques sénégalais',
    text: "Au coucher du soleil, les pirogues multicolores reviennent vers la plage de Kayar. Les vaillants pêcheurs ont affronté les hautes vagues de l'Océan Atlantique. Leurs paniers sont remplis de gros poissons frais que les mareyeuses achètent avec enthousiasme.",
    textWithPunctuation: "Au coucher du soleil virgule les pirogues multicolores reviennent vers la plage de Kayar point Les vaillants pêcheurs ont affronté les hautes vagues de l'Océan Atlantique point Leurs paniers sont remplis de gros poissons frais que les mareyeuses achètent avec enthousiasme point",
    focusGrammar: 'Pluriel des noms et adjectifs (multicolores, vaillants, hautes, remplis), accord du verbe au présent (reviennent, achètent).'
  }
];

interface DicteeAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DicteeAudioModal: React.FC<DicteeAudioModalProps> = ({ isOpen, onClose }) => {
  const [selectedDictee, setSelectedDictee] = useState<DicteeItem>(SAMPLE_DICTEES[0]);
  const [userSubmission, setUserSubmission] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // slower cadence for dictation
  const [showCorrection, setShowCorrection] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSpeak = (withPunctuation: boolean) => {
    if (!('speechSynthesis' in window)) {
      alert("Votre navigateur ne supporte pas la synthèse vocale Web Speech API.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const textToRead = withPunctuation ? selectedDictee.textWithPunctuation : selectedDictee.text;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = speechRate;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
              🎙️
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                Entraînement Dictée Vocale & Orthographe
              </h3>
              <p className="text-xs text-white/80">
                Dictées officielles avec annonce de la ponctuation (CFEE & BFEM 🇸🇳)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level selector tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex gap-2 shrink-0">
          {SAMPLE_DICTEES.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                handleStop();
                setSelectedDictee(d);
                setUserSubmission('');
                setShowCorrection(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDictee.id === d.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.level} : {d.title}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Audio Controls Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-amber-900 uppercase">
                {selectedDictee.level} • {selectedDictee.title}
              </span>
              <p className="text-xs text-amber-800 mt-0.5">
                {selectedDictee.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSpeak(false)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer shadow-xs"
                title="Lecture globale normale du texte"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Lecture Globale
              </button>

              <button
                onClick={() => handleSpeak(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-sm active:scale-95"
                title="Lecture avec ponctuation annoncée à voix haute pour écrire"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause / Arrêter' : 'Dicter avec ponctuation'}</span>
              </button>

              {isPlaying && (
                <button
                  onClick={handleStop}
                  className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  title="Arrêter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grammar focus badge */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <span className="font-bold text-slate-800">🎯 Points grammaticaux ciblés :</span>
            <span>{selectedDictee.focusGrammar}</span>
          </div>

          {/* Student writing input area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ✍️ Écrivez votre dictée ici (ou sur votre cahier de français) :
            </label>
            <textarea
              rows={4}
              value={userSubmission}
              onChange={(e) => setUserSubmission(e.target.value)}
              placeholder="Lancez la lecture vocale et écrivez au fur et à mesure..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Correction Section */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setShowCorrection(!showCorrection)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {showCorrection ? 'Masquer le texte modèle' : 'Afficher le texte officiel & Corriger'}
            </button>
          </div>

          {showCorrection && (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-950 animate-in fade-in duration-200 space-y-3">
              <div>
                <strong className="block text-emerald-900 font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Texte original de référence :
                </strong>
                <p className="font-serif text-sm sm:text-base leading-relaxed p-3 bg-white rounded-xl border border-emerald-200 text-slate-800">
                  {selectedDictee.text}
                </p>
              </div>

              <div className="text-xs text-emerald-800">
                <strong>Astuce de relecture au Sénégal :</strong> Chaque mot mal orthographié coûte 1 point au BFEM et 2 points au CFEE. Relisez toujours 3 fois : 1 fois pour les accords des verbes, 1 fois pour les pluriels en s/x, et 1 fois pour les accents.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
