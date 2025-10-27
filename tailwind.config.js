/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
        "bg-darker": "var(--color-bg-darker)",
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


        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        card: {
          DEFAULT: "var(--color-bg-light)",
          foreground: "var(--color-text)",
        },
        popover: {
          DEFAULT: "var(--color-bg-light)",
          foreground: "var(--color-text)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "white",
        },
        secondary: {
          DEFAULT: "var(--color-accent)",
          foreground: "white",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-text)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "white",
        },
        destructive: {
          DEFAULT: "#dc2626",
          foreground: "white",
        },
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--color-primary)",
      },

      keyframes: {
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "gradient-fast": "gradient-move 4s ease infinite",
      },

      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
