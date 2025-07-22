import {
  savePreferences,
  loadPreferences,
  saveChatHistory,
  loadChatHistory,
  resetMemory,
  UserPreferences,
} from './agentMemory';

describe('agentMemory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads user preferences', () => {
    const prefs: UserPreferences = { location: 'Austin', budget: 500000 };
    savePreferences(prefs);
    expect(loadPreferences()).toEqual(prefs);
  });

  it('saves and loads chat history', () => {
    const history = [
      { from: 'user' as const, text: 'Hello' },
      { from: 'ai' as const, text: 'Hi there!' },
    ];
    saveChatHistory(history);
    expect(loadChatHistory()).toEqual(history);
  });

  it('resets memory', () => {
    savePreferences({ location: 'Austin' });
    saveChatHistory([{ from: 'user', text: 'test' }]);
    resetMemory();
    expect(loadPreferences()).toEqual({});
    expect(loadChatHistory()).toEqual([]);
  });
}); 