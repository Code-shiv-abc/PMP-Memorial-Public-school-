import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'नमस्ते! Welcome to PMP Memorial Public School AI Study Assistant. Select your class and subject above and ask any question in Hindi or English!',
    },
  ]);

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
      const apiKey =
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        import.meta.env?.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('AI service not configured. Contact: 9792954343');
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the official bilingual AI Study Tutor for PMP Memorial Public School in Shahpur, Gonda, Uttar Pradesh.
Student Class: ${selectedClass}
Subject: ${selectedSubject}
Language: ${languageMode}
Follow NCERT and UP Board curriculum. Give simple numbered explanations suitable for school students.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: { systemInstruction, temperature: 0.4 },
      });

      const reply = response.text || 'Please try rephrasing your question.';
      setMessages([...updatedMessages, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to connect. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-serif text-[#D4AF37]">
            AI Study Assistant
          </h1>
          <p className="text-sm text-neutral-400">
            NCERT & UP Board Bilingual Tutor — PMP Memorial Public School
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white"
          >
            {SCHOOL_CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white"
          >
            {SCHOOL_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <select
            value={languageMode}
            onChange={(e) => setLanguageMode(e.target.value as 'Bilingual' | 'Hindi' | 'English')}
            className="bg-neutral-900 border border-[#D4AF37]/50 rounded px-3 py-1.5 text-sm text-[#D4AF37]"
          >
            <option value="Bilingual">Bilingual</option>
            <option value="Hindi">Hindi Medium</option>
            <option value="English">English Medium</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-left text-xs bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-[#D4AF37]/50 rounded-lg p-3 text-neutral-300 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 h-[420px] overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg max-w-3xl whitespace-pre-wrap text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-[#D4AF37] text-black font-medium'
                : 'mr-auto bg-neutral-900 text-neutral-100 border border-neutral-800'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-[#D4AF37] animate-pulse">
            Preparing your explanation...
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded bg-red-950/60 border border-red-700 text-red-200 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any question in Hindi or English..."
          className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D4AF37] hover:bg-[#b5952f] disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg text-sm transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default StudyAssistant;
