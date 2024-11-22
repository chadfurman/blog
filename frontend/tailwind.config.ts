import type {Config} from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lowlight: "var(--lowlight)",
        highlight: "var(--highlight)",
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
  },
  plugins: [],
} satisfies Config;
