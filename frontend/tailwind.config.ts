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
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        lowlight: "rgb(var(--lowlight))",
        highlight: "rgb(var(--highlight))",
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
  },
  safelist: [
    'list-disc',
    'pl-8',
  ],
  plugins: [],
} satisfies Config;
