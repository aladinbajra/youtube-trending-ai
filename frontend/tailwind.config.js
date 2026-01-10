/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#9333EA',
        accent: '#3B82F6',
        background: {
          start: '#0A0A0A',
          end: '#121212',
        },
        card: {
          start: '#1C1C1C',
          end: '#0A0A0A',
        },
        text: {
          heading: '#FAFAFA',
          body: '#A1A1AA',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'youtube': 'linear-gradient(135deg, #FF0000, #FF1744)',
        'viral': 'linear-gradient(135deg, #FF0000, #9333EA, #3B82F6)',
        'card-gradient': 'linear-gradient(135deg, #1C1C1C, #0A0A0A)',
        'background-gradient': 'linear-gradient(180deg, #0A0A0A, #121212)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(255, 0, 0, 0.3)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 0, 0.6)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

