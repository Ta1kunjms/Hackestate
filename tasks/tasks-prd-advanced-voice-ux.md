## Relevant Files

- `src/src/utils/wakeWord.ts` - Wake word detection logic and integration.
- `src/src/components/AgentChat.tsx` - Main chat component, will be updated for continuous listening and feedback.
- `src/src/components/AgentControls.tsx` - Controls for toggling advanced voice features.
- `src/src/components/VoiceFeedback.tsx` - Visual/audio feedback component for listening state and errors.
- `src/src/utils/wakeWord.test.ts` - Unit tests for wake word detection.
- `src/src/components/VoiceFeedback.test.tsx` - Unit tests for feedback component.

### Notes
- Unit tests should be placed alongside the code files they are testing.
- Use `npx jest [optional/path/to/test/file]` to run tests.

## Tasks

- [ ] 1.0 Integrate Wake Word Detection
  - [x] 1.1 Research/select a JS wake word detection library (Porcupine, Snowboy, TensorFlow.js, etc.)
  - [x] 1.2 Add `wakeWord.ts` utility for wake word detection logic
  - [x] 1.3 Integrate wake word detection with AgentChat (auto-activate listening)
  - [x] 1.4 Add unit tests for wake word detection

- [ ] 2.0 Implement Continuous Listening Mode
  - [x] 2.1 Refactor AgentChat to support continuous listening (keep mic open after each command)
  - [x] 2.2 Add logic to auto-stop after timeout or "stop listening" command
  - [x] 2.3 Add setting to enable/disable continuous listening
  - [x] 2.4 Test for edge cases (browser limits, interruptions)

- [ ] 3.0 Add Contextual Voice Feedback (Visual & Audio)
  - [x] 3.1 Create `VoiceFeedback.tsx` for visual feedback (overlay, border, icon, etc.)
  - [x] 3.2 Add audio feedback (chime, spoken prompt) for listening start/stop, command heard, errors
  - [x] 3.3 Integrate feedback with AgentChat state changes
  - [x] 3.4 Add unit tests for feedback component

- [ ] 4.0 Update Settings UI for Advanced Voice Options
  - [x] 4.1 Add toggles for wake word and continuous listening in settings popup
  - [x] 4.2 Add tooltips/help for advanced options
  - [x] 4.3 Ensure settings persist and update UI/logic in real time

- [ ] 5.0 Testing, QA, and Fallback Handling
  - [x] 5.1 Write integration tests for advanced voice features
  - [x] 5.2 Manual QA: test on desktop/mobile, all major browsers
  - [x] 5.3 Ensure fallback to manual mic control if advanced features unsupported 