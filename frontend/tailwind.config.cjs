/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Adjust paths based on your project structure
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      backgroundColor: {
        dark: {
          primary: "#0f172a",
          secondary: "#1e293b",
          accent: "#2563eb",
        },
      },
      textColor: {
        dark: {
          primary: "#f8fafc",
          secondary: "#cbd5e1",
          accent: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};
