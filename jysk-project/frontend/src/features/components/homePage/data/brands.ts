import type { Brand } from '../../../types/homePage'

const placeholderLogo = '/images/brand-placeholder.svg'

export const brands: Brand[] = [
  {
    id: 1,
    name: 'Hästens',
    logoUrl: placeholderLogo,
    description:
      'Бренд, відомий своїми розкішними матрацами, які роблять із натуральних матеріалів з акцентом на якість та комфорт.',
  },
  {
    id: 2,
    name: 'Svenska Hem',
    logoUrl: placeholderLogo,
    description:
      'Бренд пропонує широкий вибір меблів та товарів для дому, що поєднують стиль та функціональність.',
  },
  {
    id: 3,
    name: 'Fritz Hansen',
    logoUrl: placeholderLogo,
    description:
      'Знаменита меблева компанія, що виробляє дизайнерські меблі та аксесуари, включаючи культові вироби від відомих дизайнерів.',
  },
  {
    id: 4,
    name: 'MUUTO',
    logoUrl: placeholderLogo,
    description:
      'Пропонує сучасні меблі, освітлення та аксесуари з акцентом на скандинавський дизайн та простоту.',
  },
]
