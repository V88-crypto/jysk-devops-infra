/** @type {import('tailwindcss').Config} */

// Colours that change with the theme point to CSS variables from
// src/styles/global.css (light values in :root, dark ones in .dark).
const themed = (name) => `var(--color-${name})`

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00AAAD', // Фирменный бирюзовый
          hover: '#005F60', // Темно-бирюзовый для наведения (hover)
          dark: '#008F93', // Чуть темнее основного: hover для кнопок, ссылок и админки
          soft: themed('primary-soft'), // Ніжний бірюзовий фон (чипи, виділений рядок)
          strong: themed('primary-strong'), // Бірюзовий текст на ніжному фоні
        },
        dark: themed('fg'), // Основной темный цвет текста (черный с оттенком)
        'hover-overlay': themed('surface-strong'), // Светло-серый для оверлея на картинках при наведении
        gray: {
          medium: themed('fg-muted'), // Серый для дополнительных кнопок/текста
          light: themed('surface-muted'), // Светло-серый фон (например, в префутере)
          input: themed('surface-strong'), // Серый фон для полей ввода (Search)
          border: themed('line'), // Светло-серый для бордеров и линий
        },

        // Text placed over photos: photos stay light in both themes.
        ink: '#231F20',

        // Theme tokens: use these instead of raw hex colours.
        page: themed('page'), // фон сторінки
        surface: {
          DEFAULT: themed('surface'), // картки, шапка, модалки
          muted: themed('surface-muted'), // поля вводу, світлі блоки
          strong: themed('surface-strong'), // чипи, неактивні кнопки, hover
        },
        fg: {
          DEFAULT: themed('fg'), // основний текст
          muted: themed('fg-muted'), // другорядний текст
          subtle: themed('fg-subtle'), // підписи, плейсхолдери, дати
        },
        line: {
          DEFAULT: themed('line'), // тонкі розділювачі
          strong: themed('line-strong'), // рамки полів і кнопок
        },
        danger: {
          DEFAULT: themed('danger'),
          soft: themed('danger-soft'),
        },
        success: {
          DEFAULT: themed('success'),
          soft: themed('success-soft'),
        },
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'], // Основной шрифт сайта
        inter: ['Inter', 'sans-serif'], // Дополнительный шрифт (для SidebarMenu)
      },
    },
  },
  plugins: [],
}
