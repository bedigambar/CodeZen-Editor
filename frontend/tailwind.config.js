/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        sans: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        zen: {
          bg:      '#0d0d0d',
          surface: '#111111',
          panel:   '#141414',
          border:  '#2a2a2a',
          accent:  '#e8ff47',
          text:    '#f2f2f2',
          muted:   '#5a5a5a',
          dim:     '#3a3a3a',
        },
        // keep a minimal primary alias for any legacy usage
        primary: {
          400: '#e8ff47',
          500: '#c8dd30',
        },
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease-out forwards',
        'fade-up-slow': 'fadeUp 0.8s ease-out forwards',
        'type-cursor':  'typeCursor 1s step-end infinite',
        'slide-in':     'slideInLeft 0.5s ease-out forwards',
        'scale-in':     'scaleIn 0.2s ease-out forwards',
        'fade-in':      'fadeUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
        typeCursor: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        slideInLeft: {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to':   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to':   { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
