import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  Pause, 
  Play, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Languages, 
  GraduationCap, 
  HelpCircle,
  Headphones,
  Sliders,
  ArrowRight
} from 'lucide-react';

interface AudioCapsule {
  id: string;
  title: string;
  subject: string;
  level: string;
  icon: string;
  summaryFr: string;
  summaryWolof: string;
  keyVocabulary: { fr: string; wolof: string; note?: string }[];
}

const AUDIO_CAPSULES: AudioCapsule[] = [
  {
    id: 'pythagore',
    title: 'Théorème de Pythagore',
    subject: 'Mathématiques',
    level: 'Collège (4e - 3e BFEM)',
    icon: '📐',
    summaryFr: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés. Si le triangle est rectangle en A, alors BC au carré est égal à AB au carré plus AC au carré. Ce théorème sert à calculer une longueur inconnue.",
    summaryWolof: "Ci ab triyàngal bu am kooñ bu jub (triangle rectangle), kàrre bu wet bi gën a gudd (hypoténuse bi) dafa yem ak mbooleem kàrre yu ñaari wet yi ci des. Boo jëlee a² ak b², dafay faf yem ak c². Li dafay dimbali ndongo bi ngir mu mën a natt ab wet bu mu xamul guddaayam.",
    keyVocabulary: [
      { fr: 'Triangle rectangle', wolof: 'Triyàngal bu am kooñ bu jub', note: 'Angle droit de 90 degrés' },
      { fr: 'Hypoténuse', wolof: 'Wet bi gën a gudd', note: 'Côté opposé à l’angle droit' },
      { fr: 'Carré', wolof: 'Kàrre', note: 'Nombre multiplié par lui-même' },
      { fr: 'Somme', wolof: 'Mbooleem / Booloole', note: 'Résultat de l’addition' }
    ]
  },
  {
    id: 'fractions',
    title: 'Les Fractions & Partages Égaux',
    subject: 'Mathématiques',
    level: 'Élémentaire (CM1 - CM2 CFEE)',
    icon: '🍰',
    summaryFr: "Une fraction représente une part d'un tout partagé en morceaux égaux. Le chiffre du haut s'appelle le numérateur, il compte les parts prises. Le chiffre du bas est le dénominateur, il indique en combien de parts égales l'unité a été coupée.",
    summaryWolof: "Faraksiõ dafay wone ab wàll ci lenn lu ñu séddale ci wàll yu yam. Nimero bi féete kow ñu koy wax numeratëer, mooy lim wàll yi ñu jël. Nimero bi féete suuf mooy denominatëer, mooy wone ci ñaata wàll yu yem la ñu dagg mburu mi walla pom bi.",
    keyVocabulary: [
      { fr: 'Numérateur', wolof: 'Lim bi ci kow (li ñu jël)', note: 'Parts prises' },
      { fr: 'Dénominateur', wolof: 'Lim bi ci suuf (mbooleem wàll yi)', note: 'Nombre total de parts' },
      { fr: 'Moitié (un demi)', wolof: 'Genn-wàll (1/2)', note: 'Divisé en 2 parts' },
      { fr: 'Un quart', wolof: 'Liibar / Ab kaar (1/4)', note: 'Divisé en 4 parts' }
    ]
  },
  {
    id: 'photosynthese',
    title: 'La Photosynthèse des Plantes',
    subject: 'SVT & Sciences',
    level: 'Collège & Lycée',
    icon: '🌱',
    summaryFr: "La photosynthèse est le mécanisme vital par lequel les plantes vertes fabriquent leur propre nourriture. Grâce à la chlorophylle, elles captent la lumière du soleil, absorbent le dioxyde de carbone et l'eau, puis rejettent l'oxygène indispensable à notre respiration.",
    summaryWolof: "Fotosàntes mooy ni gàncax gu vert giy defare li koy dundal. Dafa soxla leeru jant bi, ngelaw lu ñuy wax CO2, ak ndox mu bàyyiko ci suuf si. Bu noppee dafay génne Oksiseen (O2) ngir mbooleem nit ak mala yi mën a nooyi te dund ci jàmm.",
    keyVocabulary: [
      { fr: 'Chlorophylle', wolof: 'Meloxaan bu vert ci xob yi', note: 'Pigment végétal vert' },
      { fr: 'Oxygène', wolof: 'Ngelawu nooyi (O2)', note: 'Gaz vital pour respirer' },
      { fr: 'Dioxyde de carbone', wolof: 'CO2', note: 'Gaz absorbé par les plantes' },
      { fr: 'Racines', wolof: 'Reen yi', note: 'Puise l’eau dans la terre' }
    ]
  },
  {
    id: 'latdior',
    title: 'Lat-Dior & la Résistance Nationale',
    subject: 'Histoire du Sénégal',
    level: 'Collège & Lycée (BFEM / BAC)',
    icon: '⚔️',
    summaryFr: "Lat-Dior Ngoné Latyr Diop fut le dernier Damel du Cayor et une figure légendaire de la résistance sénégalaise. Il s'opposa farouchement à la colonisation française et à la construction de la ligne de chemin de fer Dakar-Saint-Louis, jusqu'à sa mort héroïque à la bataille de Dékheulé en 1886.",
    summaryWolof: "Lat-Joor Ngoone Latiir Jóob, Daameelu Kajoor la woon. Dafa bañoon bu baxa baxx ngir aar suufam, aar cosaanu Kajoor, ak bañ rayu weñ bi (chemin de fer) bu Faidherbe bëggoon a def. Dafa xex ak tubaab yi ba Dékxële ci atum 1886, ba faatu fa ni ab jàmbaar.",
    keyVocabulary: [
      { fr: 'Damel', wolof: 'Buur / Kilifa gu mag ci Kajoor', note: 'Titre du souverain du Cayor' },
      { fr: 'Résistance', wolof: 'Bañug jàmbaar', note: 'Refus de la domination étrangère' },
      { fr: 'Chemin de fer', wolof: 'Rayu weñ bi', note: 'Ligne ferroviaire coloniale' },
      { fr: 'Héros national', wolof: 'Jàmbaaru réew mi', note: 'Figure historique exemplaire' }
    ]
  },
  {
    id: 'philo_conscience',
    title: 'La Conscience et l’Inconscient',
    subject: 'Philosophie',
    level: 'Terminale (BAC L & S)',
    icon: '🧠',
    summaryFr: "En philosophie, la conscience est la faculté humaine de se percevoir soi-même et de juger ses actes. Pour Freud, l'inconscient montre qu'une grande part de nos pensées et désirs échappe à notre volonté directe : le moi n'est pas maître dans sa propre maison.",
    summaryWolof: "Ci xam-xamu filosofi, konsiàns mooy xel mu lewet mi lay xamal sa bopp ak li ngay def. Waaye borom xam-xam bi tudd Freud dafa wax ne am na leneen lu ñuy wax inkonsiàñ, maanaam xalaat ak bëgg-bëgg yu nëbbu ci sunu biir xol te sunu cawarte mënu koo dëppal saasune.",
    keyVocabulary: [
      { fr: 'Conscience', wolof: 'Xel mu xam boppam (Konsiàns)', note: 'Connaissance immédiate de soi' },
      { fr: 'Inconscient', wolof: 'Li nëbbu ci biir xel (Inkonsiàñ)', note: 'Zone cachée du psychisme' },
      { fr: 'Liberté', wolof: 'Moom sa bopp / Tawfeex', note: 'Pouvoir d’agir sans contrainte' },
      { fr: 'Raison', wolof: 'Xel mu jub / Xellu', note: 'Faculté de juger et discerner' }
    ]
  },
  {
    id: 'force_newton',
    title: 'Les Forces & le Mouvement (Newton)',
    subject: 'Physique-Chimie',
    level: 'Lycée (Seconde à Terminale S)',
    icon: '⚡',
    summaryFr: "Une force est toute action capable de modifier le mouvement d'un corps ou de le déformer. Selon la première loi de Newton, si aucune force ne s'exerce sur un solide, il reste immobile ou poursuit un mouvement rectiligne uniforme.",
    summaryWolof: "Ab kàttan walla doole (force) mooy lenn luy doxal ab yaram walla di soppi doxam. Bu dara tēwul ab yaram te benn doole jëfewu ci moom, day des ci nooflay walla mu wéy ci dox bu jub te yem ni ab moto buy daw ci yoon bu jub.",
    keyVocabulary: [
      { fr: 'Force', wolof: 'Doole / Kàttan', note: 'Action mécanique exprimée en Newtons' },
      { fr: 'Vitesse', wolof: 'Gaawaay', note: 'Distance parcourue par unité de temps' },
      { fr: 'Repos', wolof: 'Nooflay / Taxaw', note: 'Immobilité' },
      { fr: 'Masse', wolof: 'Dissaay bu yaram bi', note: 'Quantité de matière en kg' }
    ]
  }
];

const WOLOF_DICTIONARY = [
  { fr: 'Nombre / Chiffre', wolof: 'Lim / Kojal', cat: 'Maths' },
  { fr: 'Additionner', wolof: 'Booloole / Dolli', cat: 'Maths' },
  { fr: 'Soustraire', wolof: 'Waññi', cat: 'Maths' },
  { fr: 'Multiplier', wolof: 'Fuli', cat: 'Maths' },
  { fr: 'Diviser / Partager', wolof: 'Séddale', cat: 'Maths' },
  { fr: 'Égalité', wolof: 'Yam / Tollale', cat: 'Maths' },
  { fr: 'Ligne droite', wolof: 'Ràjj bu jub', cat: 'Géométrie' },
  { fr: 'Cercle / Rond', wolof: 'Rumbull', cat: 'Géométrie' },
  { fr: 'Angle', wolof: 'Kooñ', cat: 'Géométrie' },
  { fr: 'Chaleur', wolof: 'Tàngoor', cat: 'Physique' },
  { fr: 'Froid', wolof: 'Seddaay', cat: 'Physique' },
  { fr: 'Poids / Gravité', wolof: 'Dissaay / Li suuf biy rëcc', cat: 'Physique' },
  { fr: 'Électricité', wolof: 'Kuraŋ', cat: 'Physique' },
  { fr: 'Air / Vent', wolof: 'Ngelaw', cat: 'Sciences' },
  { fr: 'Eau', wolof: 'Ndox', cat: 'Sciences' },
  { fr: 'Terre / Sol', wolof: 'Suuf', cat: 'Sciences' },
  { fr: 'Plante / Arbre', wolof: 'Gàncax / Garab', cat: 'SVT' },
  { fr: 'Être vivant', wolof: 'Luy dund', cat: 'SVT' },
  { fr: 'Corps humain', wolof: 'Yaramu nit', cat: 'SVT' },
  { fr: 'Cœur', wolof: 'Xol', cat: 'SVT' },
  { fr: 'Cerveau / Pensée', wolof: 'Yoon / Xel', cat: 'Philosophie' },
  { fr: 'Vérité', wolof: 'Dëgg', cat: 'Philosophie' },
  { fr: 'Pays / Patrie', wolof: 'Réew', cat: 'Histoire-Géo' },
  { fr: 'Peuple', wolof: 'Askan', cat: 'Histoire-Géo' },
  { fr: 'Paix', wolof: 'Jàmm', cat: 'Civisme' }
];

interface WolofAudioTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTextToRead?: string;
}

export const WolofAudioTutorModal: React.FC<WolofAudioTutorModalProps> = ({
  isOpen,
  onClose,
  initialTextToRead
}) => {
  const [activeTab, setActiveTab] = useState<'capsules' | 'dictionary' | 'tts'>('capsules');
  const [selectedCapsule, setSelectedCapsule] = useState<AudioCapsule>(AUDIO_CAPSULES[0]);
  const [searchDict, setSearchDict] = useState('');
  
  // Custom Speech Text
  const [customText, setCustomText] = useState(initialTextToRead || '');
  const [customLang, setCustomLang] = useState<'fr' | 'wolof'>('fr');

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackLanguage, setPlaybackLanguage] = useState<'fr' | 'wolof'>('wolof');
  const [speechRate, setSpeechRate] = useState<number>(0.9); // natural speed
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopAudio();
    };
  }, []);

  useEffect(() => {
    if (initialTextToRead) {
      setCustomText(initialTextToRead);
      setActiveTab('tts');
    }
  }, [initialTextToRead]);

  if (!isOpen) return null;

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const playText = (text: string, lang: 'fr' | 'wolof') => {
    if (!synthRef.current) {
      alert("Votre appareil ou navigateur ne supporte pas la synthèse vocale Web Speech API.");
      return;
    }

    stopAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    // Use French voice for French, or high-clarity voice for Wolof phonetics
    utterance.lang = 'fr-FR';
    utterance.rate = speechRate;
    utterance.pitch = lang === 'wolof' ? 1.05 : 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setPlaybackLanguage(lang);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handlePlayCapsule = (lang: 'fr' | 'wolof') => {
    const textToPlay = lang === 'fr' ? selectedCapsule.summaryFr : selectedCapsule.summaryWolof;
    playText(textToPlay, lang);
  };

  const filteredDictionary = WOLOF_DICTIONARY.filter(
    (item) =>
      item.fr.toLowerCase().includes(searchDict.toLowerCase()) ||
      item.wolof.toLowerCase().includes(searchDict.toLowerCase()) ||
      item.cat.toLowerCase().includes(searchDict.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/20">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-xl tracking-tight">
                  Synthèse Vocale & Audio en Wolof
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 shadow-xs">
                  Sénégal 🇸🇳
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Écoutez les explications scolaires en Wolof et Français pour mieux assimiler vos leçons
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 sm:px-6">
          <button
            onClick={() => {
              stopAudio();
              setActiveTab('capsules');
            }}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'capsules'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>Capsules Audio Pédagogiques</span>
          </button>

          <button
            onClick={() => {
              stopAudio();
              setActiveTab('dictionary');
            }}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dictionary'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>Lexique Scolaire Wolof ↔ Français</span>
          </button>

          <button
            onClick={() => {
              stopAudio();
              setActiveTab('tts');
            }}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Lecture Vocale Libre</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          {/* TAB 1: CAPSULES AUDIO */}
          {activeTab === 'capsules' && (
            <div className="space-y-6">
              {/* Capsule Selection Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                {AUDIO_CAPSULES.map((cap) => (
                  <button
                    key={cap.id}
                    onClick={() => {
                      stopAudio();
                      setSelectedCapsule(cap);
                    }}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                      selectedCapsule.id === cap.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <span>{cap.icon}</span>
                    <span>{cap.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Capsule Player Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {selectedCapsule.icon}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {selectedCapsule.subject} • {selectedCapsule.level}
                      </span>
                      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {selectedCapsule.title}
                      </h4>
                    </div>
                  </div>

                  {/* Speed Controller */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">Vitesse :</span>
                    {[0.75, 0.9, 1.1].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setSpeechRate(rate);
                          if (isPlaying) {
                            handlePlayCapsule(playbackLanguage);
                          }
                        }}
                        className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          speechRate === rate
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Audio Action Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Play in Wolof */}
                  <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        🇸🇳 Explication en Wolof
                      </span>
                      {isPlaying && playbackLanguage === 'wolof' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-pulse">
                          <Volume2 className="w-4 h-4" /> En lecture...
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                      « {selectedCapsule.summaryWolof} »
                    </p>
                    <button
                      onClick={() => {
                        if (isPlaying && playbackLanguage === 'wolof') {
                          stopAudio();
                        } else {
                          handlePlayCapsule('wolof');
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                    >
                      {isPlaying && playbackLanguage === 'wolof' ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause l'Audio Wolof</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>🔊 Écouter l'Explication en Wolof</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Play in French */}
                  <div className="p-4 rounded-2xl border-2 border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/30 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-indigo-800 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                        🇫🇷 Cours Officiel en Français
                      </span>
                      {isPlaying && playbackLanguage === 'fr' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 animate-pulse">
                          <Volume2 className="w-4 h-4" /> En lecture...
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                      « {selectedCapsule.summaryFr} »
                    </p>
                    <button
                      onClick={() => {
                        if (isPlaying && playbackLanguage === 'fr') {
                          stopAudio();
                        } else {
                          handlePlayCapsule('fr');
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                    >
                      {isPlaying && playbackLanguage === 'fr' ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause le Français</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>🔊 Écouter en Français</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Vocabulary table for this capsule */}
                <div className="pt-2">
                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Mots-clés bilingues de la leçon</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedCapsule.keyVocabulary.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {v.fr}
                          </div>
                          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            → {v.wolof}
                          </div>
                          {v.note && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{v.note}</div>
                          )}
                        </div>
                        <button
                          onClick={() => playText(`${v.fr} en wolof : ${v.wolof}`, 'wolof')}
                          className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                          title="Écouter la prononciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEXIQUE SCOLAIRE */}
          {activeTab === 'dictionary' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchDict}
                    onChange={(e) => setSearchDict(e.target.value)}
                    placeholder="Rechercher un terme scolaire (Maths, SVT, Philosophie, Histoire)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {filteredDictionary.length} termes traduits
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredDictionary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-between group hover:border-indigo-400 transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                        {item.cat}
                      </span>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                        {item.fr}
                      </div>
                      <div className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {item.wolof}
                      </div>
                    </div>

                    <button
                      onClick={() => playText(`${item.fr} : ${item.wolof}`, 'wolof')}
                      className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Écouter la prononciation bilingue"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LECTURE VOCALE LIBRE (TTS) */}
          {activeTab === 'tts' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-bold text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-indigo-600" />
                  <span>Lecteur Audio Haute Définition</span>
                </h4>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
                  Collez ou écrivez n'importe quel texte ou devoir pour l'écouter lu à voix haute avec intonation pédagogique.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Écrivez ou collez ici le texte à lire à voix haute..."
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Vitesse :
                    </span>
                    {[0.8, 1.0, 1.2].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSpeechRate(r)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          speechRate === r
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <button
                        onClick={stopAudio}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                      >
                        <Pause className="w-4 h-4" />
                        <span>Arrêter la lecture</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => playText(customText || "Veuillez saisir un texte à écouter.", customLang)}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                      >
                        <Play className="w-4 h-4" />
                        <span>🔊 Lancer la lecture vocale</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>🇸🇳 Conforme aux directives d'apprentissage bilingue au Sénégal.</span>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer self-end sm:self-auto"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
