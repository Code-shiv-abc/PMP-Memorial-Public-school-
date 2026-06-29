import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import { Send, Trash2, Bot, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { Course } from '@/src/types/user';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function StudyAssistant() {
  const { t } = useLanguage();
  const { data: profile, loading: profileLoading } = useUserProfile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat session when profile data is ready
  useEffect(() => {
    if (profile && !profileLoading) {
      if (profile.courses && profile.courses.length > 0) {
        initChatSession();
      }
    }
  }, [profile, profileLoading]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const initChatSession = async () => {
    try {
      if (!profile?.courses || profile.courses.length === 0) return;

      const courseContext = profile.courses.map((c: Course) =>
        `- ${c.name} (${c.code})\n  taught by ${c.teacher}`
      ).join('\n');

      const systemInstruction = `You are a helpful study assistant for students at PMP Memorial Public School, Shahpur, Gonda, Uttar Pradesh. You help students understand their coursework and answer academic questions.

The student is currently enrolled in these courses:
${courseContext}

Guidelines:
- Be encouraging and supportive
- Keep answers clear and easy to understand
- Focus on academic topics related to their courses
- If asked about something unrelated to studies, politely redirect to academic topics
- Respond in the same language the student uses`;

      const session = await ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
          systemInstruction: systemInstruction,
        }
      });

      setChatSession(session);
      setMessages([]);
    } catch (error) {
      toast.error(t('errorAI'));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession || isThinking) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsThinking(true);

    try {
      const response = await chatSession.sendMessage({ message: userMessage });

      setMessages(prev => [...prev, {
        role: 'model',
        content: response.text
      }]);
    } catch (error) {
      toast.error(t('errorAI'));
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    initChatSession();
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!profile?.courses || profile.courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] space-y-4">
        <Bot className="w-16 h-16 text-[#D4AF37]" />
        <p className="text-white text-lg">{t('noCoursesAI')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-[#0F1115] rounded-xl border border-[#D4AF37]/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/20 bg-[#1a1a2e]">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
            <Bot className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="text-xl font-semibold text-white">{t('studyAssistant')}</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearChat')}</span>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <Bot className="w-12 h-12 text-[#D4AF37]/50" />
            <p className="text-center max-w-md">
              {t('welcomeAI')}
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-[#D4AF37]' : 'bg-[#1a1a2e] border border-[#D4AF37]/20'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-[#0F1115]" />
                  ) : (
                    <Bot className="w-5 h-5 text-[#D4AF37]" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#D4AF37] text-[#0F1115] rounded-2xl rounded-br-none self-end'
                      : 'bg-[#1a1a2e] text-white rounded-2xl rounded-bl-none border border-[#D4AF37]/20 self-start'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1a1a2e] border border-[#D4AF37]/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="px-4 py-3 bg-[#1a1a2e] text-white rounded-2xl rounded-bl-none border border-[#D4AF37]/20 self-start">
                <p className="text-gray-400 animate-pulse flex items-center space-x-1">
                  <span>{t('thinking')}</span>
                  <span className="flex space-x-0.5">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#D4AF37]/20 bg-[#1a1a2e]">
        <div className="flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('askQuestion')}
            disabled={isThinking || !chatSession}
            rows={1}
            className="flex-1 bg-[#0F1115] text-white rounded-xl px-4 py-3 border border-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-50 resize-none min-h-[50px] max-h-[120px]"
            style={{ overflowY: input.split('\n').length > 4 ? 'auto' : 'hidden' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking || !chatSession}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#D4AF37] text-[#0F1115] rounded-xl hover:bg-[#b5952f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudyAssistant;
