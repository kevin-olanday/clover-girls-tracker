/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#fff0f6',
          100: '#ffe3f1',
          200: '#ffbcdc',
          300: '#ff8dc3',
          400: '#e879a8',
          500: '#d45f90',
          600: '#b5467a',
          700: '#8f3562',
          800: '#6b2749',
          900: '#471a31',
        },
        cream: {
          50: '#fff5f8',
          100: '#ffecf2',
          200: '#ffd9e7',
          300: '#ffc4d3',
        },
        slatey: {
          50: '#f0f3f5',
          100: '#dfe5ea',
          200: '#c0cad3',
          300: '#97a7b4',
          400: '#6c8190',
          500: '#4d6577',
          600: '#3a4f60',
          700: '#2C3E50',
          800: '#243341',
          900: '#1a2730',
        },
        coral: {
          50: '#fdf3f0',
          100: '#fae3dc',
          200: '#f4c4b6',
          300: '#ec9d88',
          400: '#e27a60',
          500: '#d65f44',
          600: '#c44a30',
          700: '#a33c26',
        },
        emeraldx: {
          50: '#edf8f1',
          100: '#d2efdc',
          200: '#a6dfba',
          300: '#71c993',
          400: '#46b073',
          500: '#2f9259',
          600: '#247547',
          700: '#1c5a38',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(44, 62, 80, 0.08), 0 4px 16px -4px rgba(44, 62, 80, 0.06)',
        'soft-md': '0 4px 16px -4px rgba(44, 62, 80, 0.12), 0 8px 32px -8px rgba(44, 62, 80, 0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
