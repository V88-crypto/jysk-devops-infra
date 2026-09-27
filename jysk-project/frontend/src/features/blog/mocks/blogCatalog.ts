import type { BlogPost } from '@/shared/types/blog'
import type { BlogRoomFilter } from '@/features/blog/types'

const placeholderCozy = '/images/blog-cozy-placeholder.svg'
const placeholderSofa = '/images/blog-sofa-placeholder.svg'
const placeholderBlog = '/images/blog-placeholder.svg'

export const blogCategoryTabs = ['Для дому', 'Для саду', 'Для сну'] as const
export type BlogCategoryTab = (typeof blogCategoryTabs)[number]

export const blogRoomFilters: BlogRoomFilter[] = [
  { id: 'living-room', name: 'Вітальня', imageUrl: '/images/room-living.svg' },
  { id: 'kitchen', name: 'Кухня', imageUrl: '/images/room-kitchen.svg' },
  { id: 'bedroom', name: 'Спальня', imageUrl: '/images/room-bedroom.svg' },
  { id: 'bathroom', name: 'Ванна', imageUrl: '/images/room-bathroom.svg' },
  { id: 'office', name: 'Кабінет', imageUrl: '/images/room-office.svg' },
  { id: 'yard', name: 'Двір', imageUrl: '/images/room-yard.svg' },
]

type ContentBlocks = NonNullable<BlogPost['contentBlocks']>

const richContentBlocks = (topic: {
  styleTitle: string
  styleBody: string
  comfortTitle: string
  comfortBody: string
  designTitle: string
  designBody: string
}): ContentBlocks => [
  {
    id: 1,
    type: 'gallery',
    images: [placeholderCozy, placeholderSofa],
    title: '',
    body: '',
  },
  {
    id: 2,
    type: 'text',
    images: [],
    title: topic.styleTitle,
    body: topic.styleBody,
  },
  {
    id: 3,
    type: 'text',
    images: [],
    title: topic.comfortTitle,
    body: topic.comfortBody,
  },
  {
    id: 4,
    type: 'gallery',
    images: [placeholderSofa, placeholderCozy, placeholderBlog],
    title: '',
    body: '',
  },
  {
    id: 5,
    type: 'text',
    images: [],
    title: topic.designTitle,
    body: topic.designBody,
  },
  {
    id: 6,
    type: 'gallery',
    images: [placeholderCozy, placeholderSofa],
    title: '',
    body: '',
  },
]

const shortContentBlocks = (body: string): ContentBlocks => [
  {
    id: 1,
    type: 'gallery',
    images: [placeholderBlog],
    title: '',
    body: '',
  },
  {
    id: 2,
    type: 'text',
    images: [],
    title: '',
    body,
  },
]

export const blogCatalog: BlogPost[] = [
  {
    id: 1,
    title:
      'Секрети довговічності: як доглядати за меблями з натурального дерева',
    description:
      'Правильний догляд допомагає меблям з дерева залишатися красивими роками.',
    imageUrl: placeholderCozy,
    imageAlt: 'Дерев’яний стіл у затишному інтер’єрі',
    category: 'Для дому',
    contentBlocks: richContentBlocks({
      styleTitle: 'Визначте стиль',
      styleBody:
        'Перш ніж почати шопінг, подумайте про стиль вашого інтер’єру. Чи віддасте ви перевагу класичному, сучасному, мінімалістичному або скандинавському стилю? Вибір стилю допоможе звузити ваш пошук і зробити його більш цілеспрямованим.',
      comfortTitle: 'Комфорт — понад усе',
      comfortBody:
        'Коли ви обираєте меблі для вашого дому, дуже важливо, щоб вони були зручними і практичними. Комфорт — це насамперед фактор, який впливає на ваш щоденний побут, тому не забувайте випробовувати меблі перед покупкою, якщо є така можливість.',
      designTitle: 'Меблевий дизайн не стоїть на місці',
      designBody:
        'Сучасні меблі повинні не лише виглядати стильно, а й бути функціональними. Обирайте предмети, які можна використовувати для зберігання речей, з відкидними або висувними елементами. Пам’ятайте, що меблі — це інвестиція у ваш затишок, тому обирайте якісні матеріали, які прослужать довгий час.',
    }),
  },
  {
    id: 2,
    title: '10 трендів у дизайні інтер’єру 2024 року, які варто врахувати',
    description: 'Огляд головних тенденцій сезону в оформленні дому.',
    imageUrl: placeholderSofa,
    imageAlt: 'Світла вітальня у скандинавському стилі',
    category: 'Для дому',
    contentBlocks: shortContentBlocks(
      'Природні матеріали, теплі відтінки та мультифункціональні меблі — головні тренди сезону, які легко вписати у будь-який інтер’єр.',
    ),
  },
  {
    id: 3,
    title: 'Як обрати ідеальні меблі для маленької квартири',
    description: 'Компактні рішення, які економлять простір без втрати стилю.',
    imageUrl: placeholderBlog,
    imageAlt: 'Компактна спальня зі світлими меблями',
    category: 'Для дому',
    contentBlocks: shortContentBlocks(
      'Обирайте трансформери, меблі з прихованим зберіганням та світлі відтінки — вони візуально розширюють простір навіть у невеликій квартирі.',
    ),
  },
  {
    id: 4,
    title: 'Чому варто обрати модульні меблі: переваги та ідеї використання',
    description: 'Гнучкі рішення, які легко адаптувати під будь-який простір.',
    imageUrl: placeholderCozy,
    imageAlt: 'Модульний диван у сучасній вітальні',
    category: 'Для дому',
    contentBlocks: shortContentBlocks(
      'Модульні меблі дозволяють змінювати конфігурацію під різні задачі — від сімейного перегляду фільмів до прийому гостей.',
    ),
  },
  {
    id: 13,
    title: 'Нестандартне рішення: як меблі можуть змінити ваш простір',
    description: 'Незвичні прийоми, які освіжать звичний інтер’єр.',
    imageUrl: placeholderSofa,
    imageAlt: 'Незвичний акцентний інтер’єр вітальні',
    category: 'Для дому',
    contentBlocks: shortContentBlocks(
      'Один яскравий акцентний предмет меблів здатен повністю змінити сприйняття кімнати — не бійтеся експериментувати з формою та кольором.',
    ),
  },

  {
    id: 5,
    title:
      'Як обрати ідеальні меблі для саду: матеріали, які витримають будь-яку погоду',
    description:
      'Розповідаємо, на що звернути увагу під час вибору садових меблів.',
    imageUrl: placeholderSofa,
    imageAlt: 'Плетені крісла у саду',
    category: 'Для саду',
    contentBlocks: richContentBlocks({
      styleTitle: 'Визначте стиль',
      styleBody:
        'Ротанг, тік або метал з порошковим покриттям — кожен матеріал має свій характер. Обирайте меблі, які поєднуються зі стилем вашого будинку та ландшафтом ділянки.',
      comfortTitle: 'Комфорт — понад усе',
      comfortBody:
        'Зверніть увагу на м’які подушки з вологостійких тканин та ергономічну форму крісел і диванів — адже літні вечори на свіжому повітрі мають бути максимально приємними.',
      designTitle: 'Меблевий дизайн не стоїть на місці',
      designBody:
        'Сучасні виробники пропонують складані та модульні рішення, які легко прибрати на зиму. Це особливо зручно для невеликих терас і балконів.',
    }),
  },
  {
    id: 6,
    title: '5 порад для облаштування комфортної тераси',
    description: 'Практичні ідеї для затишного відпочинку на свіжому повітрі.',
    imageUrl: placeholderCozy,
    imageAlt: 'Затишна тераса з м’якими меблями',
    category: 'Для саду',
    contentBlocks: shortContentBlocks(
      'Додайте текстиль, освітлення та рослини — і навіть невелика тераса стане улюбленим місцем для відпочинку всієї родини.',
    ),
  },
  {
    id: 7,
    title: 'Скільки меблів обрати для саду: практичний гайд',
    description: 'Як розрахувати кількість посадкових місць та зон відпочинку.',
    imageUrl: placeholderBlog,
    imageAlt: 'Садовий стіл з кількома стільцями',
    category: 'Для саду',
    contentBlocks: shortContentBlocks(
      'Плануйте зони заздалегідь: місце для обіду, відпочинку та зберігання інвентарю. Це допоможе уникнути захаращення ділянки зайвими меблями.',
    ),
  },
  {
    id: 8,
    title: 'Тренди 2026: садові меблі, які створюють затишок',
    description: 'Огляд найпопулярніших рішень цього сезону.',
    imageUrl: placeholderSofa,
    imageAlt: 'Сучасні садові меблі у затишному дворику',
    category: 'Для саду',
    contentBlocks: shortContentBlocks(
      'Природні відтінки, плетені текстури та модульні дивани — головні тренди сезону, які легко поєднати з будь-яким ландшафтом.',
    ),
  },
  {
    id: 14,
    title: 'Нестандартне рішення: як облаштувати сад без зайвих витрат',
    description: 'Прості прийоми, які освіжать двір без капітальних змін.',
    imageUrl: placeholderCozy,
    imageAlt: 'Незвичний акцентний куточок у саду',
    category: 'Для саду',
    contentBlocks: shortContentBlocks(
      'Перефарбовані піддони, підвісні кашпо та гірлянди можуть змінити двір не гірше за дороге озеленення.',
    ),
  },

  {
    id: 9,
    title:
      'Чому важливо звертати увагу на жорсткість матраца: все про комфорт і підтримку',
    description: 'Пояснюємо, як правильна жорсткість впливає на якість сну.',
    imageUrl: placeholderBlog,
    imageAlt: 'Затишне ліжко зі світлою білизною',
    category: 'Для сну',
    contentBlocks: richContentBlocks({
      styleTitle: 'Визначте стиль',
      styleBody:
        'Матраци відрізняються не лише жорсткістю, а й типом наповнювача — пружинний блок, латекс або пінополіуретан. Обирайте варіант відповідно до ваги тіла та звичної пози для сну.',
      comfortTitle: 'Комфорт — понад усе',
      comfortBody:
        'Занадто м’який або занадто жорсткий матрац однаково шкідливі для хребта. Оптимальна жорсткість підтримує природні вигини тіла та знімає навантаження з проблемних зон.',
      designTitle: 'Меблевий дизайн не стоїть на місці',
      designBody:
        'Сучасні матраци поєднують кілька шарів з різною жорсткістю, а також охолоджувальні тканини, які підтримують комфортну температуру протягом усієї ночі.',
    }),
  },
  {
    id: 10,
    title: 'Правильний вибір матраца: гід для покупця',
    description: 'На що звернути увагу перед покупкою нового матраца.',
    imageUrl: placeholderCozy,
    imageAlt: 'Матрац у світлій спальні',
    category: 'Для сну',
    contentBlocks: shortContentBlocks(
      'Перевіряйте матрац особисто, якщо є можливість, і не забувайте про період адаптації — тілу потрібен час, щоб звикнути до нового матраца.',
    ),
  },
  {
    id: 11,
    title: 'Тренди матраців 2026 року',
    description: 'Які рішення для сну стають дедалі популярнішими.',
    imageUrl: placeholderSofa,
    imageAlt: 'Сучасний матрац крупним планом',
    category: 'Для сну',
    contentBlocks: shortContentBlocks(
      'Гібридні матраци з кількома зонами жорсткості та еко-матеріали — головний тренд цього року серед покупців, які цінують індивідуальний підхід до сну.',
    ),
  },
  {
    id: 12,
    title: 'Догляд за матрацом: як зберегти якість надовго',
    description: 'Прості звички, які продовжать життя вашому матрацу.',
    imageUrl: placeholderBlog,
    imageAlt: 'Акуратно застелене ліжко',
    category: 'Для сну',
    contentBlocks: shortContentBlocks(
      'Провітрюйте матрац, використовуйте наматрацник і перевертайте його раз на кілька місяців — це допоможе зберегти форму та якість надовго.',
    ),
  },
  {
    id: 15,
    title: 'Нестандартні рішення для спальні: як покращити якість сну',
    description: 'Незвичні прийоми для кращого відпочинку вночі.',
    imageUrl: placeholderSofa,
    imageAlt: 'Незвичний акцентний куточок у спальні',
    category: 'Для сну',
    contentBlocks: shortContentBlocks(
      'Щільні штори, приглушене освітлення та відмова від гаджетів перед сном допомагають організму швидше налаштуватися на відпочинок.',
    ),
  },
]
