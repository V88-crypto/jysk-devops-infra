import type { Product } from '@/features/admin/types/product'

export const mockProducts: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: 'Стілець Oslo',
    slug: 'stilets-oslo',
    description:
      'Мʼякий обідній стілець із зеленим тканинним сидінням та деревʼяними ніжками.',
    createdAt: '2026-08-12T09:00:00.000Z',
    variants: [
      {
        id: 1,
        productId: 1,
        sku: 'OSLO-GREEN-001',
        price: 2999,
        stock: 12,
        createdAt: '2026-08-12T09:00:00.000Z',
        images: [
          {
            id: 1,
            variantId: 1,
            imageUrl: '/images/products/oslo-1.svg',
            isPrimary: true,
            sortOrder: 1,
            createdAt: '2026-08-12T09:00:00.000Z',
          },
          {
            id: 2,
            variantId: 1,
            imageUrl: '/images/products/oslo-2.svg',
            isPrimary: false,
            sortOrder: 2,
            createdAt: '2026-08-12T09:00:00.000Z',
          },
        ],
        attributes: [
          {
            id: 1,
            variantId: 1,
            attributeId: 1,
            value: 'Зелений',
          },
          {
            id: 2,
            variantId: 1,
            attributeId: 2,
            value: 'Тканина',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    categoryId: 2,
    name: 'Стіл Bilbao',
    slug: 'stil-bilbao',
    description: 'Компактний білий стіл для кухні або невеликої обідньої зони.',
    createdAt: '2026-08-12T09:30:00.000Z',
    variants: [
      {
        id: 2,
        productId: 2,
        sku: 'BILBAO-WHITE-001',
        price: 5499,
        stock: 5,
        createdAt: '2026-08-12T09:30:00.000Z',
        images: [
          {
            id: 3,
            variantId: 2,
            imageUrl: '/images/products/bilbao-1.svg',
            isPrimary: true,
            sortOrder: 1,
            createdAt: '2026-08-12T09:30:00.000Z',
          },
        ],
        attributes: [
          {
            id: 3,
            variantId: 2,
            attributeId: 1,
            value: 'Білий',
          },
          {
            id: 4,
            variantId: 2,
            attributeId: 2,
            value: 'МДФ',
          },
          {
            id: 5,
            variantId: 2,
            attributeId: 3,
            value: '80 см',
          },
        ],
      },
    ],
  },
]
