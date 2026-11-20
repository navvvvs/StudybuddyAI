// routes/studysets.js
// All REST endpoints for study sets. Mounted at /api/studysets in index.js.
// Uses Supabase for data persistence and Gemini for AI content generation.

import { Router } from 'express';
import supabase from '../db/supabase.js';
import { generateStudyContent } from '../services/gemini.js';

const router = Router();

/* ------------------------------------------------------------------ */
/*  POST /api/studysets                                                 */
/*  Body: { title?: string, notes: string }                            */
/*  Validates input, calls Gemini, saves to DB, returns saved row.     */
/* ------------------------------------------------------------------ */
router.post('/', async (req, res) => {
  try {
    const { title, notes } = req.body;

    // --- Input validation ---
    if (!notes || typeof notes !== 'string') {
      return res.status(400).json({ error: 'notes is required and must be a string.' });
    }

    const trimmedNotes = notes.trim();

    if (trimmedNotes.length < 50) {
      return res
        .status(400)
        .json({ error: 'Notes must be at least 50 characters long so we have enough to work with.' });
    }

    if (trimmedNotes.length > 8000) {
      return res
        .status(400)
        .json({ error: 'Notes must be 8000 characters or fewer. Please trim them down a bit.' });
    }

    const cleanTitle = (title && title.trim()) || 'Untitled notes';

    // --- Call Gemini to generate study content ---
    let aiContent;
    try {
      aiContent = await generateStudyContent(trimmedNotes);
    } catch (err) {
      console.error('Gemini generation failed:', err.message);
      return res
        .status(502)
        .json({ error: `AI generation failed: ${err.message}. Please try again.` });
    }

    // --- Save to Supabase ---
    const { data, error } = await supabase
      .from('study_sets')
      .insert({
        title: cleanTitle,
        notes: trimmedNotes,
        summary: aiContent.summary,
        flashcards: aiContent.flashcards,
        quiz: aiContent.quiz,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save study set to database.' });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('POST /api/studysets unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/studysets                                                  */
/*  Returns list of all study sets, newest first.                      */
/*  Only returns id, title, created_at, summary (not full notes/quiz). */
/* ------------------------------------------------------------------ */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('study_sets')
      .select('id, title, created_at, summary')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: 'Failed to fetch study sets from database.' });
    }

    return res.json(data);
  } catch (err) {
    console.error('GET /api/studysets unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/studysets/:id                                             */
/*  Returns the full row for a single study set.                       */
/* ------------------------------------------------------------------ */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('study_sets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      // Supabase returns PGRST116 when no row is found with .single()
      return res.status(404).json({ error: 'Study set not found.' });
    }

    return res.json(data);
  } catch (err) {
    console.error('GET /api/studysets/:id unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

/* ------------------------------------------------------------------ */
/*  DELETE /api/studysets/:id                                          */
/*  Deletes a study set by ID.                                         */
/* ------------------------------------------------------------------ */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('study_sets').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete study set.' });
    }

    return res.json({ ok: true, message: 'Study set deleted.' });
  } catch (err) {
    console.error('DELETE /api/studysets/:id unexpected error:', err);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  }
});

export default router;
