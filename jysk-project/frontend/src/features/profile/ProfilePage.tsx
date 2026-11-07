import { ProfileInfo } from './components/ProfileInfo'
import { Favorites } from './components/Favorites'
import { OrderList } from './components/OrderList'
import { Reviews } from './components/Reviews'
import { useProfileData } from './hooks/useProfileData'

export const ProfilePage = () => {
  const { orders, favorites, reviews, removeFavorite, cancelOrder } =
    useProfileData()

  const counts = {
    orders: orders.status === 'ready' ? orders.data.total : null,
    completedOrders:
      orders.status === 'ready'
        ? orders.data.items.filter((order) => order.status === 'delivered')
            .length
        : null,
    reviews: reviews.status === 'ready' ? reviews.data.total : null,
    favorites: favorites.status === 'ready' ? favorites.data.length : null,
  }

  return (
    <>
      <ProfileInfo counts={counts} />
      <OrderList state={orders} onCancel={cancelOrder} />
      <Favorites state={favorites} onRemove={removeFavorite} />
      <Reviews state={reviews} />
    </>
  )
}
