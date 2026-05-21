# GetQuiz — Developer Setup Guide

A full-stack AI quiz generation and management platform. The backend is a **FastAPI** Python server, the frontend is a **Vite + React** app styled with custom **Vanilla CSS**, the database is **Supabase (PostgreSQL)** managed via **SQLModel**, and user authentication is powered by **Clerk**.

---

## Tech Stack

| Layer | Technology | Version / Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.2.4` + Vite `^8.0.0` |
| **Routing** | React Router | `7.x` |
| **Styling** | Vanilla CSS | Custom design system (Dark Luminism) |
| **Icons** | Lucide React | `^0.577.0` |
| **Authentication** | Clerk | `@clerk/clerk-react ^5.61.4` |
| **Backend Framework** | FastAPI | `0.110.0` |
| **ORM / Database** | SQLModel | SQLAlchemy `2.0.x` + Pydantic `2.6.x` |
| **Database Provider** | Supabase | PostgreSQL (Cloud) |
| **AI Generation** | OpenRouter | default model: `openrouter/owl-alpha` |
| **Document Parser** | PyPDF + Python-Docx | For PDF/Word context grounding |

---

## Prerequisites

Ensure you have the following installed on your machine:

| Tool | Version | Verification Command | Notes |
| :--- | :--- | :--- | :--- |
| **Python** | 3.11+ | `python --version` | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18+ | `node --version` | [nodejs.org](https://nodejs.org/) |
| **Git** | any | `git --version` | [git-scm.com](https://git-scm.com/) |

You also need accounts on three external services (all of which offer free tiers):

* **Supabase** — Cloud PostgreSQL database ([supabase.com](https://supabase.com))
* **Clerk** — User authentication ([clerk.com](https://clerk.com))
* **OpenRouter** — LLM model access ([openrouter.ai](https://openrouter.ai))

---

## Project Structure

```
GetQuiz/
├── backend/                  # FastAPI Python Server
│   ├── core/
│   │   └── config.py         # Settings & environment variable configuration
│   ├── models/
│   │   ├── database.py       # SQLModel database schema & engine creation
│   │   └── schemas.py        # Pydantic request / response schemas
│   ├── routers/
│   │   ├── quizzes.py        # Quiz creation, retrieval, file uploads & deletions
│   │   ├── sessions.py       # Attempt session lifecycle endpoints
│   │   └── history.py        # Activity logging & detailed performance analytics
│   ├── services/
│   │   ├── ai_service.py     # OpenRouter API Integration (owl-alpha/Gemini)
│   │   ├── db_service.py     # Database CRUD helpers, loggers & quota logic
│   │   └── file_service.py   # Document parsers (.txt, .md, .pdf, .docx)
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # ← Create this (Backend Env variables)
│
└── frontend/                 # Vite + React Web App
    ├── src/
    │   ├── api/              # API clients & network helpers
    │   │   ├── auth.js       # Local auth/mock endpoint client
    │   │   ├── client.js     # Base apiFetch module with bearer token injection
    │   │   ├── quizzes.js    # Quiz management endpoints
    │   │   └── sessions.js   # Attempt sessions endpoints
    │   ├── components/       # UI elements (Hero, Navbar, FallingPattern, etc.)
    │   ├── context/          # React Context providers (AuthContext, ThemeContext)
    │   ├── data/             # Mock data fallback for offline development
    │   ├── lib/              # Quota hooks & client helpers
    │   │   └── useQuota.js   # localStorage usage counter & plan simulator
    │   ├── pages/            # Page/route components
    │   │   ├── Dashboard.jsx # Quizzes, AI creation interface & statistics
    │   │   ├── History.jsx   # Visual logs and attempt reviews
    │   │   ├── Landing.jsx   # Hero page with dynamic graphics
    │   │   ├── Login.jsx     # Fallback sign-in page
    │   │   ├── QuizPreview.jsx# Before starting an attempt
    │   │   ├── QuizSession.jsx# Live quiz session with countdown timer
    │   │   ├── Register.jsx  # Fallback sign-up page
    │   │   └── Results.jsx   # Detailed score screen with solutions
    │   ├── styles/           # Vanilla CSS stylesheets (auth.css, dashboard.css...)
    │   ├── App.css           # Global app styles
    │   ├── App.jsx           # App layout & Route definitions
    │   ├── index.css         # Typography, HSL themes & Dark Luminism style tokens
    │   └── main.jsx          # React app entry point & Clerk provider wrap
    ├── package.json          # Node scripts & dependencies
    └── .env                  # ← Create this (Frontend Env variables)
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/washedoutprogrammer/GetQuiz.git
cd GetQuiz
```

---

## Step 2 — Supabase Setup

### 2.1 Create a Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Select your closest hosting region and set a strong database password.

### 2.2 Get the Database URI
1. Navigate to **Project Settings → Database → Connection string → URI**.
2. Copy the URI. It will look like this:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
3. Replace `[password]` with your database password.

### 2.3 Run Database Migrations (If Upgrading Existing Databases)
The backend automatically creates all necessary tables when it starts up if the database is clean.

However, if you are connecting to an existing database from an older version of the project, you must run the following SQL script in the **Supabase SQL Editor** to add new columns and create newer system tables:

```sql
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add columns introduced after initial table creation
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'easy';
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '[]';

ALTER TABLE questions ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'mcq';

-- Make email optional (Clerk owns user profiles)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Create user_quotas table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_quotas (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quota_remaining INTEGER DEFAULT 50,
    reset_time TIMESTAMP WITH TIME ZONE
);

-- Create activity_log table if it doesn't exist
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    quiz_id VARCHAR(36),
    quiz_title TEXT,
    score INTEGER,
    attempt_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

> [!NOTE]
> On a completely fresh Supabase project, `SQLModel` creates all tables automatically on the first backend run. You do not need to execute database scripts manually.

---

## Step 3 — Clerk Setup

### 3.1 Create a Clerk Application
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/) and create a new application.
2. Select your preferred sign-in options (Email, Google, GitHub, etc.).

### 3.2 Fetch API Credentials
Navigate to **API Keys** in the Clerk dashboard sidebar:

| Key | Format | Destination |
| :--- | :--- | :--- |
| **Publishable Key** | `pk_test_...` | `frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY` |
| **Secret Key** | `sk_test_...` | Saved for backend integration (if needed in production) |

> [!CAUTION]
> Never bundle the Secret Key (`sk_test_...`) into your frontend environment file. It will expose admin privileges to anyone visiting the site.

### 3.3 Configure Paths & Redirects
In Clerk under **Configure → Paths**, update settings to match our route definitions:

| Setting | Path Value |
| :--- | :--- |
| **Sign-in URL** | `/sign-in` |
| **Sign-up URL** | `/sign-up` |
| **After Sign-in Redirect** | `/dashboard` |
| **After Sign-up Redirect** | `/dashboard` |

---

## Step 4 — OpenRouter Setup

1. Register or sign in at [openrouter.ai](https://openrouter.ai).
2. Go to **Keys** and click **Create Key**. Copy it immediately.
3. Verify your account has credits.
4. By default, the application is configured to query the `openrouter/owl-alpha` model. If you want to change the model (e.g., to `google/gemini-2.0-flash-001` or another model), change the `OPENROUTER_MODEL` constant inside `backend/services/ai_service.py`:
   ```python
   OPENROUTER_MODEL = "openrouter/owl-alpha"
   ```

---

## Step 5 — Backend Setup

### 5.1 Create & Activate the Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate the virtual environment depending on your operating system:

```bash
# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt)
.\venv\Scripts\activate.bat

# macOS / Linux
source venv/bin/activate
```

### 5.2 Install Dependencies

Install the packages in `requirements.txt`, then install `sqlmodel` (which is required by the ORM):

```bash
pip install -r requirements.txt
pip install sqlmodel
```

### 5.3 Create `backend/.env`
Create a `.env` file in the `backend/` folder and paste your credentials:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase Connection String (from Step 2.2)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Optional — Direct Gemini API Key (unused by default)
GEMINI_API_KEY=
```

### 5.4 Run the Backend Server

```bash
# Verify your virtual environment is active: "(venv)" should show in your prompt
uvicorn main:app --reload
```

Expected terminal output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [...]
INFO:     Application startup complete.
```

On start, the backend automatically sets up the following tables in Supabase:
1. `users` — Tracks authenticated users
2. `user_quotas` — Tracks generation quotas
3. `quizzes` — Header metadata for quizzes (supports soft deletes)
4. `questions` — Quiz questions (supports MCQ and True/False types)
5. `options` — Selectable answers for questions
6. `attempts` — Quiz taking histories
7. `user_answers_history` — Answers chosen during sessions
8. `activity_log` — Dashboard timeline events

Visit **[http://localhost:8000/docs](http://localhost:8000/docs)** to inspect the Swagger UI dashboard.

---

## Step 6 — Frontend Setup

### 6.1 Install Frontend Modules

```bash
cd frontend
npm install
```

### 6.2 Create `frontend/.env`
Create a `.env` file in the `frontend/` folder:

```env
# Clerk Public Credentials (from Step 3.2)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Backend Connection Endpoint
VITE_API_URL=http://localhost:8000
```

> [!TIP]
> If the backend is down or `VITE_API_URL` is omitted, the frontend automatically falls back to offline mode using mock database data in `src/data/mockQuizzes.js` to ensure the project remains functional for frontend testing.

### 6.3 Run Vite Dev Server

```bash
npm run dev
```

Expected console output:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open **[http://localhost:5173](http://localhost:5173)** in your web browser.

---

## Step 7 — Verification Checklist

Go through this checklist to verify your setup is complete:

- [ ] Landing page loads at `http://localhost:5173` with dynamic animations.
- [ ] Clicking **Get Started Free** opens the Clerk registration widget.
- [ ] Completing sign-up redirects you to `/dashboard`.
- [ ] Creating an AI Quiz via the **Quiz with AI** menu generates a quiz matching the specified topic and question count.
- [ ] Uploading a supported document (`.txt`, `.pdf`, `.docx`) suggests relevant topics and generates a grounded quiz.
- [ ] Taking the quiz via **QuizSession** calculates your score and submits answers.
- [ ] **Results** page shows correct/incorrect indicators, score, and AI explanations.
- [ ] **History** page displays activity timelines (quizzes created, completed, and deleted).
- [ ] Deleting a quiz moves it to the Trash (soft delete). Users can restore it or permanently wipe it from the DB.
- [ ] Quota sidebar shows remaining daily generation slots (Free: 10, Pro: 100, Teams: Unlimited).

---

## API Endpoints Reference

### Quizzes router (`/quizzes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/quizzes/` | Get quizzes (filters by `user_id` & `is_deleted`) |
| `GET` | `/quizzes/{quiz_id}` | Retrieve specific quiz + questions & options |
| `POST` | `/quizzes/generate` | Generate AI Quiz via OpenRouter (multipart form context) |
| `POST` | `/quizzes/suggest-topics` | Parse uploaded document & suggest 3–5 topics |
| `POST` | `/quizzes/` | Save manual quiz creations |
| `DELETE`| `/quizzes/{quiz_id}` | Soft-delete a quiz |
| `PATCH` | `/quizzes/{quiz_id}/restore` | Restore soft-deleted quiz |
| `DELETE`| `/quizzes/{quiz_id}/permanent` | Permanently purge quiz & nested attempt data |

### Attempts router (`/sessions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/sessions/` | Start a quiz attempt session |
| `POST` | `/sessions/{attempt_id}/finish`| Finish attempt, submit score & chosen answers |
| `GET` | `/sessions/` | Retrieve attempts list |

### History router (`/history`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/history/` | Fetch event activity logs (Created, Deleted, Attempted) |
| `GET` | `/history/attempts` | Fetch detailed attempts history including answers & explanations |

---

## Environment Variables Reference

### Backend Settings (`backend/.env`)
* **`DATABASE_URL`** (Required): Supabase PostgreSQL database URL connection string.
* **`OPENROUTER_API_KEY`** (Required): Bearer token credential for OpenRouter.
* **`GEMINI_API_KEY`** (Optional): Direct Gemini API key (unused by default).

### Frontend Settings (`frontend/.env`)
* **`VITE_CLERK_PUBLISHABLE_KEY`** (Required): Clerk public dashboard key.
* **`VITE_API_URL`** (Optional): FastAPI server endpoint. Defaults to `http://localhost:8000`.

---

## Common Issues & Troubleshooting

### `ModuleNotFoundError: No module named 'sqlmodel'`
You did not install `sqlmodel` after installing dependencies from `requirements.txt`.
```bash
pip install sqlmodel
```

### `400 Bad Request: Unsupported file type`
You uploaded a document format other than `.txt`, `.md`, `.pdf`, or `.docx`. Upload a compatible file type.

### `column "is_deleted" does not exist` or `relation "user_quotas" does not exist`
Your database was set up with a previous version of the application. Execute the migration SQL script in **Step 2.3** in the Supabase SQL Editor.

### `CORS Error: Blocked by CORS Policy`
The frontend URL is running on a port not allowed by the backend configurations. Check `CORS_ORIGINS` in `backend/core/config.py`.

### Clerk Redirect Loop
Confirm that you set your paths in Clerk dashboard to `/sign-in` and `/sign-up`, and redirects to `/dashboard`.
