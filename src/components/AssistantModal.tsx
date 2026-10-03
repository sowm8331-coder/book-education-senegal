import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SchoolLevel } from '../types';
import { findOfflineAnswer } from '../data/offlineKnowledge';
import { X, Send, Sparkles, Bot, User, Copy, Check, RotateCcw, HelpCircle } from 'lucide-react';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLevel?: string;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  activeLevel = 'Général'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Bonjour ! Je suis votre Assistant Pédagogique pour Book Education Sénégal. 🤖🇸🇳\n\nJe suis là pour vous aider du CI à la Terminale :\n• Expliquer des théorèmes et formules (Pythagore, Thalès, dérivées)\n• Résoudre pas-à-pas des équations ou problèmes d'arithmétique\n• Éclaircir les règles de grammaire, conjugaison et dictée\n• Vous préparer aux examens officiels : CFEE, BFEM et BACCALAURÉAT.\n\nQuelle question souhaitez-vous me poser ?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Comment résoudre une équation du premier degré ?',
        'Quelle est la différence entre un nom et un verbe ?',
        'Explique-moi la photosynthèse',
        'Conseils pour réussir le BFEM et le Bac'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>(activeLevel);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Try server-side Gemini API proxy
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          level: selectedLevel,
          subject: 'Éducation Sénégal'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response && !data.fallback) {
          const aiMsg: ChatMessage = {
            id: 'ai_' + Date.now(),
            sender: 'assistant',
            text: data.response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedFollowUps: [
              'Donne-moi un exemple concret',
              'Comment rédiger cela dans un devoir ?',
              'Quels sont les pièges à éviter ?'
            ]
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      }

      // 2. Fallback to rich offline Senegalese knowledge engine
      const fallbackData = findOfflineAnswer(text);
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'assistant',
          text: fallbackData.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: fallbackData.followUps
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 500);

    } catch (err) {
      // Graceful fallback on network or server error
      const fallbackData = findOfflineAnswer(text);
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'assistant',
        text: fallbackData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: fallbackData.followUps
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        text: `Discussion réinitialisée ! Comment puis-je vous aider pour vos cours ou devoirs ? 📚`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: [
          'Comment résoudre une équation du premier degré ?',
          'Règles d’accord du participe passé',
          'Explique-moi le théorème de Thalès'
        ]
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed bottom-4 right-4 z-50 w-full sm:w-[440px] max-w-[calc(100vw-32px)] h-[620px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      {/* Modal Top Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl shadow-inner">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Assistant Pédagogique
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
            <p className="text-[11px] text-white/80">
              Programme du Sénégal (CI à Terminale 🇸🇳)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Effacer la conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Target Level Bar */}
      <div className="bg-indigo-50/80 border-b border-indigo-100 px-4 py-2 flex items-center justify-between text-xs">
        <span className="font-medium text-indigo-950 flex items-center gap-1">
          <span>🎯 Niveau visé :</span>
        </span>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-white border border-indigo-200 text-indigo-900 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="Général">Tous niveaux</option>
          <option value="CI / CP / Élémentaire">Élémentaire (CI - CM2)</option>
          <option value="CM2 - CFEE">CM2 (Préparation CFEE)</option>
          <option value="6e / 5e / 4e">Collège (6e, 5e, 4e)</option>
          <option value="3e - BFEM">3ème (Préparation BFEM)</option>
          <option value="Seconde S / L">Seconde</option>
          <option value="Première S / L">Première</option>
          <option value="Terminale S (Bac Scientifique)">Terminale S (Bac S)</option>
          <option value="Terminale L (Bac Littéraire)">Terminale L (Bac L)</option>
        </select>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>

            {/* Bubble Footer & Actions */}
            <div className="flex items-center gap-2 mt-1 px-1">
              <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.id, msg.text)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Copier l'explication"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>

            {/* Suggested Follow-ups */}
            {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-1.5 w-full max-w-[90%]">
                {msg.suggestedFollowUps.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="text-left text-xs bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium hover:translate-x-1"
                  >
                    💡 {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-3.5 max-w-[70%] shadow-xs">
            <Bot className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium animate-pulse">
              L'assistant analyse votre question...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Posez votre question (ex: théorème de Thalès, Lat-Dior, racine carrée)..."
          className="flex-1 bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
          title="Envoyer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
