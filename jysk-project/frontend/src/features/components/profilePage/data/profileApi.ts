import type { Profile } from '../../../types/profile'
import { mockFetch } from '../../../../shared/api/mockDelay'

const profileData: Profile = {
  id: 1,
  name: 'Василь Васильєв',
  email: 'something@gmail.com',
  phone: '+380 12 345 67 89',
  avatar: 'https://i.pravatar.cc/303',
  ordersCount: 1,
  completedOrdersCount: 26,
  reviewsCount: 5,
  favoritesCount: 5,
}

export const getProfile = async (): Promise<Profile> => {
  return mockFetch(profileData, 500)
}
