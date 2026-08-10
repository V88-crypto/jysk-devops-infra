import type { Profile } from '../profile'

const profileData: Profile = {
  id: 1,
  name: 'Василь Васильєв',
  email: 'something@gmail.com',
  phone: '+380123456789',
  avatar: 'https://i.pravatar.cc/303',
  ordersCount: 1,
  completedOrdersCount: 26,
  reviewsCount: 5,
  favoritesCount: 5,
}

export const getProfile = async (): Promise<Profile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(profileData)
    }, 500)
  })
}