/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magenta: '#DC00D3',
        cyan: '#0CFFFF',
        navy: '#100425',
        'bg-dark': '#0a0014',
        'bg-mid': '#1a0535',
      },
      fontFamily: {
        josefin: ['Josefin Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220,0,211,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220,0,211,0.6), 0 0 80px rgba(12,255,255,0.3)' },
        },
      },
    },
  },
  plugins: [],
}
