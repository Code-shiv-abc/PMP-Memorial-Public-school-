import React, { useState, useRef, useEffect, memo } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, Languages, GraduationCap, Trash2, Zap, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  cached?: boolean;
}

const SCHOOL_CLASSES = [
  'Class 1 - 2 (Primary)',
  'Class 3 - 5 (Primary)',
  'Class 6 - 8 (Junior / Middle)',
  'Class 9 - 10 (UP Board / NCERT)',
  'Class 11 - 12 (Intermediate)'
];

const SUBJECTS = [
  'Mathematics (गणित)',
  'Science (विज्ञान)',
  'Hindi (हिंदी)',
  'English (अंग्रेजी)',
  'Social Science (सामाजिक विज्ञान)',
  'Sanskrit (संस्कृत)',
  'Computer Education (कंप्यूटर)',
  'General Knowledge (सामान्य ज्ञान)'
];

const LANGUAGE_MODES = [
  'Bilingual (Hindi + English)',
  'Simple Hindi (सरल हिंदी)',
  'Simple English'
];

const STARTER_PROMPTS = [
  'Explain Photosynthesis in simple Hindi and English',
  'Solve: 2x + 5 = 15 step by step',
  'What is Newton’s First Law of Motion? उदाहरण सहित समझाएं',
  'Write a short application to the Principal for 2 days sick leave'
];

const QUICK_FOLLOW_UPS = [
  'उदाहरण सहित समझाएं (Give an example)',
  'और सरल हिंदी में बताएं (Explain in simpler Hindi)',
  'मुझसे 2 अभ्यास प्रश्न पूछें (Ask me 2 practice questions)'
];

const SESSION_CACHE_KEY = 'vidya_ai_answer_cache_v1';

function getClientCache(key: string): string | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, string>;
    return map[key] || null;
  } catch {
    return null;
  }
}

function setClientCache(key: string, reply: string) {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    const keys = Object.keys(map);
    if (keys.length > 40) delete map[keys[0]];
    map[key] = reply;
    sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

const MemoizedMarkdown = memo(({ text }: { text: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-neutral-200">{children}</li>,
        h1: ({ children }) => <h1 className="text-lg font-serif font-bold text-amber-500 mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-serif font-bold text-amber-400 mt-3 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-serif font-bold text-amber-300 mt-2 mb-1">{children}</h3>,
        code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !String(children).includes('\n');
          return isInline ? (
            <code className="bg-neutral-950 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono border border-neutral-800" {...props}>
              {children}
            </code>
          ) : (
            <pre className="bg-neutral-950 p-3 rounded-xl overflow-x-auto border border-neutral-800 my-3">
              <code className="text-xs font-mono text-neutral-200" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-amber-500 pl-3 italic text-neutral-400 my-2">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className="min-w-full border-collapse border border-neutral-800 text-xs">{children}</table>
          </div>
        ),
        th: ({ children }) => <th className="border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-left font-serif font-semibold text-amber-400">{children}</th>,
        td: ({ children }) => <td className="border border-neutral-800 px-3 py-1.5 text-neutral-300">{children}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default function StudyAssistant() {
  const { t } = useLanguage();
  const [selectedClass, setSelectedClass] = useState(SCHOOL_CLASSES[3]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[1]);
  const [languageMode, setLanguageMode] = useState(LANGUAGE_MODES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSend = async (promptText?: string) => {
    const query = (promptText ?? input).trim();
    if (!query || isLoading || cooldown) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    // Capture last 4 messages BEFORE appending the new message for compact follow-up context
    const recentHistory = messages.slice(-4).map((m) => ({
      role: m.role,
      text: m.text
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');

    // Check Browser Session Cache first (0 API Calls / 0 RPM if already asked in this session)
    const lastContext = recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].text.slice(0, 60) : '';
    const clientCacheKey = `${selectedClass}|${selectedSubject}|${languageMode}|${lastContext}|${query.toLowerCase()}`;
    const cachedReply = getClientCache(clientCacheKey);

    if (cachedReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: cachedReply,
          cached: true
        }
      ]);
      return;
    }

    setIsLoading(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 2500); // 2.5s cooldown prevents rapid double-click RPM drain

    try {
      const response = await fetch('/api/study-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          selectedClass,
          selectedSubject,
          languageMode,
          history: recentHistory
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      if (data.reply) {
        setClientCache(clientCacheKey, data.reply);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.reply || 'Sorry, I could not generate an answer. Please try again.',
        cached: Boolean(data.cached)
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: unknown) {
      console.error('Gemini API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'The AI is unavailable right now. Please contact 9792954343.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: `⚠️ **सूचना (Notice):** ${errorMessage}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-7rem)] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 sm:px-6 bg-neutral-950 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold text-white tracking-tight">{t('studyAssistantTitle')}</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                PMP Scholar
              </span>
            </div>
            <p className="text-xs text-neutral-300">{t('studyAssistantDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              aria-label="Clear chat history"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('clearChat') || 'Clear Chat'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Context Selectors */}
      <div className="p-3 sm:px-6 bg-neutral-900/90 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
          <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
          <label htmlFor="vidya-class-select" className="text-neutral-300 shrink-0">{t('class')}:</label>
          <select
            id="vidya-class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-transparent text-neutral-100 font-medium focus:outline-none w-full truncate"
          >
            {SCHOOL_CLASSES.map((c) => (
              <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <label htmlFor="vidya-subject-select" className="text-neutral-300 shrink-0">{t('subject')}:</label>
          <select
            id="vidya-subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-transparent text-neutral-100 font-medium focus:outline-none w-full truncate"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
          <Languages className="w-4 h-4 text-amber-400 shrink-0" />
          <label htmlFor="vidya-lang-select" className="text-neutral-300 shrink-0">{t('medium')}:</label>
          <select
            id="vidya-lang-select"
            value={languageMode}
            onChange={(e) => setLanguageMode(e.target.value)}
            className="bg-transparent text-neutral-100 font-medium focus:outline-none w-full truncate"
          >
            {LANGUAGE_MODES.map((l) => (
              <option key={l} value={l} className="bg-neutral-900 text-white">{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif font-bold text-white mb-1" lang="hi">
              नमस्ते! मैं विद्या (Vidya AI) हूँ
            </h2>
            <p className="text-sm text-neutral-300 mb-6">
              Your personal study assistant for P.M.P. Memorial Public School. Ask any question from your {selectedSubject} syllabus in Hindi or English!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/40 text-xs text-neutral-200 transition-all flex items-start gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1 && !isLoading;
            return (
              <div key={msg.id} className="space-y-2">
                <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-br-none'
                        : 'bg-neutral-800/90 text-neutral-100 border border-neutral-700/70 rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' && msg.cached && (
                      <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mb-2">
                        <Zap className="w-3 h-3" />
                        <span>Instant Cache</span>
                      </div>
                    )}
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <div className="markdown-body">
                        <MemoizedMarkdown text={msg.text} />
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* One-Tap Follow-Up Chips below the latest AI answer */}
                {isLastAssistant && (
                  <div className="pl-11 flex flex-wrap gap-2 pt-1">
                    {QUICK_FOLLOW_UPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-neutral-950 hover:bg-amber-500/15 text-neutral-300 hover:text-amber-300 border border-neutral-800 hover:border-amber-500/40 transition-colors"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-400" />
                        <span>{chip}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Vidya AI उत्तर तैयार कर रही है...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:px-6 bg-neutral-950 border-t border-neutral-800 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-5xl mx-auto"
        >
          <textarea
            aria-label="Ask a study question in Hindi or English"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('askPlaceholder')}
            className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:outline-none resize-none"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!input.trim() || isLoading || cooldown}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-neutral-950 font-serif font-semibold text-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('askButton')}</span>
          </button>
        </form>
        <p className="text-[11px] text-neutral-400 text-center mt-2">
          Vidya AI remembers your last 4 messages for follow-up questions • Smart Caching Enabled
        </p>
      </div>
    </div>
  );
}
