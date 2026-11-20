// components/Quiz.jsx
// 5-question multiple-choice quiz.
// Shows one question at a time; instantly reveals correct/incorrect + explanation.
// Shows a final score screen at the end.

import { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

export default function Quiz({ quiz }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);    // index of selected option
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!quiz || quiz.length === 0) {
    return <p className="text-warm-muted text-center py-8">No quiz available.</p>;
  }

  const total = quiz.length;
  const question = quiz[currentQ];
  const answered = selected !== null;

  function handleSelect(optionIndex) {
    if (answered) return; // don't allow changing answer
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    }
  }

  function handleRetry() {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  // Determine option styling
  function getOptionClass(i) {
    if (!answered) return 'quiz-option default';
    if (i === question.answerIndex) return 'quiz-option correct';
    if (i === selected) return 'quiz-option incorrect';
    return 'quiz-option default opacity-50';
  }

  // ---- Final score screen ----
  if (finished) {
    const percentage = Math.round((score / total) * 100);
    const isGreat = percentage >= 80;
    const isOk = percentage >= 60;

    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-slide-up">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isGreat ? 'bg-green-100' : isOk ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <Trophy size={36} className={isGreat ? 'text-green-500' : isOk ? 'text-yellow-500' : 'text-red-400'} />
        </div>

        <div className="text-center">
          <p className="text-3xl font-black text-warm-text">
            {score} / {total}
          </p>
          <p className="text-lg font-semibold text-warm-muted mt-1">{percentage}% correct</p>
          <p className="text-sm text-warm-muted mt-3 max-w-xs mx-auto">
            {isGreat
              ? '🎉 Nice work! You really know this material.'
              : isOk
              ? '👍 Pretty good! A little more review and you\'ll nail it.'
              : '📚 Almost there, keep going — review your notes and try again!'}
          </p>
        </div>

        <button
          id="quiz-retry-btn"
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm transition shadow-warm"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  // ---- Question screen ----
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-warm-muted">
        <span className="font-semibold">
          Question <span className="text-accent-600 font-bold">{currentQ + 1}</span> of {total}
        </span>
        <span className="font-semibold">Score: {score}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentQ) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-warm-border p-5 shadow-warm">
        <p className="font-bold text-warm-text text-base leading-snug">{question.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((option, i) => (
          <button
            key={i}
            id={`quiz-option-${i}`}
            onClick={() => handleSelect(i)}
            className={getOptionClass(i)}
            disabled={answered}
          >
            <span className="flex items-center gap-3">
              {/* Letter label */}
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  !answered
                    ? 'bg-cream-200 text-warm-muted'
                    : i === question.answerIndex
                    ? 'bg-green-400 text-white'
                    : i === selected
                    ? 'bg-red-400 text-white'
                    : 'bg-cream-200 text-warm-muted'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {option}
              {/* Icon for answered state */}
              {answered && i === question.answerIndex && (
                <CheckCircle2 size={16} className="ml-auto text-green-500 flex-shrink-0" />
              )}
              {answered && i === selected && i !== question.answerIndex && (
                <XCircle size={16} className="ml-auto text-red-500 flex-shrink-0" />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation + Next button — shown after answering */}
      {answered && (
        <div className="animate-slide-up flex flex-col gap-3">
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium border ${
              selected === question.answerIndex
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <span className="font-bold mr-1">
              {selected === question.answerIndex ? '✓ Correct! ' : '✗ Not quite. '}
            </span>
            {question.explanation}
          </div>

          <button
            id="quiz-next-btn"
            onClick={handleNext}
            className="self-end px-6 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm transition shadow-warm"
          >
            {currentQ + 1 >= total ? 'See Results →' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
