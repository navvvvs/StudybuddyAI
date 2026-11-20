// components/Loader.jsx
// Friendly loading spinner shown while Gemini processes notes.

export default function Loader({ message = 'Working on it...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
      {/* Spinning ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-cream-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-500 animate-spin" />
      </div>
      <p className="text-warm-muted font-semibold text-sm">{message}</p>
    </div>
  );
}
