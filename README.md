# Real Estate AI Agent App

## Overview

This project is a mock real-estate website built with **Next.js + React + TypeScript**. It features a floating AI agent (chat + voice UI) that can:
- Filter property listings based on user commands (e.g., “Show me properties in Austin under $700,000”)
- Remember user preferences and chat history (persisted in localStorage)
- Perform DOM actions (scroll to listings/filters) based on chat commands
- Provide accessibility, fallback, and agent control features (mute, reset, settings placeholder)
- Integrate with a (mocked) Gemini API for AI chat responses

---

## Features
- **Floating AI Agent:** Messenger-style chat and (placeholder) voice UI, with a floating circular avatar (blue gradient background, white border, shadow) that overflows the chat header for a modern look
- **FontAwesome Icons:** All controls (mic, mute, send, settings, close) use consistent, accessible FontAwesome icons
- **Compact Auto-Growing Textarea:** Chat input uses a compact, auto-growing textarea for a clean, mobile-friendly UX
- **Overflow Fixes:** No content is clipped; chat history and input are always visible and scrollable
- **Property Filtering:** Filter by location and price using natural language
- **Persistent Memory:** User preferences and chat history saved in localStorage
- **DOM Actions:** Agent can scroll to listings or filters on command
- **Accessibility:** Keyboard accessible controls, clear feedback for unsupported features
- **Unit Tested:** All major features are covered by tests

---

## Project Structure

- `src/src/App.tsx` — Main app layout: header, filters, property listings, floating AI agent
- `src/src/components/AgentChat.tsx` — Floating chat/voice widget
- `src/src/components/AgentAvatar.tsx` — 2D robot avatar
- `src/src/components/AgentControls.tsx` — Mute, reset, and settings controls
- `src/src/data/mockProperties.ts` — Mock property data
- `src/src/utils/agentMemory.ts` — LocalStorage utilities
- `src/src/api/geminiApi.ts` — Mock Gemini API handler
- `src/src/components/AgentChat.test.tsx` — Unit tests for chat, filtering, DOM actions, accessibility, and feedback
- `src/src/components/AgentAvatar.test.tsx` — Unit tests for avatar rendering
- `src/src/utils/agentMemory.test.ts` — Unit tests for memory and persistence logic
- `src/src/App.test.tsx` — Unit tests for property filtering and DOM actions
- `jest.config.js` — Jest configuration for TypeScript + React

---

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

3. **Run the test suite:**
   ```sh
   npm test
   ```
   All tests should pass.

---

## Usage & What to Expect

- **UI:**
  - Header, sidebar with filters (placeholders), main area with property cards, floating AI agent widget in the bottom-right
  - Agent widget features a Messenger-like design: floating blue avatar with white border/shadow, visually overflows the chat header, and a compact, auto-growing chat input
  - All controls use FontAwesome icons for a modern, accessible look
  - No overflow issues: chat history and input are always visible and scrollable

- **Chat & Filtering:**
  - Type commands like “Show me properties in Austin” or “Show me properties under $400,000” in the chat
  - Property listings update in real time based on your commands
  - Commands like “Scroll to listings” or “Show filters” will scroll the page to the relevant section

- **Memory:**
  - Agent remembers your last chat and preferences (location, budget) across reloads
  - Use the “Reset” button to clear memory and chat history

- **Accessibility & Feedback:**
  - All controls are keyboard accessible (tab, enter/space)
  - If your browser doesn’t support voice input, you’ll see a clear message
  - Muting the agent disables voice responses (voice output is a placeholder)

- **Testing:**
  - The project is fully unit tested for chat, memory, filtering, DOM actions, accessibility, and UI

---

## Notes & Next Steps

- **Gemini API** is currently mocked. To use a real API, update `src/src/api/geminiApi.ts`.
- **Voice input/output** is a placeholder. To enable, implement the logic in `AgentChat.tsx` and add a real speech hook.
- **Settings** control is a placeholder for future features.
- **Styling** is basic and can be enhanced with styled-components or Tailwind CSS.

---

## License

This project is for demonstration and prototyping purposes.
