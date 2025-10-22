import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        "noki-primary": "var(--noki-primary)",
        "noki-secondary": "var(--noki-secondary)",
        "noki-tertiary": "var(--noki-tertiary)",
      },
    },
  },
  plugins: [],
};

export default config;
