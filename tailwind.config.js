/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
],
   theme: {
    extend: {
      fontFamily: {
        clarity: ["'Clarity City'", "sans-serif"],
      },
      colors: {
        bg: "var(--color-bg)",
        "bg-light": "var(--color-bg-light)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-10": "var(--color-primary-10)",
        "primary-30": "var(--color-primary-30)",
        accent: "var(--color-accent)",
        "accent-10": "var(--color-accent-10)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        white: "var(--color-white)",
      },
      keyframes: {
    'gradient-move': {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
    },
  },
  animation: {
    'gradient-fast': 'gradient-move 4s ease infinite',
  },
    },
    
  },
  plugins: [],
};
