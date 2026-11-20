// src/App.jsx
// Root component. Manages global state: history list, current study set, loading/error.

import { useState, useEffect } from 'react';
import { BookOpenCheck, AlertCircle } from 'lucide-react';
import NotesForm from './components/NotesForm';
import ResultView from './components/ResultView';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import History from './components/History';
import Loader from './components/Loader';
import { createStudySet, listStudySets, getStudySet, deleteStudySet } from './api';

export default function App() {
  const [history, setHistory] = useState([]);           // list items from GET /api/studysets
  const [activeSet, setActiveSet] = useState(null);    // full study set object
  const [isLoading, setIsLoading] = useState(false);   // generating in progress
  const [error, setError] = useState(null);            // friendly error message string

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const data = await listStudySets();
      setHistory(data);
    } catch (err) {
      // Don't block the UI for history fetch errors; just log
      console.warn('Could not load history:', err.message);
    }
  }

  // Handle form submission: generate + save new study set
  async function handleGenerate(title, notes) {
    setIsLoading(true);
    setError(null);
    setActiveSet(null);

    try {
      const saved = await createStudySet(title, notes);
      setActiveSet(saved);
      // Prepend to history list
      setHistory((prev) => [
        { id: saved.id, title: saved.title, created_at: saved.created_at, summary: saved.summary },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Load a saved study set from history
  async function handleSelectFromHistory(id) {
    if (activeSet?.id === id) return; // already loaded
    setIsLoading(true);
    setError(null);

    try {
      const full = await getStudySet(id);
      setActiveSet(full);
    } catch (err) {
      setError(err.message || 'Could not load that study set.');
    } finally {
      setIsLoading(false);
    }
  }

  // Delete a study set
  async function handleDelete(id) {
    try {
      await deleteStudySet(id);
      setHistory((prev) => prev.filter((s) => s.id !== id));
      if (activeSet?.id === id) {
        setActiveSet(null); // clear the result view
      }
    } catch (err) {
      setError(err.message || 'Could not delete that study set.');
    }
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* ===== Header ===== */}
      <header className="bg-white border-b border-warm-border shadow-warm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-500 shadow-warm">
            <BookOpenCheck size={19} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-warm-text text-lg leading-none">StudyBuddy AI</h1>
            <p className="text-warm-muted text-xs font-medium leading-none mt-0.5">
              Turn notes into study sets instantly
            </p>
          </div>
        </div>
      </header>

      {/* ===== Main layout ===== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ---- Left column: form + results ---- */}
          <div className="flex flex-col gap-6">

            {/* Notes form card */}
            <section className="bg-white rounded-2xl border border-warm-border shadow-warm p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-black text-warm-text text-lg">Create a Study Set</h2>
                <p className="text-warm-muted text-sm mt-1">
                  Paste your notes and let's turn them into something easier to study ✨
                </p>
              </div>
              <NotesForm onSubmit={handleGenerate} isLoading={isLoading} />
            </section>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm animate-fade-in"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <Loader message="Reading your notes and crafting your study set… almost there!" />
            )}

            {/* Results */}
            {!isLoading && activeSet && (
              <ResultView studySet={activeSet} />
            )}

            {/* Empty state (no active set, not loading) */}
            {!isLoading && !activeSet && !error && (
              <div className="text-center py-12 text-warm-muted/60 text-sm">
                <BookOpenCheck size={36} className="mx-auto mb-3 text-warm-border" />
                <p className="font-semibold">Your study set will appear here</p>
                <p className="mt-1">Fill in the form above and hit "Generate Study Set"</p>
              </div>
            )}
          </div>

          {/* ---- Right column: history sidebar ---- */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <History
              history={history}
              activeId={activeSet?.id}
              onSelect={handleSelectFromHistory}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </aside>

        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="text-center py-6 text-xs text-warm-muted/50 border-t border-warm-border mt-8">
        StudyBuddy AI — powered by Gemini &amp; Supabase
      </footer>
    </div>
  );
}
