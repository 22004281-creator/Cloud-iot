/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#020617',
        card: '#0f172a',
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      borderRadius: {
        xl: '18px'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(2,6,23,0.6)',
        glass: '0 10px 30px rgba(2,6,23,0.5)'
      }
    }
  },
  plugins: []
}
