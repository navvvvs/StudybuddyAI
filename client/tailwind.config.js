/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm cream palette
        cream: {
          50: '#FEFCF8',
          100: '#FAF7F2',
          200: '#F3EDE3',
        },
        warm: {
          text: '#2D2A26',
          muted: '#6B6560',
          border: '#E8E0D5',
        },
        // Indigo accent
        accent: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        // Pastel card colors for flashcards
        pastel: {
          blue: '#DBEAFE',
          purple: '#EDE9FE',
          green: '#D1FAE5',
          yellow: '#FEF3C7',
          pink: '#FCE7F3',
          orange: '#FFEDD5',
          teal: '#CCFBF1',
          indigo: '#E0E7FF',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 2px 12px 0 rgba(45, 42, 38, 0.08)',
        'warm-md': '0 4px 24px 0 rgba(45, 42, 38, 0.12)',
        'warm-lg': '0 8px 40px 0 rgba(45, 42, 38, 0.15)',
      },
    },
  },
  plugins: [],
}
