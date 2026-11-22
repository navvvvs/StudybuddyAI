# StudyBuddy AI

> Paste your study notes and get a smart **summary**, **8 flashcards**, and a **5-question quiz** — powered by Google Gemini and saved to Supabase.

---

## Features

- **AI-powered summarisation** — 4–6 sentence overview of your notes
- **Flip flashcards** — 8 key term/definition cards with a 3D flip animation
- **Multiple-choice quiz** — 5 questions, instant feedback, final score
- **History sidebar** — all past study sets saved and reloadable
- **Delete** unwanted sets with a single click
- Fully responsive — works on mobile and desktop

---

## Tech Stack

| Layer    | Technology                                                 |
|----------|------------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS v3, lucide-react              |
| Backend  | Node.js, Express (ESM)                                     |
| Database | Supabase (hosted Postgres) via `@supabase/supabase-js`     |
| AI       | Google Gemini via `@google/genai`                          |
| Dev      | concurrently, nodemon                                      |

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), sign in, and create a new project.

### 2. Create the `study_sets` table

Open the **SQL Editor** in your Supabase dashboard and run the contents of [`server/db/schema.sql`](server/db/schema.sql):

```sql
CREATE TABLE study_sets (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text          NOT NULL DEFAULT 'Untitled notes',
  notes       text          NOT NULL,
  summary     text,
  flashcards  jsonb         NOT NULL DEFAULT '[]',
  quiz        jsonb         NOT NULL DEFAULT '[]',
  created_at  timestamptz   NOT NULL DEFAULT now()
);
```

### 3. Get your credentials

| Setting            | Where to find it                                                                 |
|--------------------|----------------------------------------------------------------------------------|
| `SUPABASE_URL`     | Project Settings → API → **Project URL**                                         |
| `SUPABASE_SERVICE_KEY` | Project Settings → API → **service_role** key (⚠️ keep this secret!)        |

---

## Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Get API key** and copy it.
3. Paste it into `server/.env` as `GEMINI_API_KEY`.

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd studybuddy-ai

# 2. Install all dependencies (root + server + client)
npm run install-all

# 3. Create the .env file
cd server
cp .env.example .env
# → Edit .env and fill in your SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY

# 4. Start development servers (runs both backend & frontend)
cd ..
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/api/health

---

## API Endpoints

| Method | Endpoint               | Description                                     |
|--------|------------------------|-------------------------------------------------|
| GET    | `/api/health`          | Health check — `{ ok: true }`                  |
| POST   | `/api/studysets`       | Generate + save a new study set                 |
| GET    | `/api/studysets`       | List all sets (id, title, created_at, summary)  |
| GET    | `/api/studysets/:id`   | Fetch full study set by ID                      |
| DELETE | `/api/studysets/:id`   | Delete a study set by ID                        |

### POST `/api/studysets` body
```json
{
  "title": "Chapter 5 — Photosynthesis",
  "notes": "Your study notes (50–8000 characters)..."
}
```

---

## Future Improvements

- User authentication (Supabase Auth)
- Export flashcards as a PDF
- Spaced-repetition scheduling for flashcards
- Support pasting from PDFs or uploading `.txt` files
- Shareable links for study sets
- Dark mode

---

## Important Notes

- The `SUPABASE_SERVICE_KEY` is **never** sent to the browser. It lives in `server/.env` only.
- The backend validates all input before calling Gemini (min 50 chars, max 8000 chars).
- Gemini is called with `responseMimeType: 'application/json'` to minimise parsing issues.
