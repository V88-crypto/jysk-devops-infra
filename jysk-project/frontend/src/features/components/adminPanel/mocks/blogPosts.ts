import type { BlogPost } from '../../../types/homePage'

const woodCareImage = 'https://placehold.co/80x80?text=Wood'
const interiorImage1 = 'https://placehold.co/200x140?text=Interior+1'
const interiorImage2 = 'https://placehold.co/200x140?text=Interior+2'

const contentTitle =
  'Вибір меблів — це не просто покупка нових предметів інтер’єру.'

const contentBody =
  'Це створення атмосфери, де ви будете відчувати себе комфортно і затишно. Ми підготували кілька порад, які допоможуть вам знайти ідеальні меблі для вашого дому. Перш ніж почати шопінг, подумайте про стиль вашого інтер’єру. Чи віддасте ви перевагу класичному, сучасному, мінімалістичному або скандинавському стилю? Вибір стилю допоможе звузити ваш пошук і зробити його більш цілеспрямованим. Перед покупкою меблів виміряйте приміщення. Пам’ятайте, що меблі повинні не лише вписуватися в інтер’єр, але й залишати достатньо місця для пересування. Використовуйте схеми або онлайн-планувальники, щоб візуалізувати, як меблі виглядатимуть у вашому просторі. Не економте на якості! Вибирайте меблі з надійними матеріалами, які витримають навантаження та прослужать вам довгий час. Дерево, метал та якісні текстильні матеріали — це те, на що варто звернути увагу.'

const createContentBlocks = (): BlogPost['contentBlocks'] => [
  {
    id: 1,
    type: 'gallery',
    images: [interiorImage1, interiorImage2],
    title: '',
    body: '',
  },
  {
    id: 2,
    type: 'text',
    images: [],
    title: contentTitle,
    body: contentBody,
  },
  {
    id: 3,
    type: 'gallery',
    images: [interiorImage1, interiorImage2],
    title: '',
    body: '',
  },
  {
    id: 4,
    type: 'text',
    images: [],
    title: contentTitle,
    body: contentBody,
  },
]

export const mockAdminBlogPosts: BlogPost[] = [
  {
    id: 1,
    title:
      'Секрети довговічності: як доглядати за меблями з натурального дерева',
    description:
      'Правильний догляд допомагає меблям з дерева залишатися красивими роками.',
    imageUrl: woodCareImage,
    imageAlt: 'Догляд за дерев’яними меблями',
    category: 'Догляд',
    keywords: ['Догляд', 'Меблі', 'Балкон', 'Вітальня'],
    contentBlocks: createContentBlocks(),
  },
  {
    id: 2,
    title:
      'Секрети довговічності: як доглядати за меблями з натурального дерева',
    description:
      'Правильний догляд допомагає меблям з дерева залишатися красивими роками.',
    imageUrl: woodCareImage,
    imageAlt: 'Догляд за дерев’яними меблями',
    category: 'Догляд',
    keywords: ['Догляд', 'Меблі'],
    contentBlocks: createContentBlocks(),
  },
  {
    id: 3,
    title:
      'Секрети довговічності: як доглядати за меблями з натурального дерева',
    description:
      'Правильний догляд допомагає меблям з дерева залишатися красивими роками.',
    imageUrl: woodCareImage,
    imageAlt: 'Догляд за дерев’яними меблями',
    category: 'Догляд',
    keywords: ['Догляд', 'Меблі'],
    contentBlocks: createContentBlocks(),
  },
]
