/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        primary: "#214E3E",
        secondary: "#A28756",
        accent: "#D8C59C",
        muted: "#65726D",
        background: "#F5F3ED",
        surface: "#FFFEFA",
        foreground: "#17231F",
        card: "#FFFFFF",
        rolexGreen: "#214E3E",
        rolexGold: "#856938",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 18px 55px rgba(28, 49, 42, 0.10)',
        'glow': '0 0 0 4px rgba(155, 128, 80, 0.16)'
      }
    },
  },
  plugins: [],
}
