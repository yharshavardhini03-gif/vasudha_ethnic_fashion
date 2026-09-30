/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#0C3B10',
            dark: '#07240a',
            deep: '#0a300d',
            light: '#145419',
            muted: '#1b6320',
          },
          gold: {
            DEFAULT: '#DBAB7D',
            light: '#eed0b4',
            dark: '#b37f4e',
            subtle: '#f7ede2',
            shimmer: '#fcf6f0',
          },
          white: '#FFFFFF',
          cream: '#FAF7F2',
          sand: '#F3ECE2',
          charcoal: '#1A1A1A',
          muted: '#666666',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(12, 59, 16, 0.12)',
        'luxury-lg': '0 20px 40px -15px rgba(12, 59, 16, 0.2)',
        'gold-glow': '0 0 25px rgba(219, 171, 125, 0.35)',
        'card-hover': '0 15px 35px -5px rgba(12, 59, 16, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'slide-left': 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      }
    },
  },
  plugins: [],
}
