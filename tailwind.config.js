/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B08',
        card: '#0D1510',
        'card-subtle': '#0A100C',
        'panel-border': 'rgba(212, 175, 55, 0.15)',
        'panel-hover': 'rgba(255, 255, 255, 0.04)',
        dhanu: {
          bg: '#070B08',
          surface: '#0D1510',
          surface2: '#121E17',
          surface3: '#182A20',
          border: 'rgba(212, 175, 55, 0.2)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          // Dark Green & Black + Gold palette
          emerald: '#10B981',
          forest: '#059669',
          deepForest: '#064E3B',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#B8860B',
          amber: '#F59E0B',
          muted: '#9CA3AF',
          text: '#F9FAFB',
          darkText: '#6B7280',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        '3d-sm': '0 2px 0 0 rgba(212, 175, 55, 0.3), 0 4px 12px rgba(0, 0, 0, 0.6)',
        '3d-btn': '0 4px 0 0 #8C6D07, 0 8px 16px rgba(212, 175, 55, 0.35)',
        '3d-btn-emerald': '0 4px 0 0 #064E3B, 0 8px 16px rgba(16, 185, 129, 0.35)',
        '3d-card': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(212, 175, 55, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        '3d-card-hover': '0 12px 30px -4px rgba(212, 175, 55, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
