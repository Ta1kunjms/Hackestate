## Relevant Files

- `src/components/AgentChat/AgentChat.tsx` - Main chat interface component (text and voice)
- `src/components/AgentChat/AgentChat.test.tsx` - Unit tests for chat interface
- `src/components/AgentAvatar/AgentAvatar.tsx` - 2D robot avatar UI
- `src/components/AgentAvatar/AgentAvatar.test.tsx` - Unit tests for avatar
- `src/utils/agentMemory.ts` - Utility for persisting user preferences and chat history in localStorage
- `src/utils/agentMemory.test.ts` - Unit tests for agent memory utils
- `src/api/geminiApi.ts` - Handles Gemini API requests
- `src/api/geminiApi.test.ts` - Unit tests for Gemini API handler
- `src/hooks/useSpeech.ts` - Custom React hook for SpeechRecognition and SpeechSynthesis
- `src/hooks/useSpeech.test.ts` - Unit tests for speech hook
- `src/components/AgentControls/AgentControls.tsx` - UI for mute, reset, and settings
- `src/components/AgentControls/AgentControls.test.tsx` - Unit tests for controls

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Implement AI-powered chat interface (text and voice)
  - [ ] 1.1 Create chat UI component with message history and input field
  - [ ] 1.2 Integrate Gemini API for text-based chat responses
  - [ ] 1.3 Add voice input using Web Speech API (SpeechRecognition)
  - [ ] 1.4 Add voice output using SpeechSynthesis API
  - [ ] 1.5 Ensure chat interface always displays microphone icon
  - [ ] 1.6 Implement fallback typing interface for unsupported browsers
  - [ ] 1.7 Write unit tests for chat interface and voice features
- [ ] 2.0 Integrate persistent user memory and preferences
  - [ ] 2.1 Store user preferences (location, budget) in localStorage
  - [ ] 2.2 Cache past queries locally for performance
  - [ ] 2.3 Implement memory reset functionality (button or command)
  - [ ] 2.4 Ensure preferences persist across reloads and new visits
  - [ ] 2.5 Write unit tests for memory and persistence logic
- [ ] 3.0 Enable dynamic property filtering and DOM actions via agent
  - [ ] 3.1 Parse user input for filter criteria (price, location, etc.)
  - [ ] 3.2 Apply filters to property listings dynamically
  - [ ] 3.3 Implement agent-initiated DOM actions (scroll, navigate, open sections)
  - [ ] 3.4 Validate correct filter and navigation behavior in test cases
- [ ] 4.0 Design and implement 2D avatar and floating UI
  - [ ] 4.1 Create 2D robot avatar component, toggleable by user
  - [ ] 4.2 Position avatar and chat widget in bottom-right corner
  - [ ] 4.3 Style floating UI (avatar, chat, controls) to match real estate site
  - [ ] 4.4 Add settings toggle to floating UI
  - [ ] 4.5 Write unit tests for avatar and UI components
- [ ] 5.0 Add accessibility, fallback, and agent control features
  - [ ] 5.1 Ensure all controls are keyboard accessible
  - [ ] 5.2 Add mute/disable agent controls in UI
  - [ ] 5.3 Provide clear feedback for unsupported features (voice, etc.)
  - [ ] 5.4 Test accessibility and fallback flows 