// components/History.jsx
// Sidebar list of saved study sets. Clicking one loads it; each has a delete button.

import { Clock, Trash2, BookOpen } from 'lucide-react';

/**
 * @param {Array}    history        - Array of { id, title, created_at, summary }
 * @param {string}   activeId       - Currently loaded set's id
 * @param {Function} onSelect       - Called with id when user clicks a set
 * @param {Function} onDelete       - Called with id when user confirms delete
 * @param {boolean}  isLoading      - Disables interactions while generating
 */
export default function History({ history, activeId, onSelect, onDelete, isLoading }) {
  function handleDelete(e, id) {
    e.stopPropagation(); // don't trigger onSelect
    if (window.confirm('Delete this study set? This cannot be undone.')) {
      onDelete(id);
    }
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="bg-white rounded-2xl border border-warm-border shadow-warm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-warm-border bg-cream-100">
        <BookOpen size={15} className="text-accent-500" />
        <h3 className="font-bold text-sm text-warm-text">My Study Sets</h3>
        {history.length > 0 && (
          <span className="ml-auto text-xs font-bold bg-accent-100 text-accent-600 rounded-full px-2 py-0.5">
            {history.length}
          </span>
        )}
      </div>

      {/* List */}
      {history.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-warm-muted text-xs">No study sets yet.</p>
          <p className="text-warm-muted/60 text-xs mt-1">Generate your first one above!</p>
        </div>
      ) : (
        <ul className="divide-y divide-warm-border max-h-[60vh] overflow-y-auto">
          {history.map((set) => (
            <li key={set.id}>
              <button
                id={`history-item-${set.id}`}
                onClick={() => !isLoading && onSelect(set.id)}
                disabled={isLoading}
                className={`group w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 hover:bg-cream-100 disabled:opacity-50 ${
                  activeId === set.id ? 'bg-accent-50 border-l-2 border-accent-500' : ''
                }`}
              >
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-warm-text truncate leading-tight">
                    {set.title}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-warm-muted mt-0.5">
                    <Clock size={10} />
                    {formatDate(set.created_at)}
                  </p>
                </div>

                {/* Delete button */}
                <button
                  id={`delete-btn-${set.id}`}
                  onClick={(e) => handleDelete(e, set.id)}
                  aria-label="Delete study set"
                  className="flex-shrink-0 p-1 rounded-lg text-warm-muted/40 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                >
                  <Trash2 size={13} />
                </button>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
