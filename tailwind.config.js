/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#000000',
          white: '#FFFFFF',
          green: '#00FF00',
          amber: '#FFBF00',
        },
      },
      fontFamily: {
        commodore: ['"Commodore 64 Pixelized"', 'monospace'],
        vt323: ['VT323', 'monospace'],
        pressStart: ['"Press Start 2P"', 'monospace'],
        mono: ['monospace'],
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
