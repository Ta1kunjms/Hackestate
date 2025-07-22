## Relevant Files

- `src/src/components/AgentChat.tsx` - Main chat component, will be updated to support speech recognition and synthesis.
- `src/src/components/AgentControls.tsx` - UI controls for starting/stopping voice recognition and toggling speech features.
- `src/src/components/TranscriptPopup.tsx` - New component for displaying popup transcripts of chatbot responses.
- `src/src/utils/webSpeech.ts` - Utility functions for interacting with the Web Speech API (recognition and synthesis).
- `src/src/utils/webSpeech.test.ts` - Unit tests for Web Speech API utilities.
- `src/src/components/AgentChat.test.tsx` - Unit tests for chat component speech features.
- `src/src/components/TranscriptPopup.test.tsx` - Unit tests for the popup transcript component.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Integrate Speech Recognition (Voice-to-Text)
  - [x] 1.1 Create utility functions for initializing and managing the Web Speech API's SpeechRecognition.
  - [x] 1.2 Add start/stop voice recognition controls to the chat UI.
  - [x] 1.3 Display real-time transcript and mic status during recognition.
  - [x] 1.4 Handle errors and unsupported browser scenarios gracefully.

- [ ] 2.0 Integrate Speech Synthesis (Text-to-Voice)
  - [x] 2.1 Create utility functions for using the Web Speech API's SpeechSynthesis.
  - [x] 2.2 Add option to have chatbot responses read aloud.
  - [x] 2.3 Allow users to toggle speech synthesis on/off.
  - [x] 2.4 Ensure voice/language selection matches user/system preferences.

- [ ] 3.0 Implement Visual Feedback and UI Controls
  - [x] 3.1 Design and implement mic icon and status indicator.
  - [x] 3.2 Integrate visual feedback into existing chat UI.
  - [x] 3.3 Ensure controls are accessible and match design guidelines.

- [ ] 4.0 Implement Popup Transcript for Chatbot Responses
  - [x] 4.1 Create `TranscriptPopup` component for displaying spoken message transcripts.
  - [x] 4.2 Show popup when chatbot speaks and chat is not toggled for messaging.
  - [x] 4.3 Ensure popup is unobtrusive, auto-dismisses, and is dismissible by user.

- [ ] 5.0 Ensure Cross-Browser Compatibility and Fallbacks
  - [x] 5.1 Detect browser support for Web Speech API features.
  - [x] 5.2 Provide fallback to text-only interaction if unsupported.
  - [x] 5.3 Test feature in Chrome, Firefox, Edge, and Safari.

- [ ] 6.0 Testing and QA
  - [x] 6.1 Write unit tests for all new utility functions and components.
  - [x] 6.2 Write integration tests for chat flow with speech features enabled/disabled.
  - [x] 6.3 Perform manual QA to verify UX, error handling, and browser compatibility. 