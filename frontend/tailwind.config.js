/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          500: '#4545dc',
          600: '#3a3ab8',
          700: '#2f2f94',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'gradient': 'gradient 8s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
        'text-reveal': 'textReveal 1s ease-out',
        'scale-up': 'scaleUp 0.5s ease-out',
        'shine': 'shine 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% -200%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
      },
    },
  },
  plugins: [],
}
