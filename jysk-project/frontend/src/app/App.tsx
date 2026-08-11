import { Favorites } from "../features/profilePage/components/Favourites"
import { OrderList } from "../features/profilePage/components/OrderItem"
import { ProfileInfo } from "../features/profilePage/components/ProfileInfo"

function App() {
  return (
    <main>
      <ProfileInfo />
      <OrderList />
      <Favorites />
    </main>
  )
}

export default App
