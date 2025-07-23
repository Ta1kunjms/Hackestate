export type UserPreferences = {
  location?: string;
  budget?: number;
};

const PREF_KEY = 'agent_user_preferences';
const CHAT_KEY = 'agent_chat_history';

export function savePreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(PREF_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveChatHistory(
  history: { from: 'user' | 'ai'; text: string }[]
) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_KEY, JSON.stringify(history));
}

export function loadChatHistory(): { from: 'user' | 'ai'; text: string }[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(CHAT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function resetMemory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREF_KEY);
  localStorage.removeItem(CHAT_KEY);
}
