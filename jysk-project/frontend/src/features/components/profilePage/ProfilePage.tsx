import { ProfileInfo } from './components/ProfileInfo'
import { Favorites } from './components/Favourites'
import { OrderList } from './components/OrderItem'
import { Reviews } from './components/Reviews'

export const ProfilePage = () => {
  return (
    <>
      <ProfileInfo />
      <OrderList />
      <Favorites />
      <Reviews />
    </>
  )
}
