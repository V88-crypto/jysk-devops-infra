/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00AAAD', // Фирменный бирюзовый
          hover: '#005F60',   // Темно-бирюзовый для наведения (hover)
          dark: '#008F93',    // Чуть темнее основного: hover для кнопок, ссылок и админки
        },
        dark: '#231F20',      // Основной темный цвет текста (черный с оттенком)
        'hover-overlay': '#D9D9D9', // Светло-серый для оверлея на картинках при наведении
        gray: {
          medium: '#555555',  // Серый для дополнительных кнопок/текста
          light: '#F4F4F4',   // Светло-серый фон (например, в префутере)
          input: '#D9D9D9',   // Серый фон для полей ввода (Search)
          border: '#E0E0E0'   // Светло-серый для бордеров и линий
        }
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'], // Основной шрифт сайта
        inter: ['Inter', 'sans-serif'],  // Дополнительный шрифт (для SidebarMenu)
      }
    },
  },
  plugins: [],
}