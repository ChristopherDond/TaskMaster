/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Map to CSS variables so theme switching just swaps :root vars
        b0:  'var(--b0)',
        b1:  'var(--b1)',
        b2:  'var(--b2)',
        b3:  'var(--b3)',
        bh:  'var(--bh)',
        bd:  'var(--bd)',
        bd2: 'var(--bd2)',
        t0:  'var(--t0)',
        t1:  'var(--t1)',
        t2:  'var(--t2)',
        ac:  'var(--ac)',
        tc:  'var(--tc)',
        am:  'var(--am)',
        ar:  'var(--ar)',
        pur: 'var(--pur)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      boxShadow: {
        'ac':  '0 0 20px rgba(88, 101, 249, 0.25)',
        'tc':  '0 0 20px rgba(0, 212, 160, 0.25)',
        'glow': '0 4px 32px rgba(88, 101, 249, 0.15)',
      },
    },
  },
  plugins: [],
}