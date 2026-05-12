# RAG Panel — Interactive Prompt & Topic Suggestion

## Summary

Add two interactive features inside the **Document Context (RAG)** panel that only render when a file is uploaded. Together they unlock the currently-blocked Options panel:

| Feature | Trigger | Backend call |
|---|---|---|
| **Context Prompt** | User types a query about the document | Existing `POST /quizzes/generate` (with file + ragPrompt as topic) |
| **Suggest Topics** | Click button → AI reads document → returns topic list | New `POST /quizzes/suggest-topics` |

Options unlock when: `file && (ragPrompt.trim() || selectedTopic !== null)`

**Feasibility: 8.5/10** — well-defined scope, reuses existing architecture. Main complexity is state coordination and the new AI prompt engineering on the backend.

---

## Full UX Flow

```
[File uploaded]
       ↓ both features appear below the dropzone
┌─────────────────────────────────────────────────────────────┐
│  📄 Document Context                          [RAG]         │
│  ─────────────────────────────────────────────────────────  │
│  [dropzone — file chip shown]                               │
│                                                             │
│  ── What do you want to quiz about? ───────────────────     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ e.g. "Key concepts from Chapter 3"                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ── OR ─────────────────────────────────────────────────   │
│                                                             │
│  [✨ Suggest Topics from Document]  ← button               │
│                                                             │
│  (after click — topic cards appear)                         │
│  ┌──────────────────────────┐  ┌──────────────────────┐   │
│  │ ○ The Water Cycle        │  │ ● Photosynthesis      │   │
│  │   How water moves...     │  │   Light to energy...  │   │
│  └──────────────────────────┘  └──────────────────────┘   │
│  ┌──────────────────────────┐                              │
│  │ ○ Ecosystem Balance      │                              │
│  │   Predator-prey...       │                              │
│  └──────────────────────────┘                              │
│                                                             │
│  ── Options ─────────────────── [unlocked when ready]  ─   │
│  Number of questions  [select ▾]    Question type [▾]       │
│  [═══════ Generate Quiz ══════]  ← active now               │
└─────────────────────────────────────────────────────────────┘
```

---

## Proposed Changes

---

### Backend — `services/ai_service.py`

#### [MODIFY] [ai_service.py](file:///d:/Khong%20trong%20luc/GetQuiz/backend/services/ai_service.py)

Add new function `suggest_topics_from_context(context: str) -> dict`:

- Takes the extracted document text as input
- Sends a focused prompt to Gemini asking it to identify **3–5 quiz-worthy topics** from the document
- Returns JSON: `{ "status": "success", "topics": [{ "title": "...", "description": "..." }, ...] }`
- Same error-handling pattern as `generate_quiz_from_prompt`

AI prompt template:
```
You are a quiz topic analyst. Read the following document and identify 3 to 5 distinct topics that would make good quiz subjects. For each topic, give a short title (max 5 words) and a one-sentence description (max 20 words).

Return ONLY valid JSON (no markdown):
{
  "status": "success",
  "topics": [
    { "title": "Topic Name", "description": "One sentence about this topic." }
  ]
}
```

---

### Backend — `routers/quizzes.py`

#### [MODIFY] [quizzes.py](file:///d:/Khong%20trong%20luc/GetQuiz/backend/routers/quizzes.py)

Add new endpoint:

```python
@router.post("/suggest-topics")
async def suggest_topics(file: UploadFile = File(...)):
    """
    Extract text from uploaded file and return AI-suggested quiz topics.
    Input:  multipart/form-data with 'file'
    Output: { "topics": [{ "title": str, "description": str }] }
    """
```

- Extract file text via existing `file_service.extract_text_from_file()`
- Call `suggest_topics_from_context(context)`
- Return the topics list directly (no DB write needed — purely ephemeral AI call)

**Also update** existing `POST /quizzes/generate` to handle the `rag_prompt` case — this is already handled because the frontend will pass the `ragPrompt` or `selectedTopic.title` as the `topic` field, so **no changes needed** to the generate endpoint.

---

### Frontend — `api/quizzes.js`

#### [MODIFY] [quizzes.js](file:///d:/Khong%20trong%20luc/GetQuiz/frontend/src/api/quizzes.js)

Add new function:

```js
/** Ask AI to suggest quiz topics from an uploaded file. */
export async function suggestTopics(file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch('/quizzes/suggest-topics', { method: 'POST', body: formData });
}
```

---

### Frontend — `Dashboard.jsx` — `AiCreateQuiz` component

#### [MODIFY] [Dashboard.jsx](file:///d:/Khong%20trong%20luc/GetQuiz/frontend/src/pages/Dashboard.jsx)

**New state variables** (added inside `AiCreateQuiz`):

| State | Type | Purpose |
|---|---|---|
| `ragPrompt` | `string` | Text the user types in the context-grounded textarea |
| `ragTopics` | `array \| null` | List of AI-suggested topics, null before request |
| `selectedTopic` | `object \| null` | The topic the user clicked, or null |
| `suggestingTopics` | `boolean` | Loading state for the Suggest Topics button |
| `suggestError` | `string` | Error message if suggest-topics call fails |

**Options unlock condition** (replaces `disabled` + opacity in the RAG Options block):
```js
const ragOptionsActive = !!file && (ragPrompt.trim().length > 0 || selectedTopic !== null);
```

**New handler `handleSuggestTopics`:**
```js
const handleSuggestTopics = async () => {
  setSuggestingTopics(true);
  setSuggestError('');
  setRagTopics(null);
  setSelectedTopic(null);
  const res = await suggestTopics(file);
  setSuggestingTopics(false);
  if (res.ok && res.data?.topics) {
    setRagTopics(res.data.topics);
  } else {
    setSuggestError('Could not analyze document. Please try again.');
  }
};
```

**New handler `handleRagGenerate`** (for the RAG Options Generate button):
```js
const handleRagGenerate = () => {
  const topic = selectedTopic?.title || ragPrompt.trim();
  onSave(topic, ragNumQ, ragMix, file); // passes file to the backend
};
```

Note: `ragNumQ` and `ragMix` will need their own state since the RAG options become active independently from the free-prompt options.

**New JSX inside `db-rag-section`** — rendered only when `file !== null`:

1. **Context Prompt textarea** — appears right after the dropzone
2. **OR divider** with subtle line
3. **Suggest Topics button** with spinner during loading + error message
4. **Topic Cards grid** — shown when `ragTopics` is not null (selectable single-choice cards)
5. **Options section** — switches from `db-rag-options-blocked` to active when `ragOptionsActive` is true

**Also reset** `ragPrompt`, `ragTopics`, `selectedTopic` when file is cleared (`clearFile`)

---

### Frontend — `dashboard.css`

New CSS classes:

| Class | Purpose |
|---|---|
| `.db-rag-prompt-wrap` | Container for the context-grounded textarea |
| `.db-rag-textarea` | Styled textarea (reuse db-ai-prompt styles but scoped to RAG) |
| `.db-rag-or-divider` | "— OR —" separator row |
| `.db-rag-suggest-btn` | The "Suggest Topics" button (teal ghost style) |
| `.db-rag-suggest-btn.loading` | Spinner state |
| `.db-rag-topics-grid` | Grid container for topic cards |
| `.db-rag-topic-card` | Individual topic card (radio-like selection) |
| `.db-rag-topic-card.selected` | Active/selected state (teal border + background) |
| `.db-rag-topic-title` | Topic name inside card |
| `.db-rag-topic-desc` | Topic description inside card |

---

## State Reset Rules

| Event | Reset |
|---|---|
| File cleared (`clearFile`) | `ragPrompt`, `ragTopics`, `selectedTopic`, `suggestError` |
| New file selected | Same as above (fresh start) |
| User types in `ragPrompt` | Clear `selectedTopic` (only one active at a time) |
| User selects a topic card | Clear `ragPrompt` (only one active at a time) |

---

## Open Questions

> [!IMPORTANT]
> **1. Separate numQ/mix for RAG Options?**
> The RAG panel's Options (numQ, mix) are currently separate selects from Panel 1. Should they share the same `numQ`/`mix` state, or be fully independent? (Independent = cleaner UX, shared = simpler state)

> [!NOTE]
> **2. How many topics to suggest?**
> 3–5 is the proposed default from the AI. Should the user be able to regenerate/retry the topic list?

> [!NOTE]
> **3. Mutual exclusivity UX**
> When both `ragPrompt` and a `selectedTopic` could be active, we auto-clear one when the other is used. Should there be a more explicit "OR" visual separation, or is the auto-clear behavior enough?

---

## Verification Plan

- Upload a `.pdf` file → confirm context-prompt textarea and Suggest Topics button appear
- Type in textarea → confirm Options unlocks; clear textarea → Options locks again
- Click "Suggest Topics" → confirm spinner, then 3–5 topic cards appear
- Select a topic card → confirm it highlights, Options unlock, textarea clears
- Select a different topic → only one highlighted at a time
- Click Generate Quiz in RAG Options → confirm it calls `onSave` with correct topic + file
- Confirm free-prompt Panel 1 Generate still works independently
