// components/Flashcards.jsx
// Displays 8 flashcards with a CSS 3D flip animation.
// User can click a card to flip it, and navigate with Previous/Next buttons.

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

// Pastel colors for card backgrounds (cycles through)
const PASTEL_COLORS = [
  'bg-pastel-blue',
  'bg-pastel-purple',
  'bg-pastel-green',
  'bg-pastel-yellow',
  'bg-pastel-pink',
  'bg-pastel-orange',
  'bg-pastel-teal',
  'bg-pastel-indigo',
];

export default function Flashcards({ flashcards }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return <p className="text-warm-muted text-center py-8">No flashcards available.</p>;
  }

  const total = flashcards.length;
  const card = flashcards[current];
  const bgColor = PASTEL_COLORS[current % PASTEL_COLORS.length];

  function goTo(index) {
    setFlipped(false); // reset flip when navigating
    // small delay so the flip resets before card changes
    setTimeout(() => setCurrent(index), 50);
  }

  function prev() {
    if (current > 0) goTo(current - 1);
  }

  function next() {
    if (current < total - 1) goTo(current + 1);
  }

  function handleFlip() {
    setFlipped((f) => !f);
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      {/* Counter */}
      <p className="text-sm text-warm-muted font-semibold">
        Card <span className="text-accent-600 font-bold">{current + 1}</span> of{' '}
        <span className="font-bold">{total}</span>
      </p>

      {/* Flip card container */}
      <div
        className={`flip-card w-full max-w-lg cursor-pointer select-none ${flipped ? 'flipped' : ''}`}
        style={{ height: '220px' }}
        onClick={handleFlip}
        role="button"
        aria-label={flipped ? 'Click to see the front' : 'Click to flip and see the answer'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
      >
        <div className="flip-card-inner rounded-2xl shadow-warm-md">
          {/* Front */}
          <div
            className={`flip-card-front ${bgColor} rounded-2xl flex flex-col items-center justify-center p-8 gap-3`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-warm-muted/60">
              Term / Question
            </span>
            <p className="text-warm-text font-bold text-lg text-center leading-snug">
              {card.front}
            </p>
            <span className="text-xs text-warm-muted/50 mt-2 flex items-center gap-1">
              <RotateCcw size={11} /> Click to reveal
            </span>
          </div>

          {/* Back */}
          <div
            className={`flip-card-back ${bgColor} rounded-2xl flex flex-col items-center justify-center p-8 gap-3`}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-warm-muted/60">
              Definition / Answer
            </span>
            <p className="text-warm-text text-base text-center leading-relaxed">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        <button
          id="flashcard-prev-btn"
          onClick={prev}
          disabled={current === 0}
          aria-label="Previous card"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-warm-border text-warm-muted text-sm font-semibold hover:bg-cream-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === current ? 'bg-accent-500 w-5' : 'bg-warm-border hover:bg-accent-200'
              }`}
            />
          ))}
        </div>

        <button
          id="flashcard-next-btn"
          onClick={next}
          disabled={current === total - 1}
          aria-label="Next card"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-warm-border text-warm-muted text-sm font-semibold hover:bg-cream-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
