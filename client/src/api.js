// src/api.js
// Thin wrapper around fetch() for all backend API calls.
// All requests go to /api/... and are proxied to Express by Vite in dev.

const BASE = '/api';

/**
 * Helper: wraps fetch and throws a friendly Error on non-2xx responses.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

/** POST /api/studysets — generate and save a new study set */
export function createStudySet(title, notes) {
  return request('/studysets', {
    method: 'POST',
    body: JSON.stringify({ title, notes }),
  });
}

/** GET /api/studysets — list all sets (id, title, created_at, summary) */
export function listStudySets() {
  return request('/studysets');
}

/** GET /api/studysets/:id — full study set row */
export function getStudySet(id) {
  return request(`/studysets/${id}`);
}

/** DELETE /api/studysets/:id */
export function deleteStudySet(id) {
  return request(`/studysets/${id}`, { method: 'DELETE' });
}
