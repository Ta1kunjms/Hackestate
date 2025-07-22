## Relevant Files

- `src/App.tsx` - Main React app entry point with mock real-estate layout (placeholders for listings, filters, etc.)
- `src/src/components/AgentChat.tsx` - Floating AI agent component (voice + chat)
- `src/components/AgentChat/AgentChat.test.tsx` - Unit tests for agent chat
- `src/src/components/AgentAvatar.tsx` - 2D robot avatar UI
- `src/components/AgentAvatar/AgentAvatar.test.tsx` - Unit tests for avatar
- `src/utils/agentMemory.ts` - Utility for persisting user preferences and chat history in localStorage
- `src/utils/agentMemory.test.ts` - Unit tests for agent memory utils
- `src/src/api/geminiApi.ts` - Handles Gemini API requests
- `src/api/geminiApi.test.ts` - Unit tests for Gemini API handler
- `src/hooks/useSpeech.ts` - Custom React hook for SpeechRecognition and SpeechSynthesis
- `src/hooks/useSpeech.test.ts` - Unit tests for speech hook
- `src/components/AgentControls/AgentControls.tsx` - UI for mute, reset, and settings
- `src/components/AgentControls/AgentControls.test.ts` - Unit tests for controls
- `src/src/data/mockProperties.ts` - Mock property data for filtering and agent actions

### Notes

- The app should have a basic layout mimicking a real-estate site (property listings, filters, etc.) using placeholder/mock data.
- The floating AI agent (voice + chat) should be able to filter properties, perform DOM actions (scroll, open sections), and remember user preferences using localStorage.
- Use Gemini API for chat responses.
- Unit tests should be placed alongside the code files they are testing.
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Set up basic React app with mock real-estate layout
  - [x] 1.1 Create placeholder components for property listings, filters, and main layout
  - [x] 1.2 Add mock property data for filtering
- [ ] 2.0 Implement floating AI agent (voice + chat)
  - [x] 2.1 Create floating AgentChat component with text and voice input/output
  - [x] 2.2 Integrate Gemini API for chat responses
  - [x] 2.3 Add 2D robot avatar UI (toggleable)
  - [x] 2.4 Ensure agent can perform actions based on user commands (filter, scroll, open sections)
  - [x] 2.5 Provide fallback typing interface for unsupported browsers
- [ ] 3.0 Integrate persistent user memory and preferences
  - [x] 3.1 Store user preferences (location, budget, etc.) and chat history in localStorage
  - [x] 3.2 Implement memory reset functionality
  - [x] 3.3 Ensure preferences persist across reloads and new visits
- [ ] 4.0 Enable dynamic property filtering and DOM actions via agent
  - [x] 4.1 Parse user input for filter criteria (price, location, etc.)
  - [x] 4.2 Apply filters to property listings dynamically
  - [x] 4.3 Implement agent-initiated DOM actions (scroll, navigate, open sections)
  - [x] 4.4 Validate correct filter and navigation behavior in test cases
- [ ] 5.0 Add accessibility, fallback, and agent control features
  - [x] 5.1 Ensure all controls are keyboard accessible
  - [x] 5.2 Add mute/disable agent controls in UI
  - [x] 5.3 Provide clear feedback for unsupported features (voice, etc.)
  - [x] 5.4 Test accessibility and fallback flows
- [ ] 6.0 Write unit tests for all major features
  - [ ] 6.1 Agent chat and voice features
  - [x] 6.2 Memory and persistence logic
  - [x] 6.3 Property filtering and DOM actions
  - [x] 6.4 Avatar and UI components 