import type { Order } from '../profile'

const orders: Order[] = [
  {
    id: 1,
    orderNumber: '12345',
    date: '2024-11-20',
    status: 'виконано',
    totalPrice: 1798,
    items: [
      {
        id: 1,
        name: 'BISTRUP',
        description: 'Стілець обідній BISTRUP обліковий/дуб',
        quantity: 2,
        price: 899,
        image: '/images/chair.png',
      },
      {
        id: 2,
        name: 'VELJBY',
        description: 'Софа-ліжко VELJBY з шезлонгом',
        quantity: 2,
        price: 899,
        image: '/images/sofa.png',
      },
    ],
  },
  {
    id: 2,
    orderNumber: '12346',
    date: '2024-11-18',
    status: 'виконано',
    totalPrice: 2499,
    items: [
      {
        id: 3,
        name: 'JENSLEV',
        description: 'Стіл обідній JENSLEV',
        quantity: 1,
        price: 2499,
        image: '/images/table.png',
      },
    ],
  },
  {
    id: 3,
    orderNumber: '12345',
    date: '2024-11-20',
    status: 'виконано',
    totalPrice: 1798,
    items: [
      {
        id: 1,
        name: 'BISTRUP',
        description: 'Стілець обідній BISTRUP обліковий/дуб',
        quantity: 2,
        price: 899,
        image: '/images/chair.png',
      },
      {
        id: 2,
        name: 'VELJBY',
        description: 'Софа-ліжко VELJBY з шезлонгом',
        quantity: 2,
        price: 899,
        image: '/images/sofa.png',
      },
    ],
  },
]

export const getOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders)
    }, 500)
  })
}