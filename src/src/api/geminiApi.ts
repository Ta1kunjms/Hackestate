// Gemini API integration
// 1. Set your API key in a .env.local file at the project root:
//    NEXT_PUBLIC_GEMINI_API_KEY=your-key-here
// 2. Restart your dev server after setting the key.

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function sendToGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return 'Gemini API key not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.';
  }
  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      return `Gemini API error: ${res.status} ${res.statusText}`;
    }
    const data = await res.json();
    // The response format may change; adjust as needed
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || 'No response from Gemini.';
  } catch (e) {
    return 'Error contacting Gemini API.';
  }
} 