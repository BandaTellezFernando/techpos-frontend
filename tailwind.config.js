/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Esto nos permite controlar el tema manualmente con un botón
  theme: {
    extend: {
      colors: {
        ruby: {
          // Colores para el Modo Claro
          bgLight: '#FEF2F2',
          panelLight: '#FFFFFF',
          textLight: '#450A0A',
          priceLight: '#DC2626',
          // Colores para el Modo Oscuro
          bgDark: '#1A1515',
          panelDark: '#261C1D',
          textDark: '#FEE2E2',
          priceDark: '#F87171',
          // Color de Acción Global (El rojo vibrante)
          accent: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}