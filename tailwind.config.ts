import type {Config} from 'tailwindcss';

/**
 * AKAL design tokens — reproduced exactly from the prototype (PROJET_AKAL.md §3
 * and akal_prototype.html :root). Each token is also exposed as a CSS variable
 * in globals.css so raw `var(--…)` and rgba() variants can be used where needed.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Institutional blue — the tagelmust blue
        indigo: {
          DEFAULT: '#1F2A5E',
          deep: '#141C42'
        },
        // Background sand tones
        sable: {
          DEFAULT: '#FAF7F1',
          2: '#F1EBDD'
        },
        // Accent — Sahel laterite earth
        laterite: {
          DEFAULT: '#B45E23',
          soft: '#E8D9C8'
        },
        // Gold — endonyms & accents
        or: '#E9C46A',
        encre: '#1D1B17',
        gris: '#6B675E',
        ligne: '#DDD5C4',
        ok: '#2F6B4F'
      },
      fontFamily: {
        serif: ['Georgia', "'Times New Roman'", 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          "'Segoe UI'",
          'Roboto',
          'Arial',
          'sans-serif'
        ]
      },
      keyframes: {
        marquee: {
          from: {transform: 'translateX(0)'},
          to: {transform: 'translateX(-50%)'}
        }
      },
      animation: {
        marquee: 'marquee 30s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
