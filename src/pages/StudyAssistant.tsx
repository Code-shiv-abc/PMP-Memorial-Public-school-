import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MemoizedMarkdown = React.memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="font-serif text-[#D4AF37] font-semibold mt-2">{children}</h1>,
        h2: ({ children }) => <h2 className="font-serif text-[#D4AF37] font-semibold mt-2">{children}</h2>,
        h3: ({ children }) => <h3 className="font-serif text-[#D4AF37] font-semibold mt-2">{children}</h3>,
        p: ({ children }) => <p className="leading-relaxed my-2">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        ul: ({ children }) => <ul className="pl-6 list-disc my-1">{children}</ul>,
        ol: ({ children }) => <ol className="pl-6 list-decimal my-1">{children}</ol>,
        hr: () => <hr className="border-[#D4AF37]/20 my-2" />,
        pre: ({ children }) => <pre className="bg-black/30 rounded overflow-x-auto p-2 my-2">{children}</pre>,
        code: ({ children }) => <code className="bg-black/30 rounded px-1">{children}</code>
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

const SCHOOL_CLASSES = [
  'PG – Class 2 (English Medium)',
  'Class 3 – 5 (Hindi / English Medium)',
  'Class 6 – 8 (Hindi / English Medium)',
  'Class 9 – 10 (UP Board / NCERT)',
  'Class 11 – 12 (UP Board / NCERT)',
];

const SCHOOL_SUBJECTS = [
  'Mathematics (गणित)',
  'Science (विज्ञान)',
  'English Grammar & Literature',
  'Hindi & Sanskrit (हिंदी एवं संस्कृत)',
  'Social Science (सामाजिक विज्ञान)',
  'Computer Education (कंप्यूटर शिक्षा)',
];

const STARTER_PROMPTS = [
  'मुझे प्रकाश का परावर्तन सरल हिंदी में समझाएं।',
  'Give me 5 practice questions on Fractions with solutions.',
  'Explain Computer parts in Hindi and English.',
  'Help me write an application to the Principal.',
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function StudyAssistant() {
  const [selectedClass, setSelectedClass] = useState(SCHOOL_CLASSES[3]);
  const [selectedSubject, setSelectedSubject] = useState(SCHOOL_SUBJECTS[1]);
  const [languageMode, setLanguageMode] = useState<'Bilingual' | 'Hindi' | 'English'>('Bilingual');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = async (promptText?: string) => {
    const query = (promptText ?? input).trim();
    if (!query || loading) return;

    setErrorMsg(null);
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: query }
    ];
    setMessages(updatedMessages);
    if (!promptText) setInput('');
    setLoading(true);

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to connect. Please try again.');
      }

      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white space-y-6">
      <div className="flex flex-col gap-6 border-b border-neutral-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-serif text-[#D4AF37]">
                विद्या
              </h1>
              <span className="text-xl text-neutral-200 font-medium">Vidya AI</span>
              <div className="flex items-center gap-1.5 ml-2 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-400 font-medium tracking-wide">Online</span>
              </div>
            </div>
            <p className="text-neutral-400 mt-2 font-medium">
              आपकी अध्ययन सहायक
            </p>
          </div>

          <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800" role="radiogroup" aria-label="Language Mode">
            {(['Hindi', 'Bilingual', 'English'] as const).map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={languageMode === mode}
                onClick={() => setLanguageMode(mode)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  languageMode === mode
                    ? 'bg-[#D4AF37] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {mode === 'Hindi' ? 'Hindi' : mode === 'Bilingual' ? 'Bilingual' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold whitespace-nowrap mr-2">Class</span>
            {SCHOOL_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedClass === cls
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold whitespace-nowrap mr-2">Subject</span>
            {SCHOOL_SUBJECTS.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors border ${
                  selectedSubject === sub
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[calc(100dvh-300px)] lg:min-h-[600px] overflow-y-auto space-y-6 pb-20 scroll-smooth" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 mt-8">
            <div className="text-center space-y-3 max-w-2xl px-4">
              <p className="text-lg text-neutral-200">
                नमस्ते! मैं विद्या हूँ, आपकी AI अध्ययन सहायक।
              </p>
              <p className="text-neutral-400">
                Hi, I'm Vidya, your study partner at PMP Memorial.
              </p>
              <p className="text-neutral-400">
                अपनी कक्षा और विषय चुनें, फिर हिंदी या English में कोई भी सवाल पूछें।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl px-4">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="text-left text-sm bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-[#D4AF37]/50 rounded-xl p-4 text-neutral-300 transition-colors group flex flex-col gap-2"
                >
                  <span className="text-[#D4AF37] text-xs font-medium uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">Starter</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] md:max-w-2xl ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4AF37] font-serif text-sm">वि</span>
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-[#D4AF37] text-black font-medium rounded-br-sm whitespace-pre-wrap'
                      : 'bg-[#1a1a2e] text-neutral-100 border border-[#D4AF37]/20 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <MemoizedMarkdown content={m.content} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-end gap-2 max-w-2xl justify-start">
            <div className="w-8 h-8 rounded-full bg-[#1a1a2e] border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#D4AF37] font-serif text-sm">वि</span>
            </div>
            <div className="p-4 rounded-2xl rounded-bl-sm bg-[#1a1a2e] border border-[#D4AF37]/20 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-[#D4AF37] animate-pulse font-medium">Preparing your explanation...</span>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 mx-auto max-w-2xl w-full rounded-xl bg-red-950/30 border border-red-900/50 text-red-200/90 text-sm text-center">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F1115] via-[#0F1115] to-transparent pointer-events-none md:static md:p-0 md:bg-none z-10">
        <div className="max-w-5xl mx-auto pointer-events-auto w-full max-w-[100vw] overflow-x-hidden md:overflow-visible">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-end gap-2 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700 rounded-2xl p-2 shadow-2xl focus-within:ring-1 focus-within:ring-[#D4AF37]/50 focus-within:border-[#D4AF37]/50 transition-all w-full min-w-0"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask any question in Hindi or English..."
              className="flex-1 bg-transparent border-none resize-none px-3 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-0 min-h-[48px] max-h-[200px] overflow-y-auto scrollbar-none min-w-0"
              rows={1}
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="bg-[#D4AF37] hover:bg-[#b5952f] disabled:opacity-40 disabled:hover:bg-[#D4AF37] text-black w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 mb-1 mr-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 ml-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudyAssistant;
