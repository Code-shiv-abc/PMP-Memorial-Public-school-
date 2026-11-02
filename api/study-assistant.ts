import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requiresMainModel(query: string, selectedClass: string): boolean {
  if (query.length > 150) return true;

  const hasDigit = /\d/.test(query);
  const hasOperator = /[+\-*/=^]/.test(query);
  if (hasDigit && hasOperator) return true;

  const keywords = [
    'solve', 'prove', 'why', 'explain', 'step',
    'derive', 'essay', 'calculate', 'numerical', 'difference',
    'समझाएं', 'क्यों', 'हल', 'सिद्ध', 'गणना'
  ];
  const queryLower = query.toLowerCase();
  if (keywords.some(kw => queryLower.includes(kw))) return true;

  if (selectedClass && (selectedClass.startsWith('Class 9') || selectedClass.startsWith('Class 11'))) {
    return true;
  }

  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, selectedClass, selectedSubject, languageMode } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing query.' });
  }

  if (query.length > 1000) {
    return res.status(400).json({ error: 'Prompt too long. Maximum 1000 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const mainModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const fastModel = process.env.GEMINI_MODEL_FAST;

  if (!apiKey) {
    console.error('Server configuration error: GEMINI_API_KEY is missing');
    return res.status(500).json({ error: 'The AI is unavailable right now. Please contact 9792954343.' });
  }

  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = `You are the official bilingual AI Study Tutor for PMP Memorial Public School in Shahpur, Gonda, Uttar Pradesh.
Student Class: ${selectedClass || 'Unknown'}
Subject: ${selectedSubject || 'Unknown'}
Language: ${languageMode || 'Bilingual'}
Follow NCERT and UP Board curriculum. Give simple numbered explanations suitable for school students.`;

  const useMain = !fastModel || requiresMainModel(query, selectedClass);

  async function callMainModel() {
    let attempt = 1;
    const maxAttempts = 3;

    while (attempt <= maxAttempts) {
      try {
        console.log("study-assistant model:", mainModel);
        const response = await ai.models.generateContent({
          model: mainModel,
          contents: query,
          config: { systemInstruction, temperature: 0.4 },
        });

        const reply = response.text || 'Please try rephrasing your question.';
        return res.status(200).json({ reply });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`AI generateContent error (main model, attempt ${attempt}):`, errorMessage);

        const isBusyError = errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE');

        if (isBusyError) {
          if (attempt === 1) {
            await wait(2000);
          } else if (attempt === 2) {
            await wait(4000);
          } else {
            return res.status(503).json({
              error: 'The AI is very busy right now. Please try again in a minute.'
            });
          }
          attempt++;
        } else {
          return res.status(500).json({
            error: 'The AI is unavailable right now. Please contact 9792954343.'
          });
        }
      }
    }
  }

  if (useMain) {
    return callMainModel();
  } else {
    let attempt = 1;
    const maxAttempts = 2;

    while (attempt <= maxAttempts) {
      try {
        console.log("study-assistant model:", fastModel);
        const response = await ai.models.generateContent({
          model: fastModel,
          contents: query,
          config: { systemInstruction, temperature: 0.4 },
        });

        const reply = response.text || 'Please try rephrasing your question.';
        return res.status(200).json({ reply });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`AI generateContent error (fast model, attempt ${attempt}):`, errorMessage);

        const isBusyError = errorMessage.includes('503') || errorMessage.includes('UNAVAILABLE');
        const isNotFoundError = errorMessage.includes('404') || errorMessage.includes('NOT_FOUND');

        if (isNotFoundError) {
          return callMainModel();
        } else if (isBusyError) {
          if (attempt === 1) {
            await wait(2000);
            attempt++;
          } else {
            return callMainModel();
          }
        } else {
          return res.status(500).json({
            error: 'The AI is unavailable right now. Please contact 9792954343.'
          });
        }
      }
    }
  }
}
