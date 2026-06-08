/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#050507',
        surface: '#0d0d12',
        panel: '#13131a',
        border: '#1e1e2e',
        accent: {
          DEFAULT: '#7c6af7',
          light: '#a89cf8',
          glow: 'rgba(124, 106, 247, 0.35)',
        },
        gold: {
          DEFAULT: '#f5c842',
          glow: 'rgba(245, 200, 66, 0.3)',
        },
        muted: '#4a4a6a',
        text: {
          primary: '#eaeaf5',
          secondary: '#9898b8',
          dim: '#5a5a7a',
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px)`,
        'hero-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,106,247,0.25), transparent)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'glow-accent': '0 0 40px rgba(124, 106, 247, 0.3)',
        'glow-gold': '0 0 40px rgba(245, 200, 66, 0.25)',
        'panel': '0 4px 32px rgba(0,0,0,0.5)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}