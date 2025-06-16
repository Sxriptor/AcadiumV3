/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-bg)',
        secondary: 'var(--secondary-bg)',
        accent: 'var(--accent-color)',
      },
      backgroundColor: {
        primary: 'var(--primary-bg)',
        secondary: 'var(--secondary-bg)',
        card: 'var(--card-bg)',
        hover: 'var(--hover-bg)',
        input: 'var(--input-bg)',
      },
      textColor: {
        primary: 'var(--text-color)',
      },
      borderColor: {
        primary: 'var(--border-color)',
      },
    },
  },
  plugins: [],
};