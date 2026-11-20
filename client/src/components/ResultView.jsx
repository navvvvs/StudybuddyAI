// components/ResultView.jsx
// Displays the AI-generated results (summary, flashcards, quiz) in tabs.

import { useState } from 'react';
import { FileText, CreditCard, HelpCircle } from 'lucide-react';
import Flashcards from './Flashcards';
import Quiz from './Quiz';

const TABS = [
  { id: 'summary',    label: 'Summary',    Icon: FileText   },
  { id: 'flashcards', label: 'Flashcards', Icon: CreditCard },
  { id: 'quiz',       label: 'Quiz',       Icon: HelpCircle },
];

export default function ResultView({ studySet }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (!studySet) return null;

  return (
    <div className="bg-white rounded-2xl shadow-warm-md border border-warm-border overflow-hidden animate-slide-up">
      {/* Study set title header */}
      <div className="bg-cream-100 border-b border-warm-border px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-warm-muted/60 mb-0.5">
          Study Set
        </p>
        <h2 className="font-black text-warm-text text-xl leading-tight">{studySet.title}</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 px-4 pt-4 pb-2 border-b border-warm-border">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            onClick={() => setActiveTab(id)}
            className={`tab-btn flex items-center gap-1.5 ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === 'summary' && (
          <div className="animate-fade-in">
            <h3 className="text-xs font-bold uppercase tracking-widest text-warm-muted/60 mb-3">
              Summary
            </h3>
            <p className="text-warm-text leading-relaxed text-sm">{studySet.summary}</p>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <Flashcards flashcards={studySet.flashcards} />
        )}

        {activeTab === 'quiz' && (
          <Quiz quiz={studySet.quiz} />
        )}
      </div>
    </div>
  );
}
