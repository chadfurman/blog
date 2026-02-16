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
        "background-alt": "rgb(var(--background-alt))",
        "background-warm": "rgb(var(--background-warm))",
        foreground: "rgb(var(--foreground))",
        primary: "rgb(var(--primary))",
        accent: "rgb(var(--accent))",
        muted: "rgb(var(--muted))",
        highlight: "rgb(var(--highlight))",
        "footer-bg": "rgb(var(--footer-bg))",
        transparent: 'transparent',
        current: 'currentColor',
      },
    },
  },
  safelist: [
    'list-disc',
    'pl-8',
    'mx-auto',
    'w-fit'
  ],
  plugins: [],
} satisfies Config;
