/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purity: {
          bg: '#F8F9FA',
          card: '#FFFFFF',
          teal: '#4FD1C5',
          tealDark: '#319795',
          tealLight: '#E6FFFA',
          dark: '#2D3748',
          gray: '#718096',
          lightGray: '#A0AEC0',
          border: '#E2E8F0',
          navy: '#1A1F37',
        },
        risk: {
          high: '#E53E3E',
          highBg: '#FFF5F5',
          highText: '#C53030',
          med: '#DD6B20',
          medBg: '#FFFAF0',
          medText: '#C05621',
          low: '#38A169',
          lowBg: '#F0FFF4',
          lowText: '#276749'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
        'card': '0px 3.5px 5.5px rgba(0, 0, 0, 0.02)',
        'teal': '0 4px 12px rgba(79, 209, 197, 0.3)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
