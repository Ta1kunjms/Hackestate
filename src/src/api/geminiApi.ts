// Gemini API integration
// This module is responsible for sending user prompts to the Gemini API.
//
// IMPORTANT: The AI is strictly limited to answering questions about the app's domain (see PRD: AI Agent with App-Specific Context).
// The AI must only use the mockProperties data and app features, and must not answer or reference anything outside the app's domain.
// See /tasks/prd-ai-agent-app-context.md and /tasks/tasks-prd-ai-agent-app-context.md for requirements and implementation details.
//
// 1. Set your API key in a .env.local file at the project root:
//    NEXT_PUBLIC_GEMINI_API_KEY=your-key-here
// 2. Restart your dev server after setting the key.

import { mockProperties } from '../data/mockProperties';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Sends a prompt to the Gemini API, with a system prompt that restricts the AI to only use app data (mockProperties).
 * The AI must NEVER use or reference any external or general knowledge.
 * If a question is outside the app's domain, the AI must always clarify this to the user.
 *
 * PRD: /tasks/prd-ai-agent-app-context.md
 * Task List: /tasks/tasks-prd-ai-agent-app-context.md
 */
export async function sendToGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return 'Gemini API key not set. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.';
  }

  // System prompt to restrict AI to app domain only
  // The AI must only answer questions about the following properties and app features.
  // The AI must NEVER use or reference any external or general knowledge.
  // If a question is outside this domain, always clarify that you can only answer about the app's content.
  // The AI should also guide users on how to use the app's features and navigation.
  // Include example navigation/help queries and answers for consistency.
  const systemPrompt = `You are an AI assistant for a real estate app. You can ONLY answer questions about the properties listed below and the app's features. NEVER use or reference any external or general knowledge. If a user asks something out-of-scope, you must always respond: 'Sorry, I can only answer questions about properties in this app.'

Properties:
${mockProperties.map(p => `- ${p.title}, ${p.bedrooms} bedrooms, ${p.bathrooms} bathrooms, $${p.price}, located in ${p.location}`).join('\n')}

App Features & Navigation:
- Users can search/filter properties by location, price, bedrooms, and bathrooms using natural language.
- Users can chat with you (the AI agent) by typing or using voice input.
- Voice input can be activated by clicking the mic button or saying the wake word (if enabled).
- Continuous listening and auto-send after a pause are supported.
- Visual and audio feedback is provided for listening and error states.
- Users can open settings to enable/disable wake word, continuous listening, change voice/language, or reset agent memory.
- Users can ask you to 'scroll to listings' or 'scroll to filters' to navigate the app.
- Chat history and user preferences are saved automatically.

If a user asks how to use any of these features, provide a clear, concise answer based on the above information.

Common Help Questions & Answers:
Q: How do I search for a property?
A: You can type or say things like "Show me homes in Austin under $700,000" or "Find 3 bedroom houses in Portland" and I'll show you matching properties.

Q: How do I use voice input?
A: Click the microphone button or say the wake word (if enabled) to start speaking. I'll transcribe and respond to your question.

Q: How do I reset the agent?
A: Open the settings (gear icon) and click "Reset Agent" to clear chat history and preferences.

Q: How do I change the voice or language?
A: Open the settings and select your preferred voice and language from the dropdown menus.

Q: How do I navigate to listings or filters?
A: You can ask me to "scroll to listings" or "show filters" and I'll help you navigate there.
`;

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
            parts: [{ text: systemPrompt }, { text: prompt }],
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
