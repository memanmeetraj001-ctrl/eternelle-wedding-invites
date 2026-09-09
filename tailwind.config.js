/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', '"Great Vibes"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        olive: {
          50: '#f6f7f2',
          100: '#eaede2',
          200: '#d5dcbe',
          300: '#bac795',
          400: '#9fb170',
          500: '#849750',
          600: '#67773d',
          700: '#4e5b30',
          800: '#3f4929',
          900: '#363e25',
          950: '#1d2312',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f8d1d8',
          300: '#f2abb8',
          400: '#e8788e',
          500: '#d94c6a',
          600: '#bf3152',
          700: '#9f2441',
          800: '#842038',
          900: '#541525',
          950: '#3b0b17',
        },
        gold: {
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b89628',
          700: '#927318',
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        }
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
