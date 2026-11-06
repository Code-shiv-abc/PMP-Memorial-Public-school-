import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

interface HistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface CacheEntry {
  reply: string;
  expiresAt: number;
}

const CACHE_TTL_MS = 1000 * 60 * 30;
const MAX_CACHE_ENTRIES = 150;
const responseCache = new Map<string, CacheEntry>();

const RATE_WINDOW_MS = 60_000;
const MAX_REQ_PER_IP_PER_MIN = 10;
const ipHits = new Map<string, { count: number; resetAt: number }>();

const INSTANT_ANSWERS: Record<string, string> = {
  'write all important class 10 trigonometry identities and formulas clearly in hindi and english': `### त्रिकोणमिति के मुख्य सूत्र (Important Trigonometry Formulas)

**1. तीन मुख्य सर्वसमिकाएँ (Pythagorean Identities):**
$$\\sin^2\\theta + \\cos^2\\theta = 1$$
$$1 + \\tan^2\\theta = \\sec^2\\theta$$
$$1 + \\cot^2\\theta = \\cosec^2\\theta$$

**2. भुजाओं के अनुपात (Trigonometric Ratios in a Right Triangle):**
* $\\sin\\theta = \\frac{\\text{लम्ब (Perpendicular)}}{\\text{कर्ण (Hypotenuse)}}$
* $\\cos\\theta = \\frac{\\text{आधार (Base)}}{\\text{कर्ण (Hypotenuse)}}$
* $\\tan\\theta = \\frac{\\text{लम्ब (Perpendicular)}}{\\text{आधार (Base)}} = \\frac{\\sin\\theta}{\\cos\\theta}$

**3. व्युत्क्रम संबंध (Reciprocal Relations):**
* $\\cosec\\theta = \\frac{1}{\\sin\\theta}$
* $\\sec\\theta = \\frac{1}{\\cos\\theta}$
* $\\cot\\theta = \\frac{1}{\\tan\\theta} = \\frac{\\cos\\theta}{\\sin\\theta}$

**Follow-up:** क्या आप **त्रिकोणमितीय मानों की सारणी ($0^\\circ, 30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ$)** भी देखना चाहते हैं?`,

  'explain photosynthesis in simple hindi and english': `### प्रकाश संश्लेषण (Photosynthesis)

**1. परिभाषा (Definition):**
हरे पौधे सूर्य के प्रकाश (Sunlight), जल ($H_2O$), और कार्बन डाइऑक्साइड ($CO_2$) की सहायता से क्लोरोफिल (Chlorophyll) की उपस्थिति में अपना भोजन (ग्लूकोज) स्वयं बनाते हैं। इस प्रक्रिया को **प्रकाश संश्लेषण** कहते हैं।

**2. रासायनिक समीकरण (Chemical Equation):**
$$6CO_2 + 6H_2O \\xrightarrow{\\text{Sunlight + Chlorophyll}} C_6H_{12}O_6 + 6O_2 \\uparrow$$

**3. मुख्य बिंदु (Key Points for Exams):**
* **क्लोरोफिल (Chlorophyll):** पत्तियों का हरा वर्णक जो सौर ऊर्जा को सोखता है।
* **रंध्र (Stomata):** पत्तियों के सूक्ष्म छिद्र जिनसे $CO_2$ अंदर आती है और ऑक्सीजन ($O_2$) बाहर निकलती है।

**Follow-up:** क्या आप प्रकाश संश्लेषण के **Light Reaction** और **Dark Reaction** में अंतर जानना चाहते हैं?`,

  'solve: 2x + 5 = 15 step by step': `### समीकरण का हल (Step-by-Step Solution)

**दिया गया समीकरण (Given Equation):**
$$2x + 5 = 15$$

**चरण 1 (Step 1): संख्या $5$ को दाईं ओर (RHS) ले जाएं**
चिह्न $+$ से बदलकर $-$ हो जाएगा:
$$2x = 15 - 5$$
$$2x = 10$$

**चरण 2 (Step 2): दोनों पक्षों को $2$ से भाग दें**
$$x = \\frac{10}{2}$$
$$x = 5$$

**जाँच (Verification):** $2(5) + 5 = 10 + 5 = 15$ (सही उत्तर!)

**Follow-up:** क्या आप इसी तरह का एक और अभ्यास प्रश्न हल करना चाहेंगे?`,

  'what is newton’s first law of motion? उदाहरण सहित समझाएं': `### न्यूटन का गति का प्रथम नियम (Newton's First Law of Motion)

**1. नियम (Statement):**
यदि कोई वस्तु स्थिर (at rest) है तो वह स्थिर ही रहेगी, और यदि वह एकसमान गति में है तो उसी वेग से चलती रहेगी, जब तक कि उस पर कोई **बाह्य असंतुलित बल (External Force)** न लगाया जाए। इसे **जड़त्व का नियम (Law of Inertia)** भी कहते हैं।

**2. दैनिक जीवन के उदाहरण (Real-Life Examples):**
* **बस का अचानक चलना:** बस के अचानक चलने पर खड़े यात्री पीछे की ओर झुक जाते हैं (विराम का जड़त्व)।
* **पेड़ की शाखा हिलाना:** पेड़ की डाल को तेजी से हिलाने पर फल टूटकर नीचे गिर जाते हैं।

**Follow-up:** क्या आप **न्यूटन के दूसरे नियम ($F = ma$)** को भी उदाहरण सहित समझना चाहेंगे?`
};

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getSafeModel(envVal: string | undefined, fallback: string): string {
  if (!envVal || envVal.includes('3.8') || envVal.includes('undefined')) {
    return fallback;
  }
  return envVal.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'anon';
  const now = Date.now();
  const ipState = ipHits.get(clientIp);
  if (!ipState || now > ipState.resetAt) {
    ipHits.set(clientIp, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    ipState.count += 1;
    if (ipState.count > MAX_REQ_PER_IP_PER_MIN) {
      return res.status(429).json({
        error: 'कृपया थोड़ा रुकें (Please wait 20 seconds before sending another question).'
      });
    }
  }

  const { query, selectedClass, selectedSubject, languageMode, history } = req.body || {};

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing query.' });
  }

  const cleanQuery = query.trim();
  if (cleanQuery.length > 800) {
    return res.status(400).json({ error: 'Prompt too long. Maximum 800 characters.' });
  }

  const normQuery = normalizeKey(cleanQuery);

  if (['hi', 'hello', 'namaste', 'नमस्ते', 'प्रणाम', 'hey'].includes(normQuery)) {
    return res.status(200).json({
      reply: `**नमस्ते! (Namaste!)** मैं **विद्या AI (Vidya AI)** हूँ — पी. एम. पी. मेमोरियल पब्लिक स्कूल, शाहपुर (गोंडा) की आपकी अध्ययन सहायिका।\n\nआप मुझसे **${selectedClass || 'अपनी कक्षा'}** के **${selectedSubject || 'किसी भी विषय'}** का कोई भी प्रश्न या सूत्र हिंदी या अंग्रेजी में पूछ सकते हैं।\n\n**Follow-up:** आज आप किस अध्याय (Chapter) या सूत्र का अभ्यास करना चाहेंगे?`,
      cached: true
    });
  }

  if (INSTANT_ANSWERS[normQuery]) {
    return res.status(200).json({ reply: INSTANT_ANSWERS[normQuery], cached: true });
  }

  const historyList: HistoryTurn[] = Array.isArray(history) ? history.slice(-4) : [];
  const cacheKey = `${selectedClass || ''}|${selectedSubject || ''}|${languageMode || ''}|${
    historyList.length === 0 ? normQuery : `${normalizeKey(historyList[historyList.length - 1]?.text || '')}>${normQuery}`
  }`;

  const cachedHit = responseCache.get(cacheKey);
  if (cachedHit && cachedHit.expiresAt > now) {
    return res.status(200).json({ reply: cachedHit.reply, cached: true });
  }

  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ''
  ).trim();

  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is missing in Vercel Settings -> Environment Variables. Please add GEMINI_API_KEY in Vercel and Redeploy.'
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  // Instructs Gemini to format math & chemical formulas cleanly using readable symbols + $$ blocks
  const systemInstruction = `You are Vidya AI, official tutor at P.M.P. Memorial Public School, Shahpur Gonda (UP Board/NCERT).
Class: ${selectedClass || 'School'} | Subject: ${selectedSubject || 'General'} | Language Mode: ${languageMode || 'Bilingual (Hindi+English)'}.
Formatting Rules:
1. Structure answers with clear numbered headings and concise bullet points (<220 words).
2. For math/science formulas, write standalone key equations inside $$...$$ blocks and inline math inside $...$ (or clean Unicode symbols like sin²θ + cos²θ = 1, √x, H₂O, CO₂, →). Never write broken LaTeX like "\\ cosec".
3. Strictly follow the requested Language Mode (${languageMode}).
4. End with 1 short follow-up question prefixed with "**Follow-up:**".`;

  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const turn of historyList) {
    if (!turn?.text || typeof turn.text !== 'string') continue;
    contents.push({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.role === 'assistant' ? turn.text.slice(0, 320) : turn.text.slice(0, 300) }]
    });
  }
  contents.push({ role: 'user', parts: [{ text: cleanQuery }] });

  const primaryLite = getSafeModel(process.env.GEMINI_MODEL_FAST, 'gemini-2.5-flash-lite');
  const primaryMain = getSafeModel(process.env.GEMINI_MODEL, 'gemini-2.5-flash');
  const modelChain = Array.from(new Set([primaryLite, primaryMain, 'gemini-2.0-flash']));

  let lastErrorMsg = '';

  for (let i = 0; i < modelChain.length; i++) {
    const currentModel = modelChain[i];
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.35,
          maxOutputTokens: 600,
        }
      });

      const reply = response.text?.trim() || 'कृपया अपना प्रश्न थोड़ा स्पष्ट रूप से लिखें (Please rephrase your question).';

      if (responseCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = responseCache.keys().next().value;
        if (oldestKey) responseCache.delete(oldestKey);
      }
      responseCache.set(cacheKey, { reply, expiresAt: Date.now() + CACHE_TTL_MS });

      return res.status(200).json({ reply, model: currentModel });
    } catch (err: unknown) {
      lastErrorMsg = err instanceof Error ? err.message : String(err);
      console.error(`Vidya AI error (${currentModel}, try ${i + 1}):`, lastErrorMsg);

      if (
        lastErrorMsg.includes('API_KEY_INVALID') ||
        lastErrorMsg.includes('API key not valid') ||
        lastErrorMsg.includes('PERMISSION_DENIED') ||
        lastErrorMsg.includes('leaked')
      ) {
        return res.status(500).json({
          error: 'Your GEMINI_API_KEY in Vercel is invalid or expired. Please generate a new key in Google AI Studio and update Vercel Environment Variables.'
        });
      }

      if (i < modelChain.length - 1) {
        await wait(400);
        continue;
      }
    }
  }

  if (lastErrorMsg.includes('429') || lastErrorMsg.includes('RESOURCE_EXHAUSTED') || lastErrorMsg.includes('quota')) {
    return res.status(429).json({
      error: 'अभी बहुत से विद्यार्थी प्रश्न पूछ रहे हैं (Free API per-minute limit reached). कृपया 30 सेकंड बाद पुनः प्रयास करें।'
    });
  }

  return res.status(500).json({
    error: `The AI is unavailable right now (${lastErrorMsg.slice(0, 90)}). Please contact 9792954343.`
  });
}
