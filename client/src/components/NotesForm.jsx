// components/NotesForm.jsx
// The main input form: title + textarea for notes, with character counter.

import { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';

const MIN_CHARS = 50;
const MAX_CHARS = 8000;

export default function NotesForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const charCount = notes.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const tooShort = charCount > 0 && charCount < MIN_CHARS;
  const tooLong = charCount > MAX_CHARS;

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || isLoading) return;
    onSubmit(title.trim(), notes.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title input */}
      <div>
        <label htmlFor="study-title" className="block text-sm font-semibold text-warm-text mb-1.5">
          Title <span className="text-warm-muted font-normal">(optional)</span>
        </label>
        <input
          id="study-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Chapter 5 — Photosynthesis"
          maxLength={120}
          disabled={isLoading}
          className="w-full px-4 py-2.5 rounded-xl border border-warm-border bg-white text-warm-text placeholder:text-warm-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-500 transition disabled:opacity-50"
        />
      </div>

      {/* Notes textarea */}
      <div>
        <label htmlFor="study-notes" className="block text-sm font-semibold text-warm-text mb-1.5">
          Your Notes <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <textarea
            id="study-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your notes here and let's turn them into something easier to study! Aim for at least a paragraph or two..."
            rows={12}
            maxLength={MAX_CHARS}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-xl border bg-white text-warm-text placeholder:text-warm-muted/60 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition disabled:opacity-50 ${
              tooLong
                ? 'border-red-400 focus:ring-red-200'
                : tooShort
                ? 'border-yellow-400 focus:ring-yellow-200'
                : 'border-warm-border focus:ring-accent-200 focus:border-accent-500'
            }`}
          />
          <FileText
            size={16}
            className="absolute top-3 right-3 text-warm-muted/40 pointer-events-none"
          />
        </div>

        {/* Character counter row */}
        <div className="flex justify-between items-center mt-1.5">
          <span className={`text-xs ${tooShort ? 'text-yellow-600' : tooLong ? 'text-red-500' : 'text-warm-muted'}`}>
            {tooShort
              ? `${MIN_CHARS - charCount} more characters needed`
              : tooLong
              ? `${charCount - MAX_CHARS} characters over limit`
              : charCount >= MIN_CHARS
              ? '✓ Ready to generate'
              : 'At least 50 characters needed'}
          </span>
          <span className={`text-xs font-mono ${tooLong ? 'text-red-500' : 'text-warm-muted'}`}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Submit button */}
      <button
        id="generate-btn"
        type="submit"
        disabled={!isValid || isLoading}
        className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white font-bold text-sm shadow-warm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Sparkles size={16} />
        {isLoading ? 'Generating…' : 'Generate Study Set'}
      </button>
    </form>
  );
}
