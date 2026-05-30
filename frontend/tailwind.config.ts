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
        // --- Legacy light-theme tokens (dormant blog/services pages) ---
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

        // --- Applied AI & SRE portfolio (dark) palette ---
        // Periwinkle accent (Stitch "primary"), renamed to avoid colliding with legacy primary.
        brand: "#b4c5ff",
        "brand-soft": "#dbe1ff",
        secondary: "#7bd0ff",
        "primary-container": "#2563eb",
        "on-primary-container": "#eeefff",
        "on-primary": "#002a78",
        "text-vibrant": "#F8FAFC",
        "on-surface": "#dce1fb",
        "on-surface-variant": "#c3c6d7",
        "border-subtle": "#334155",
        surface: "#0c1324",
        "surface-deep": "#020617",
        "surface-primary": "#0F172A",
        "surface-secondary": "#1E293B",
        "surface-container": "#191f31",
        "surface-container-low": "#151b2d",
      },
      fontFamily: {
        display: ["var(--font-header)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
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
