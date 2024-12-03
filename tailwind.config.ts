import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cutive: ['"Cutive"', 'serif'],
        work: ['"Work Sans"', 'sans-serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'], 
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
