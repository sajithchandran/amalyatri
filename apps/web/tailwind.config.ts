import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // ── shadcn-style CSS variable bridge (so utilities like `border-border` resolve) ──
        border: 'var(--border)',
        input:  'var(--border)',
        ring:   'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--brand)',
          foreground: 'var(--brand-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: '#b5453a',
          foreground: '#fbf8f3',
        },
        card: {
          DEFAULT: 'var(--background)',
          foreground: 'var(--foreground)',
        },
        popover: {
          DEFAULT: 'var(--background)',
          foreground: 'var(--foreground)',
        },
        // ── Amal Yatri brand palette ──────────────────────────────────────────
        // Inspired by Kerala's nature: forest green, palm cream, deep clay,
        // copper sunrise, and a soft lotus accent. Calm, grounded, premium.
        forest: {
          50:  '#f3f6f3',
          100: '#dde7de',
          200: '#bccfbf',
          300: '#94b29a',
          400: '#6f9176',
          500: '#52745a',
          600: '#3f5b46',
          700: '#34483a',
          800: '#2a3930',
          900: '#1f2c25',
          950: '#101814',
        },
        clay: {
          50:  '#fbf7f4',
          100: '#f3e8df',
          200: '#e8d4c2',
          300: '#d8b89e',
          400: '#c89574',
          500: '#b87b58',
          600: '#a26646',
          700: '#82533b',
          800: '#664133',
          900: '#4a3024',
          950: '#2a1a14',
        },
        sun: {
          50:  '#fdf8ed',
          100: '#f6ead0',
          200: '#ebd19d',
          300: '#dfb566',
          400: '#d59c40',
          500: '#bf822c',
          600: '#9e6823',
          700: '#7c4f1d',
          800: '#5d3c19',
          900: '#3f2913',
        },
        cream: '#fbf8f3',
        ink:   '#1f2c25',
        leaf:  '#3f5b46',
        lotus: '#e8d4c2',
      },
      fontFamily: {
        // Serif for headlines / Pull-quotes / Brand. Sans for body.
        display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        sans:    ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial scale tuned for the calm aesthetic
        'display-2xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg':  ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'display-sm':  ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'soft':  '0 1px 2px rgba(31,44,37,.04), 0 4px 12px rgba(31,44,37,.06)',
        'glow':  '0 0 0 1px rgba(63,91,70,.06), 0 8px 24px rgba(63,91,70,.08)',
        'inset': 'inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(31,44,37,.04)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.04)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 600ms cubic-bezier(.22,.61,.36,1) both',
        'breathe': 'breathe 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      backgroundImage: {
        'soft-mesh':
          'radial-gradient(circle at 20% 0%, rgba(232,212,194,.6), transparent 50%), radial-gradient(circle at 80% 30%, rgba(82,116,90,.18), transparent 60%), linear-gradient(180deg, #fbf8f3 0%, #f3e8df 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
