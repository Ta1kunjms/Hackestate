## Relevant Files

- `src/src/components/AgentChat.tsx` - Main chat component handling user input, AI responses, and UI logic. Enhanced query parsing and mapping to mockProperties data fields. Displays filtered results as AI messages. Surfaces AI clarification for out-of-domain queries.
- `src/src/utils/agentMemory.ts` - Utility for managing AI context and memory.
- `src/src/data/mockProperties.ts` - Source of property data for the AI to reference.
- `src/src/utils/webSpeech.ts` - Handles voice input and output (if voice UX is involved).
- `src/src/components/AgentChat.test.tsx` - Unit and integration tests for the chat component and AI agent logic, including search/filter logic, AI guidance/help responses, and out-of-domain clarifications. Verifies no off-topic answers are given and tests edge cases.
- `src/src/api/geminiApi.test.ts` - Unit test for system prompt context restriction logic in sendToGemini.
- `src/src/utils/agentMemory.test.ts` - Unit tests for agent memory/context logic.
- `src/src/data/mockProperties.test.ts` - Tests for property data access and filtering (if needed).
- `src/src/api/geminiApi.ts` - Handles AI requests and enforces app-specific context limitation. Now includes guidance for app features and navigation, and explicit help Q&A.

### Notes

- All AI agent functionality has been implemented and tested successfully (7 test suites passed, 29 tests passed).
- Out-of-domain detection is handled by the AI via the system prompt in sendToGemini. The UI always displays the AI's clarification message to the user.
- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Implement AI agent response logic limited to app data
  - [x] 1.1 Refactor AI request handler to use only `mockProperties` and in-app data.
  - [x] 1.2 Add prompt engineering to restrict AI context to app domain.
  - [x] 1.3 Prevent AI from accessing or referencing external/general knowledge.
  - [x] 1.4 Document the AI context limitation in code comments.

- [x] 2.0 Integrate natural language search/filter for property listings
  - [x] 2.1 Implement parsing of user queries for property search/filter intent.
  - [x] 2.2 Map parsed queries to `mockProperties` data fields (e.g., location, price, features).
  - [x] 2.3 Return filtered property results in AI responses.
  - [x] 2.4 Test search/filter logic with various user queries.

- [x] 3.0 Add AI guidance for app features and navigation
  - [x] 3.1 Identify key app features and navigation flows.
  - [x] 3.2 Update AI prompt/context to include guidance capabilities.
  - [x] 3.3 Implement responses for common navigation/help queries (e.g., "How do I search for a property?").
  - [x] 3.4 Test AI guidance responses for accuracy and helpfulness.

- [x] 4.0 Handle out-of-domain queries with clarifications
  - [x] 4.1 Detect when a user query is outside the app's domain.
  - [x] 4.2 Respond with a clarification message (e.g., "I can only answer questions about properties in this app.").
  - [x] 4.3 Ensure the AI never provides off-topic or unsupported answers.
  - [x] 4.4 Test out-of-domain handling with various edge cases.

- [x] 5.0 Write and update tests for AI agent functionality
  - [x] 5.1 Write unit tests for AI context restriction logic.
  - [x] 5.2 Write integration tests for property search/filter via chat.
  - [x] 5.3 Write tests for AI guidance and navigation help.
  - [x] 5.4 Write tests for out-of-domain query handling.
  - [x] 5.5 Ensure all tests pass and update documentation as needed. 