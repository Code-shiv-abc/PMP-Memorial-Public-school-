import React, { useState, useRef, useEffect, memo } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  BookOpen,
  GraduationCap,
  Trash2,
  Zap,
  HelpCircle,
  Globe,
  Copy,
  Check,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
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
  'Computer (कंप्यूटर)',
  'GK (सामान्य ज्ञान)'
];

const LANGUAGE_MODES = [
  { id: 'Bilingual (Hindi + English)', labelEn: 'Bilingual (द्विभाषी)', labelHi: 'द्विभाषी (Hindi + Eng)' },
  { id: 'Simple Hindi (सरल हिंदी)', labelEn: 'Hindi Only (हिंदी)', labelHi: 'केवल सरल हिंदी' },
  { id: 'Simple English', labelEn: 'English Only', labelHi: 'केवल अंग्रेजी (English)' }
];

const STARTER_PROMPTS = [
  {
    en: 'All Trigonometry Formulas (Class 10 Math)',
    hi: 'त्रिकोणमिति (Trigonometry) के सभी मुख्य सूत्र बताएं',
    query: 'Write all important Class 10 Trigonometry identities and formulas clearly in Hindi and English'
  },
  {
    en: 'Explain Photosynthesis with chemical equation',
    hi: 'प्रकाश संश्लेषण (Photosynthesis) को समीकरण सहित समझाएं',
    query: 'Explain Photosynthesis in simple Hindi and English'
  },
  {
    en: 'Solve: 2x + 5 = 15 step by step',
    hi: 'समीकरण हल करें: 2x + 5 = 15 (चरणबद्ध तरीके से)',
    query: 'Solve: 2x + 5 = 15 step by step'
  },
  {
    en: 'Newton’s First Law of Motion with examples',
    hi: 'न्यूटन का गति का प्रथम नियम उदाहरण सहित समझाएं',
    query: 'What is Newton’s First Law of Motion? उदाहरण सहित समझाएं'
  }
];

const QUICK_FOLLOW_UPS = [
  {
    en: 'Give an example',
    hi: 'उदाहरण दें',
    queryHi: 'कृपया इसका एक सरल उदाहरण या हल किया हुआ प्रश्न दिखाएं।',
    queryEn: 'Please show a simple solved example for this.'
  },
  {
    en: 'Explain in simpler Hindi',
    hi: 'सरल हिंदी में',
    queryHi: 'इसे और अधिक सरल हिंदी बिंदुओं में समझाएं।',
    queryEn: 'Explain this in simpler bilingual bullet points.'
  },
  {
    en: '2 Practice Questions',
    hi: '2 अभ्यास प्रश्न',
    queryHi: 'इस विषय से बोर्ड परीक्षा के लिए 2 महत्वपूर्ण अभ्यास प्रश्न पूछें।',
    queryEn: 'Give me 2 board exam practice questions on this topic.'
  }
];

const SESSION_CACHE_KEY = 'vidya_ai_answer_cache_v3';

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ'
};

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};

function toSuper(str: string): string {
  return str.split('').map((c) => SUPERSCRIPTS[c] || c).join('');
}

function toSub(str: string): string {
  return str.split('').map((c) => SUBSCRIPTS[c] || c).join('');
}

/**
 * Built-in Zero-Dependency LaTeX & Scientific Formula Formatter
 * Converts raw $\sin^2\theta$, \frac{a}{b}, $H_2O$, and $$...$$ blocks into clean textbook typography.
 */
function cleanLatexSegment(raw: string): string {
  let s = raw;

  // Annotated arrows: \xrightarrow{\text{Sunlight}} -> ──[Sunlight]──►
  s = s.replace(/\\xrightarrow\{\\text\{([^}]*)\}\}/g, ' ──[$1]──► ');
  s = s.replace(/\\xrightarrow\{([^}]*)\}/g, ' ──[$1]──► ');

  // Remove \text{...}, \mathrm{...}, \mathbf{...}
  s = s.replace(/\\(?:text|mathrm|mathbf|bf)\{([^}]*)\}/g, '$1');

  // Fractions: \frac{a}{b} -> (a)/(b) or a/b
  s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_, num, den) => {
    const n = num.trim();
    const d = den.trim();
    const nWrap = n.length > 2 && /[+\-]/.test(n) ? `(${n})` : n;
    const dWrap = d.length > 2 && /[+\-]/.test(d) ? `(${d})` : d;
    return `${nWrap} / ${dWrap}`;
  });

  // Square roots: \sqrt{x} -> √(x)
  s = s.replace(/\\sqrt\{([^{}]+)\}/g, (_, inner) => (inner.length === 1 ? `√${inner}` : `√(${inner})`));

  // Standard trig & math functions (fixes "\ cosec" with space too)
  s = s.replace(/\\\s*(sin|cos|tan|cot|sec|cosec|csc|log|ln|lim|max|min)\b/g, '$1');

  // Greek letters & math symbols
  const symbolMap: Array<[RegExp, string]> = [
    [/\\theta\b/g, 'θ'],
    [/\\alpha\b/g, 'α'],
    [/\\beta\b/g, 'β'],
    [/\\gamma\b/g, 'γ'],
    [/\\delta\b/g, 'δ'],
    [/\\Delta\b/g, 'Δ'],
    [/\\pi\b/g, 'π'],
    [/\\lambda\b/g, 'λ'],
    [/\\mu\b/g, 'μ'],
    [/\\omega\b/g, 'ω'],
    [/\\Omega\b/g, 'Ω'],
    [/\\sigma\b/g, 'σ'],
    [/\\phi\b/g, 'φ'],
    [/\\infty\b/g, '∞'],
    [/\\times\b/g, '×'],
    [/\\div\b/g, '÷'],
    [/\\pm\b/g, '±'],
    [/\\cdot\b/g, '·'],
    [/\\leq?\b/g, '≤'],
    [/\\geq?\b/g, '≥'],
    [/\\neq?\b/g, '≠'],
    [/\\approx\b/g, '≈'],
    [/\\equiv\b/g, '≡'],
    [/\\rightarrow\b|\\to\b/g, ' → '],
    [/\\leftarrow\b/g, ' ← '],
    [/\\Rightarrow\b/g, ' ⇒ '],
    [/\\Leftrightarrow\b/g, ' ⇔ '],
    [/\\uparrow\b/g, '↑'],
    [/\\downarrow\b/g, '↓'],
    [/\\degree\b|\\circ\b/g, '°'],
    [/\\triangle\b/g, '△'],
    [/\\angle\b/g, '∠'],
    [/\\perp\b/g, '⊥'],
    [/\\parallel\b/g, '∥'],
    [/\\therefore\b/g, '∴'],
    [/\\because\b/g, '∵'],
    [/\\left\(/g, '('],
    [/\\right\)/g, ')'],
    [/\\left\[/g, '['],
    [/\\right\]/g, ']'],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\quad\b/g, '  ']
  ];

  for (const [regex, replacement] of symbolMap) {
    s = s.replace(regex, replacement);
  }

  // Superscripts: ^{2x} or ^2
  s = s.replace(/\^\{([0-9+\-=()nxy]+)\}/g, (_, exp) => toSuper(exp));
  s = s.replace(/\^([0-9+\-nxy])/g, (_, exp) => toSuper(exp));

  // Subscripts: _{12} or _2 (e.g., H_2O -> H₂O, CO_2 -> CO₂)
  s = s.replace(/_\{([0-9+\-=()]+)\}/g, (_, sub) => toSub(sub));
  s = s.replace(/_([0-9])/g, (_, sub) => toSub(sub));

  // Clean stray braces
  s = s.replace(/\{([^{}]+)\}/g, '$1');

  return s.replace(/\s{2,}/g, ' ').trim();
}

function formatMathAndScience(markdown: string): string {
  if (!markdown) return '';
  let out = markdown;

  // 1. Convert Display Equation Blocks $$ ... $$ into highlighted code blocks (`math-block`)
  out = out.replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => {
    const cleaned = cleanLatexSegment(eq);
    return `\n\n\`\`\`math-formula\n${cleaned}\n\`\`\`\n\n`;
  });

  // 2. Convert Inline Math $ ... $ into bold highlighted inline formula
  out = out.replace(/\$([^$\n]+)\$/g, (_, eq) => {
    const cleaned = cleanLatexSegment(eq);
    return `\`MATH:${cleaned}\``;
  });

  // 3. Catch any remaining bare LaTeX commands outside $...$ (e.g. \theta, \sin^2)
  if (/\\(theta|sin|cos|tan|cot|sec|cosec|frac|sqrt|times|div|rightarrow|alpha|beta|pi)/.test(out)) {
    out = cleanLatexSegment(out);
  }

  return out;
}

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
  const formattedText = formatMathAndScience(text);

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 text-[15px] sm:text-base leading-[1.8] text-neutral-100">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3.5 space-y-2 text-[15px] sm:text-base leading-[1.75] text-neutral-100">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3.5 space-y-2 text-[15px] sm:text-base leading-[1.75] text-neutral-100">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-neutral-100 pl-0.5">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-amber-300">{children}</strong>,
        h1: ({ children }) => (
          <h1 className="text-base sm:text-lg font-serif font-bold text-amber-400 mt-4 mb-2 pb-1 border-b border-neutral-800">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[15px] sm:text-base font-serif font-bold text-amber-400 mt-3.5 mb-1.5">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm sm:text-[15px] font-serif font-bold text-amber-300 mt-3 mb-1">
            {children}
          </h3>
        ),
        code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
          const rawContent = String(children).replace(/\n$/, '');

          // Render block-level formulas in a golden textbook formula card
          if (className?.includes('language-math-formula')) {
            return (
              <div className="my-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-serif text-base sm:text-lg font-semibold tracking-wide text-center overflow-x-auto shadow-sm">
                {rawContent}
              </div>
            );
          }

          // Render inline math formulas cleanly in warm gold pill
          if (rawContent.startsWith('MATH:')) {
            const formula = rawContent.slice(5);
            return (
              <span className="inline-block bg-amber-500/15 text-amber-200 border border-amber-500/30 px-2 py-0.5 mx-0.5 rounded-md font-serif font-semibold text-[15px] sm:text-base tracking-wide">
                {formula}
              </span>
            );
          }

          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !rawContent.includes('\n');
          return isInline ? (
            <code
              className="bg-neutral-950 text-amber-300 px-1.5 py-0.5 rounded text-sm font-mono border border-neutral-800"
              {...props}
            >
              {children}
            </code>
          ) : (
            <pre className="bg-neutral-950 p-3.5 rounded-xl overflow-x-auto border border-neutral-800 my-3">
              <code className="text-xs sm:text-sm font-mono text-neutral-100 leading-relaxed" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-amber-500 bg-amber-500/5 px-3.5 py-2 rounded-r-lg italic text-neutral-200 my-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {formattedText}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default function StudyAssistant() {
  const { language, setLanguage, t } = useLanguage();
  const isHi = language === 'hi';

  const [selectedClass, setSelectedClass] = useState(SCHOOL_CLASSES[3]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [languageMode, setLanguageMode] = useState(LANGUAGE_MODES[0].id);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
  }, [input]);

  const handleToggleLanguage = () => {
    const nextLang = isHi ? 'en' : 'hi';
    setLanguage(nextLang);
    if (nextLang === 'hi') {
      setLanguageMode('Simple Hindi (सरल हिंदी)');
    } else {
      setLanguageMode('Bilingual (Hindi + English)');
    }
  };

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([]);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      const clean = formatMathAndScience(text).replace(/`MATH:([^`]+)`/g, '$1').replace(/```math-formula\n([\s\S]*?)\n```/g, '$1');
      await navigator.clipboard.writeText(clean);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard fallback
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = formatMathAndScience(text).replace(/`MATH:([^`]+)`/g, '$1').replace(/[#*`_~>-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = /[\u0900-\u097F]/.test(cleanText) ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (promptText?: string) => {
    const query = (promptText ?? input).trim();
    if (!query || isLoading || cooldown) return;

    setMobileFiltersOpen(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query
    };

    const recentHistory = messages.slice(-4).map((m) => ({
      role: m.role,
      text: m.text
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) {
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }

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
    setTimeout(() => setCooldown(false), 2000);

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
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'The AI is unavailable right now. Please contact 9792954343.';
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

  const shortClassLabel = selectedClass.split('(')[0].trim();
  const shortSubjectLabel = selectedSubject.split('(')[0].trim();

  return (
    /* Full-bleed edge-to-edge on mobile (-mx-4 -my-4), framed card on tablet/laptop */
    <div className="-mx-4 -my-4 sm:mx-auto sm:my-0 w-[calc(100%+2rem)] sm:w-full max-w-5xl flex flex-col h-[calc(100dvh-4rem)] sm:h-[calc(100vh-5.5rem)] bg-[#111318] sm:border border-neutral-800/90 sm:rounded-2xl overflow-hidden shadow-2xl">
      {/* 1. Single-Row Mobile & Desktop Top Header */}
      <div className="px-3 sm:px-5 py-2 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-sm sm:text-base font-serif font-bold text-white truncate">
            {isHi ? 'विद्या AI' : 'Vidya AI'}
          </h1>

          {/* Mobile Compact Context Pill (Opens drawer only when tapped) */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900 border border-neutral-700 text-[11px] text-amber-300 font-medium truncate max-w-[155px]"
          >
            <SlidersHorizontal className="w-3 h-3 shrink-0" />
            <span className="truncate">{shortClassLabel} • {shortSubjectLabel}</span>
            {mobileFiltersOpen ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
          </button>
        </div>

        {/* Desktop Inline Selectors (Hidden on Mobile to save vertical space) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1 text-xs">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              aria-label="Select Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-neutral-100 font-medium focus:outline-none max-w-[140px] truncate cursor-pointer"
            >
              {SCHOOL_CLASSES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              aria-label="Select Subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-neutral-100 font-medium focus:outline-none max-w-[135px] truncate cursor-pointer"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/80 rounded-lg px-2.5 py-1 text-xs">
            <select
              aria-label="Answer Language"
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="bg-transparent text-amber-300 font-medium focus:outline-none max-w-[140px] truncate cursor-pointer"
            >
              {LANGUAGE_MODES.map((m) => (
                <option key={m.id} value={m.id} className="bg-neutral-900 text-white">
                  {isHi ? m.labelHi : m.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Action Buttons (Always visible on both Mobile & Desktop) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleLanguage}
            aria-label={isHi ? 'Switch to English' : 'हिंदी में बदलें'}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-amber-500/40 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isHi ? 'EN' : 'हिंदी'}</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              aria-label={t('clearChat')}
              title={t('clearChat')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-red-950/60 text-neutral-300 hover:text-red-300 border border-neutral-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('clearChat')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Mobile Filter Drawer (Only visible when student taps the Class/Subject pill) */}
      {mobileFiltersOpen && (
        <div className="md:hidden px-3 py-2.5 bg-neutral-900 border-b border-neutral-800 grid grid-cols-1 gap-2 text-xs shrink-0">
          <div className="flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
            <span className="text-neutral-400">{isHi ? 'कक्षा:' : 'Class:'}</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none text-right"
            >
              {SCHOOL_CLASSES.map((c) => (
                <option key={c} value={c} className="bg-neutral-900 text-white">{c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
            <span className="text-neutral-400">{isHi ? 'विषय:' : 'Subject:'}</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none text-right"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-neutral-900 text-white">{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
            <span className="text-neutral-400">{isHi ? 'उत्तर की भाषा:' : 'Language:'}</span>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="bg-transparent text-amber-300 font-medium focus:outline-none text-right"
            >
              {LANGUAGE_MODES.map((m) => (
                <option key={m.id} value={m.id} className="bg-neutral-900 text-white">
                  {isHi ? m.labelHi : m.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 2. Spacious Full-Width Chat & Formula Reading Stream */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Vidya AI conversation messages"
        className="flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6 space-y-5"
      >
        {messages.length === 0 ? (
          <div className="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-white mb-1.5" lang="hi">
              {isHi
                ? 'नमस्ते! मैं विद्या (Vidya AI) हूँ'
                : 'नमस्ते! Ask Vidya AI Anything From Your Syllabus'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-5 max-w-md leading-relaxed">
              {isHi
                ? `${shortClassLabel} • ${shortSubjectLabel} का कोई भी सूत्र, प्रश्न या अध्याय नीचे चुनें:`
                : `Tap a starter topic below or ask any ${shortSubjectLabel} question:`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {STARTER_PROMPTS.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => handleSend(item.query)}
                  className="p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-xs sm:text-sm text-neutral-100 transition-all flex items-start gap-2.5 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-snug">{isHi ? item.hi : item.en}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-5">
            {messages.map((msg, idx) => {
              const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1 && !isLoading;
              return (
                <div key={msg.id} className="space-y-2.5">
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tr-sm bg-amber-500 text-neutral-950 font-medium px-3.5 py-2.5 text-sm sm:text-base leading-relaxed shadow-md whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    /* Full-Width Smartphone & Desktop Study Card */
                    <div className="rounded-2xl bg-neutral-900/95 border border-neutral-800 p-3.5 sm:p-6 shadow-lg">
                      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-neutral-800/80">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-serif font-bold text-amber-400 truncate">
                            Vidya AI • {shortSubjectLabel}
                          </span>
                          {msg.cached && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              <Zap className="w-2.5 h-2.5" />
                              <span>Instant</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            aria-label={speakingId === msg.id ? 'Stop reading aloud' : 'Read answer aloud'}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                          >
                            {speakingId === msg.id ? (
                              <>
                                <VolumeX className="w-3 h-3 text-amber-400" />
                                <span>{isHi ? 'रोकें' : 'Stop'}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3 text-amber-400" />
                                <span>{isHi ? 'सुनें' : 'Listen'}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            aria-label="Copy answer text"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{isHi ? 'कॉपी' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{isHi ? 'कॉपी' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="markdown-body select-text">
                        <MemoizedMarkdown text={msg.text} />
                      </div>
                    </div>
                  )}

                  {isLastAssistant && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {QUICK_FOLLOW_UPS.map((chip) => (
                        <button
                          key={chip.en}
                          type="button"
                          onClick={() => handleSend(isHi ? chip.queryHi : chip.queryEn)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-neutral-950 hover:bg-amber-500/15 text-neutral-200 hover:text-amber-300 border border-neutral-800 hover:border-amber-500/40 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isHi ? chip.hi : chip.en}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 flex items-center gap-3 text-xs sm:text-sm text-neutral-200">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-medium">
                  {isHi ? 'विद्या AI उत्तर लिख रही है...' : 'Vidya AI is writing your explanation...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Sleek Mobile-First Composer */}
      <div className="px-2.5 sm:px-6 py-2.5 bg-neutral-950 border-t border-neutral-800 pb-[max(0.5rem,env(safe-area-inset-bottom))] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2 max-w-3xl mx-auto"
        >
          <textarea
            ref={textareaRef}
            aria-label={isHi ? 'अपना प्रश्न यहाँ लिखें' : 'Ask a study question in Hindi or English'}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isHi
                ? `${shortSubjectLabel} का कोई भी प्रश्न या सूत्र पूछें...`
                : `Ask any ${shortSubjectLabel} question or formula...`
            }
            className="flex-1 bg-neutral-900 border border-neutral-700/90 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-[15px] sm:text-base text-white placeholder-neutral-400 focus:outline-none resize-none leading-snug max-h-28 overflow-y-auto"
          />
          <button
            type="submit"
            aria-label={t('send')}
            disabled={!input.trim() || isLoading || cooldown}
            className="h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-neutral-950 font-serif font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('send')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
