import * as mockData from '../data/mockProperties';

describe('sendToGemini system prompt', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
  });

  it('includes context restriction, clarification, and app features', async () => {
    // Save and mock mockProperties
    const original = mockData.mockProperties;
    (mockData as any).mockProperties = [
      { id: 1, title: 'Test Home', price: 123456, location: 'Test City', bedrooms: 2, bathrooms: 1 }
    ];
    // Save and mock fetch
    const originalFetch = globalThis.fetch;
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'AI response' }] } }] })
    });
    globalThis.fetch = fetchMock;
    // Import sendToGemini after mocking fetch
    const { sendToGemini } = await import('./geminiApi');
    await sendToGemini('Test prompt');
    expect(fetchMock).toHaveBeenCalled();
    const fetchCall = fetchMock.mock.calls[0][1];
    if (!fetchCall) throw new Error('fetch call options are undefined');
    const bodyRaw = fetchCall.body;
    if (typeof bodyRaw !== 'string') throw new Error('Request body is not a string');
    const body = JSON.parse(bodyRaw);
    const promptText = body.contents[0].parts[0].text;
    expect(promptText).toMatch(/ONLY answer questions about the properties/);
    expect(promptText).toMatch(/you must always respond: 'Sorry, I can only answer questions about properties in this app.'/i);
    expect(promptText).toMatch(/Test Home/);
    expect(promptText).toMatch(/App Features & Navigation/);
    // Restore
    globalThis.fetch = originalFetch;
    (mockData as any).mockProperties = original;
  });
}); 