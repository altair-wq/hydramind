import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '../store/hydration';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export interface GeminiAnalysisResult {
  dailyTarget: number;
  rationale: string;
  insights: Array<{
    title: string;
    body: string;
    icon: string;
  }>;
}

export async function analyzeHydrationProfile(
  profile: Omit<UserProfile, 'dailyTarget' | 'aiRationale' | 'aiInsights'>
): Promise<GeminiAnalysisResult> {
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are a health and hydration expert AI. Based on the following user profile, analyze their hydration needs:
Weight: ${profile.weight} kg
Activity Level: ${profile.activityLevel}
City/Location: ${profile.city} (Consider the current time of year and typical weather/climate for this location right now)
Primary Goal: ${profile.goal}

Provide a JSON response with the following format exactly (do not wrap it in markdown codeblocks like \`\`\`json):
{
  "dailyTarget": <number in milliliters>,
  "rationale": "<A short 1-2 sentence explanation of why this target was chosen for their profile>",
  "insights": [
    {
      "title": "<Short insight title>",
      "body": "<1-2 sentence descriptive insight customized to their profile>",
      "icon": "<One of these exactly: Heart, Brain, Sparkles, Zap, Leaf, Shield>"
    },
    ... (provide exactly 3 insights)
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      throw new Error('No valid response from Gemini');
    }

    const data = JSON.parse(response.text) as GeminiAnalysisResult;
    return data;
  } catch (error) {
    console.error('Error analyzing hydration profile with Gemini:', error);
    throw error;
  }
}

export type ChatRole = 'user' | 'model';

export async function askHydrationBot(
  history: { role: ChatRole; text: string }[],
  newQuestion: string,
  profile: Partial<UserProfile> | null
): Promise<string> {
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemContext = profile
    ? `You are a helpful, empathetic hydration and wellness AI assistant. 
       The user's profile: Weight ${profile.weight}kg, Activity: ${profile.activityLevel}, Location: ${profile.city}, Goal: ${profile.goal}.
       Keep your answers concise (1-3 sentences max), encouraging, and focused on hydration and health.`
    : `You are a helpful, empathetic hydration and wellness AI assistant. Keep your answers concise (1-3 sentences max), encouraging, and focused on hydration and health.`;

  const contents = [
    { role: 'user', parts: [{ text: systemContext }] },
    { role: 'model', parts: [{ text: 'Understood. I am ready to help with hydration advice.' }] },
    ...history.map((msg) => ({ role: msg.role, parts: [{ text: msg.text }] })),
    { role: 'user', parts: [{ text: newQuestion }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      // @ts-ignore
      contents: contents,
    });

    if (!response.text) throw new Error('No valid response from Gemini');
    return response.text;
  } catch (error) {
    console.error('Error in askHydrationBot:', error);
    throw error;
  }
}
