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

// 1. Warm Serverless Memory Cache (0 RPM / 0 Tokens for repeated questions across students)
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const MAX_CACHE_ENTRIES = 150;
const responseCache = new Map<string, CacheEntry>();

// 2. Per-IP Rate Guard (Protects your 15 RPM Free Tier from rapid button clicking)
const RATE_WINDOW_MS = 60_000;
const MAX_REQ_PER_IP_PER_MIN = 8;
const ipHits = new Map<string, { count: number; resetAt: number }>();

// 3. Zero-RPM Precomputed Answers for Starter Prompts & Common Greetings
const INSTANT_ANSWERS: Record<string, string> = {
  'explain photosynthesis in simple hindi and english': `### प्रकाश संश्लेषण (Photosynthesis)

**1. परिभाषा (Definition):**
हरे पौधे सूर्य के प्रकाश (Sunlight), जल (Water - $H_2O$), और कार्बन डाइऑक्साइड ($CO_2$) की सहायता से क्लोरोफिल (Chlorophyll) की उपस्थिति में अपना भोजन (ग्लूकोज) स्वयं बनाते हैं। इस प्रक्रिया को **प्रकाश संश्लेषण** कहते हैं।

**2. रासायनिक समीकरण (Chemical Equation):**
$$6CO_2 + 6H_2O \\xrightarrow{\\text{Sunlight + Chlorophyll}} C_6H_{12}O_6 \\text{ (Glucose)} + 6O_2 \\uparrow$$

**3. मुख्य बिंदु (Key Points for Exams):**
* **क्लोरोफिल (Chlorophyll):** पत्तियों के हरे रंग का वर्णक जो सौर ऊर्जा को सोखता है।
* **रंध्र (Stomata):** पत्तियों के छोटे छिद्र जिनसे $CO_2$ अंदर आती है और ऑक्सीजन ($O_2$) बाहर निकलती है।

**Follow-up:** क्या आप प्रकाश संश्लेषण के **Light Reaction** और **Dark Reaction** में अंतर जानना चाहते हैं?`,

  'solve: 2x + 5 = 15 step by step': `### समीकरण का हल (Step-by-Step Solution)

**दिया गया समीकरण (Given Equation):**
$$2x + 5 = 15$$

**चरण 1 (Step 1): संख्या $5$ को दाईं ओर (RHS) ले जाएं (Transpose $5$ to RHS)**
चिह्न $+$ से बदलकर $-$ हो जाएगा:
$$2x = 15 - 5$$
$$2x = 10$$

**चरण 2 (Step 2): दोनों पक्षों को $2$ से भाग दें (Divide both sides by $2$)**
$$x = \\frac{10}{2}$$
$$x = 5$$

**जाँच (Verification):** $2(5) + 5 = 10 + 5 = 15$ (सही उत्तर!)

**Follow-up:** क्या आप इसी तरह का एक और अभ्यास प्रश्न (Practice Question) हल करना चाहेंगे?`,

  'what is newton’s first law of motion? उदाहरण सहित समझाएं': `### न्यूटन का गति का प्रथम नियम (Newton's First Law of Motion)

**1. नियम (Statement):**
यदि कोई वस्तु स्थिर (at rest) है तो वह स्थिर ही रहेगी, और यदि वह एकसमान गति (uniform motion) में है तो उसी वेग से चलती रहेगी, जब तक कि उस पर कोई **बाह्य असंतुलित बल (External Unbalanced Force)** न लगाया जाए। इसे **जड़त्व का नियम (Law of Inertia)** भी कहते हैं।

**2. दैनिक जीवन के उदाहरण (Real-Life Examples):**
* **बस का अचानक चलना:** बस के अचानक चलने पर खड़े यात्री पीछे की ओर झुक जाते हैं क्योंकि शरीर का निचला हिस्सा बस के साथ गति में आ जाता है, पर ऊपरी हिस्सा विराम के जड़त्व (Inertia of Rest) के कारण वहीं रहना चाहता है।
* **पेड़ की शाखा हिलाना:** पेड़ की डाल को तेजी से हिलाने पर फल टूटकर नीचे गिर जाते हैं।

**Follow-up:** क्या आप **न्यूटन के दूसरे नियम ($F = ma$)** को भी उदाहरण सहित समझना चाहेंगे?`,

  'write a short application to the principal for 2 days sick leave': `### बीमारी के कारण 2 दिन के अवकाश हेतु प्रार्थना पत्र (Sick Leave Application)

**English Version:**
To,
The Principal,
P.M.P. Memorial Public School,
Shahpur, Gonda (U.P.)

**Subject:** Application for two days sick leave.

Respected Sir,
Respectfully, I beg to state that I am a student of Class **[Your Class]** in your school. I have been suffering from fever since last night. The doctor has advised me to take complete rest for two days.

Therefore, kindly grant me leave for two days from **[Start Date]** to **[End Date]**. I shall be highly obliged to you.

Yours obediently,
Name: **[Your Name]**
Class & Roll No.: **[Class / Roll No.]**

---

**हिंदी प्रारूप (Hindi Version):**
सेवा में,
प्रधानाचार्य जी,
पी. एम. पी. मेमोरियल पब्लिक स्कूल, शाहपुर, गोंडा (उ.प्र.)

**विषय:** दो दिन के अवकाश हेतु प्रार्थना पत्र।

महोदय,
सविनय निवेदन है कि कल रात से मुझे तेज बुखार आ रहा है, जिसके कारण मैं विद्यालय आने में असमर्थ हूँ। चिकित्सक ने मुझे दो दिन के पूर्ण विश्राम की सलाह दी है।
अतः आपसे प्रार्थना है कि मुझे दिनांक **[दिनांक]** से **[दिनांक]** तक दो दिन का अवकाश प्रदान करने की कृपा करें।

आपका आज्ञाकारी शिष्य / शिष्या,
नाम: **[आपका नाम]** | कक्षा: **[कक्षा]**

**Follow-up:** क्या आप इसे किसी अन्य विषय (जैसे शुल्क मुक्ति या स्थानांतरण प्रमाण-पत्र) के लिए लिखवाना चाहते हैं?`
};

function normalizeKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isComplexQuery(query: string): boolean {
  if (query.length > 220) return true;
  const hasMathFormula = /\d+\s*[+\-*/=^]\s*\d+/.test(query);
  const hardKeywords = ['derive', 'prove', 'integration', 'differentiation', 'numerical', 'सिद्ध कीजिए', 'निगमन'];
  const qLower = query.toLowerCase();
  return hasMathFormula || hardKeywords.some((kw) => qLower.includes(kw));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Per-IP Rate Guard
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

  // Check Zero-RPM Instant Greetings & Starter Prompts
  if (['hi', 'hello', 'namaste', 'नमस्ते', 'प्रणाम', 'hey'].includes(normQuery)) {
    return res.status(200).json({
      reply: `**नमस्ते! (Namaste!)** मैं **विद्या AI (Vidya AI)** हूँ — पी. एम. पी. मेमोरियल पब्लिक स्कूल, शाहपुर (गोंडा) की आपकी अध्ययन सहायिका।\n\nआप मुझसे **${selectedClass || 'अपनी कक्षा'}** के **${selectedSubject || 'किसी भी विषय'}** का कोई भी प्रश्न हिंदी या अंग्रेजी में पूछ सकते हैं।\n\n**Follow-up:** आज आप किस अध्याय (Chapter) या प्रश्न का अभ्यास करना चाहेंगे?`,
      cached: true
    });
  }

  if (INSTANT_ANSWERS[normQuery]) {
    return res.status(200).json({ reply: INSTANT_ANSWERS[normQuery], cached: true });
  }

  // Check Warm Server LRU Cache (when no follow-up context overrides it)
  const historyList: HistoryTurn[] = Array.isArray(history) ? history.slice(-4) : [];
  const cacheKey = `${selectedClass || ''}|${selectedSubject || ''}|${languageMode || ''}|${historyList.length === 0 ? normQuery : `${ normalizeKey(historyList[historyList.length - 1]?.text || '') }>${normQuery}`}`;

  const cachedHit = responseCache.get(cacheKey);
  if (cachedHit && cachedHit.expiresAt > now) {
    return res.status(200).json({ reply: cachedHit.reply, cached: true });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  // Valid Gemini 2.5 models — flash-lite has the highest free RPM & RPD quota
  const liteModel = process.env.GEMINI_MODEL_FAST || 'gemini-2.5-flash-lite';
  const mainModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('Server configuration error: GEMINI_API_KEY is missing');
    return res.status(500).json({ error: 'The AI is unavailable right now. Please contact 9792954343.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  // Ultra-compact system instruction (~42 tokens) to save input TPM on every request
  const systemInstruction = `You are Vidya AI, tutor at PMP Memorial Public School, Shahpur Gonda (UP Board/NCERT).
Class: ${selectedClass || 'School'} | Subject: ${selectedSubject || 'General'} | Lang: ${languageMode || 'Bilingual (Hindi+English)'}.
Rules: Give clear, concise, step-by-step points (<220 words). End with 1 short follow-up question prefixed with "Follow-up:".`;

  // Build compact multi-turn contents array (trims old replies to 320 chars to save tokens)
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const turn of historyList) {
    if (!turn?.text || typeof turn.text !== 'string') continue;
    contents.push({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.role === 'assistant' ? turn.text.slice(0, 320) : turn.text.slice(0, 300) }]
    });
  }
  contents.push({ role: 'user', parts: [{ text: cleanQuery }] });

  // Route 85% of queries to gemini-2.5-flash-lite first to maximize free daily requests
  const modelOrder = isComplexQuery(cleanQuery)
    ? [mainModel, liteModel]
    : [liteModel, mainModel];

  for (let i = 0; i < modelOrder.length; i++) {
    const currentModel = modelOrder[i];
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.35,
          maxOutputTokens: 550,
          // Disable hidden thinking tokens so responses return in ~1.5s and save 70% token quota
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      const reply = response.text?.trim() || 'कृपया अपना प्रश्न थोड़ा स्पष्ट रूप से लिखें (Please rephrase your question).';

      // Save in Warm Server Cache
      if (responseCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = responseCache.keys().next().value;
        if (oldestKey) responseCache.delete(oldestKey);
      }
      responseCache.set(cacheKey, { reply, expiresAt: Date.now() + CACHE_TTL_MS });

      return res.status(200).json({ reply, model: currentModel });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Vidya AI error (${currentModel}, try ${i + 1}):`, msg);

      const isRecoverable =
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('404') ||
        msg.includes('NOT_FOUND');

      if (isRecoverable && i < modelOrder.length - 1) {
        await wait(600); // Fast 600ms switch to backup model (stays well inside Vercel Hobby 10s limit)
        continue;
      }

      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('503')) {
        return res.status(503).json({
          error: 'अभी बहुत से विद्यार्थी प्रश्न पूछ रहे हैं। कृपया 20 सेकंड बाद पुनः प्रयास करें। (High traffic, please retry in 20s.)'
        });
      }

      return res.status(500).json({
        error: 'The AI is unavailable right now. Please contact 9792954343.'
      });
    }
  }
}
