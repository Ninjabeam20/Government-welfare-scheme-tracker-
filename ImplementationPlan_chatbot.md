# Demo AI Chatbot Integration

This plan outlines the steps for adding a mock AI chatbot to the citizen dashboard. The bot will guide beneficiaries on common workflows (like applying for schemes or uploading documents). It features a floating button, a chat modal with smooth animations, and predefined question/answer interactions, strictly built using React and Custom CSS (avoiding external CSS frameworks).

## Proposed Changes

### Frontend Component

#### [NEW] `frontend/src/pages/citizen/DemoChatbot.jsx`
- **Component**: Create a new standalone React component `DemoChatbot`.
- **UI Structure**: 
  - A floating action button positioned at the `bottom-left` corner featuring an AI/bot icon.
  - A chat window modal that pops up when the button is pressed.
- **Interactions & State**:
  - Maintain a `messages` array in the local state.
  - Initial state displays a welcome message from the bot and 4 quick-reply buttons:
    1. "How do I apply for a scheme?"
    2. "How do I upload documents?"
    3. "How do I track my application status?"
    4. "What documents are valid for upload?"
  - Clicking a quick-reply button will append the user's message, followed by a simulated bot response with the predefined answer, then show the quick replies again.
- **Styling & Animations (Custom CSS)**:
  - Use embedded or external custom CSS.
  - Modal opening/closing will use CSS `transform: scale()` and `opacity` transitions.
  - Message bubbles will slide up with `@keyframes` animations.
  - The floating button will have a gentle pulse animation and a hover effect matching the fluent UI/minimalist theme of the application.

### Beneficiary Dashboard

#### [MODIFY] `frontend/src/pages/citizen/CitizenDashboard.jsx`
- Import the new `DemoChatbot` component.
- Mount `<DemoChatbot />` at the end of the return statement (inside the root `.dashboard-container`) so it overlays correctly on top of the dashboard content.

## Verification Plan

### Manual Verification
- **Visibility**: Ensure the chatbot floating button is only visible on the `CitizenDashboard`.
- **Animations**: Click the button to verify the modal smoothly scales up and fades in, and smoothly closes when dismissed.
- **Interaction**: Click each of the 4 predefined buttons to verify the chat log updates correctly and smoothly auto-scrolls to the newest message.
- **Responsiveness**: Ensure the floating button and modal are correctly positioned and usable on various screen sizes without overlapping critical dashboard content.


