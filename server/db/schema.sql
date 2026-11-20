-- StudyBuddy AI - Database Schema (Documentation Only)
-- Run this SQL in your Supabase SQL Editor to create the table.
-- The app does NOT create this table automatically.

CREATE TABLE study_sets (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text          NOT NULL DEFAULT 'Untitled notes',
  notes       text          NOT NULL,
  summary     text,
  flashcards  jsonb         NOT NULL DEFAULT '[]',
  -- flashcards shape: [{ front: string, back: string }, ...]
  quiz        jsonb         NOT NULL DEFAULT '[]',
  -- quiz shape: [{ question: string, options: [string, string, string, string], answerIndex: number, explanation: string }, ...]
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- Optional: add an index on created_at for faster ordering
CREATE INDEX idx_study_sets_created_at ON study_sets(created_at DESC);
