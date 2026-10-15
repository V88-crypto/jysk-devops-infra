import fritzLogo from '@/assets/images/fritz.png'
import hastensLogo from '@/assets/images/hastens.png'
import muutoLogo from '@/assets/images/muuto.png'
import svenskaLogo from '@/assets/images/svenska.png'
import type { Brand } from '@/features/home/types'

export const brands: Brand[] = [
  {
    id: 1,
    name: 'Hästens',
    logoUrl: hastensLogo,
    description:
      'Бренд, відомий своїми розкішними матрацами, які роблять із натуральних матеріалів з акцентом на якість та комфорт.',
  },
  {
    id: 2,
    name: 'Svenska Hem',
    logoUrl: svenskaLogo,
    description:
      'Бренд пропонує широкий вибір меблів та товарів для дому, що поєднують стиль та функціональність.',
  },
  {
    id: 3,
    name: 'Fritz Hansen',
    logoUrl: fritzLogo,
    description:
      'Знаменита меблева компанія, що виробляє дизайнерські меблі та аксесуари, включаючи культові вироби від відомих дизайнерів.',
  },
  {
    id: 4,
    name: 'MUUTO',
    logoUrl: muutoLogo,
    description:
      'Пропонує сучасні меблі, освітлення та аксесуари з акцентом на скандинавський дизайн та простоту.',
  },
]
