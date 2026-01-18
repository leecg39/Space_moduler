import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-brown': '#a67c52',
        'primary-violet': '#6467f2',
        'beige-bg': '#fdfbf7',
        'beige-dark': '#f5f2eb',
        'editor-bg': '#f5f2eb',
        'editor-sidebar': '#ece8df',
        primary: {
          50: '#f5f0eb',
          100: '#e8ddd0',
          200: '#d4bb9f',
          300: '#c0996e',
          400: '#a67c52',
          500: '#8c6644',
          600: '#6b4e33',
          700: '#4a3622',
          800: '#291e11',
          900: '#19130a',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans KR',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;
