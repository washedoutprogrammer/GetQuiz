# GetQuiz - System Testing Suite & Quality Assurance

This document outlines the comprehensive testing suite and quality assurance metrics established for the **GetQuiz** web application. It covers core functionality, external API gateways, reactive states, and fail-safe operations.

---

## 🛠️ Environmental Setup & Verification

Before executing the test cases, ensure your local web environment conforms to the following specifications:
* **Frontend Port:** `http://localhost:5173/` (Vite)
* **Auth Provider:** Clerk Shield Gateway via custom local environmental keys
* **AI Provider Backend:** OpenRouter API

---

## 📑 Test Suite 1: Authentication & Session Gate (Clerk API)

### TC_AUTH_001: Environment Configuration & Clerk Shield Activation
* **Objective:** Verify that the frontend application loads environmental variables correctly from the `.env` file and uses them to establish a secure gateway with Clerk.
* **Pre-conditions:** A `.env` file exists inside the `frontend/` directory containing a valid `VITE_CLERK_PUBLISHABLE_KEY`.
* **Test Steps:**
  1. Open the terminal and run `npm run dev`.
  2. Launch the application via `http://localhost:5173/`.
  3. Observe the loading state and the landing page behavior.
* **Expected Results:** The application must successfully read the variable from the local environment block. The main landing page must render completely without throwing any unhandled API connection errors or crashing into a blank screen.

### TC_AUTH_002: User Authentication Lifecycle
* **Objective:** Validate that a user can successfully trigger the Clerk auth interface and sign into the dashboard using a Google account.
* **Pre-conditions:** The user is on the homepage and is currently unauthenticated.
* **Test Steps:**
  1. Click the "Get Started" or "Sign In" call-to-action button.
  2. When the Clerk modal appears, select the "Sign in with Google" option.
  3. Complete the standard Google OAuth login process.
* **Expected Results:** The user must be securely redirected back to the authenticated dashboard state. The application header must dynamically update to display user profile options or a "Sign Out" option instead of the initial guest triggers.

---

## 📑 Test Suite 2: AI Generation & Process Validation

### TC_GEN_001: File Upload Constraints and OpenRouter AI Pipeline
* **Objective:** Verify that the system correctly validates user text uploads and forwards the core structural content to the OpenRouter AI service.
* **Pre-conditions:** The user is logged in and is on the "Create Quiz" dashboard panel.
* **Test Steps:**
  1. Attempt to paste text or upload a study document (PDF, DOCX, TXT) that exceeds the 15,000-character boundary threshold.
  2. Clear the field and input a valid document under the 15,000-character limit.
  3. Click the "Generate Quiz" button while keeping a live network connection.
* **Expected Results:** Step 1 must trigger a client-side validation error message preventing submission. Step 2 and 3 must successfully initiate an API request sequence to the OpenRouter AI engine, which parses the text layout and returns generated question payloads.

---

## 📑 Test Suite 3: Interactive Quiz Engine & Performance Tracking

### TC_ENG_001: Session Timer Guard and Anti-Data-Loss Retention
* **Objective:** Ensure that the countdown timer triggers correct state changes and that user progress is preserved against accidental window refreshes.
* **Pre-conditions:** A quiz session has been successfully initialized and loaded into view.
* **Test Steps:**
  1. Observe the countdown timer element to verify it decrements perfectly second-by-second.
  2. Select multiple answers across the rendered questions.
  3. Trigger a hard page refresh (Press `F5` or `Ctrl + R`).
* **Expected Results:** The clock must update dynamically in real time. Upon refreshing the browser, the interactive quiz session must retain the user's previously selected answer selections without throwing a data-loss exception or losing state.

### TC_ENG_002: Instant Evaluation, Explanations, and Score Breakdown
* **Objective:** Check that submitting the quiz triggers instant calculation logic and presents detailed solution reviews.
* **Pre-conditions:** The user has completed answering a set of multiple-choice and true/false questions.
* **Test Steps:**
  1. Click the "Submit Quiz" button before the timer hits zero.
  2. Review the resulting screen layout.
* **Expected Results:** The app must immediately calculate the final grade performance. The UI must render a visual score breakdown chart or progress bar. Each question must append a clear status indicator (Correct/Incorrect) accompanied by its respective contextual text explanation block.

---

## 📑 Test Suite 4: Fail-Safe Handling (Offline Mock Mode)

### TC_FAIL_001: Auto-Fallback Triggering under API Failure/Network Loss
* **Objective:** Validate that the system seamlessly falls back to pre-built native Vietnamese question sets when the remote OpenRouter AI service is unavailable or when internet connectivity is dropped.
* **Pre-conditions:** The user is inside the main quiz generator dashboard.
* **Test Steps:**
  1. Simulate an absolute network disconnect (Disconnect local Wi-Fi / set the browser's DevTools Network throttling tab to "Offline").
  2. Click the "Generate Quiz" button.
* **Expected Results:** The system must intercept the connection failure gracefully instead of throwing a generic uncaught error modal. The engine must immediately switch into **Offline Mock Mode**, initializing a standard offline-ready test session.

### TC_FAIL_002: Vietnamese Office Skills (MOS) Mock Dataset Rendering
* **Objective:** Verify that the built-in Vietnamese Tin học văn phòng (Office Skills) mock question data loads with correct formatting and options.
* **Pre-conditions:** The application has activated its local Offline Mock Mode database.
* **Test Steps:**
  1. Select or navigate to the Office Skills (Tin học văn phòng) practice set category.
  2. Verify the language encoding, structure, and text layout of the rendered questions.
* **Expected Results:** The quiz must accurately display specialized questions relating to Microsoft Office operations (Word, Excel formatting, Excel formulas, shortcuts) rendered cleanly in Vietnamese without syntax anomalies.

### TC_FAIL_003: Data Structures & Recursive Algorithm Theory Verification
* **Objective:** Confirm that advanced computer science topics, specifically tree structures and recursive execution flows, evaluate and render correctly.
* **Pre-conditions:** The application is operating on local mock sets.
* **Test Steps:**
  1. Access the Data Structures & Algorithms practice suite.
  2. Locate questions dealing with the logic of recursion (e.g., Fibonacci recursive trees, identifying palindrome properties using recursion) and Tree terminology.
  3. Select an answer choice and click review.
* **Expected Results:** The UI must present correct mathematical or logical syntax for recursive algorithms. Selecting an option must map against the precise truth-table index, correctly determining if the user understands structural recursion or tree concepts.

---

## 📑 Test Suite 5: Structural SEO & Semantic Layout

### TC_SEO_001: Semantic HTML Structural Mapping
* **Objective:** Validate that the codebase maintains a compliant accessibility tree structure for assistive readers.
* **Pre-conditions:** The DOM inspector is active.
* **Test Steps:**
  1. Inspect the main section headers on the primary interface view.
* **Expected Results:** 
  * The "Capabilities" container must map to an HTML `<section>` tag with an `aria-labelledby="features-heading"` attribute.
  * The "Process" workflow layout container must map to an HTML `<section>` tag with an `aria-labelledby="how-heading"` attribute.
  * Purely decorative items, such as the list indexes (`01`, `02`), step numbering counters, and aesthetic icons must contain `aria-hidden="true"` to prevent screen reader noise.
  * Individual feature items within the grid layout must be defined with `role="article"`.

---

## 📊 Feature Matrix Summary

| Test Suite | Component / Module | Target Features | Expected Tag / Token |
| :--- | :--- | :--- | :--- |
| **TS_01** | Clerk Gateway | Sign In, Sign Out, OAuth Session | Secure Lock |
| **TS_02** | OpenRouter Pipeline | Prompt Engineering, Document Extraction | Core Feature (`var(--accent-2)`) |
| **TS_03** | Test Engine | Countdown Timer, Answer Caching, Analytics | Testing (`var(--cold)`) |
| **TS_04** | Local Fallback DB | Office Skills (MOS), Recursion, Trees Theory | Fail-safe (`#3dffa0`) |
