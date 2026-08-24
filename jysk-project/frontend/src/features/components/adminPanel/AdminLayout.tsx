import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { AdminSideBar } from './components/AdminSideBar'
import { StockPage } from './components/Warehouses/StockPage'
import { WarehousesListPage } from './components/Warehouses/WarehousesListPage'
import { WriteOffsPage } from './components/Warehouses/WriteOffs/WriteOffsPage'
import { DeliveriesPage } from './components/Warehouses/Deliveries/DeliveriesPage'
import { TransfersPage } from './components/Warehouses/Transfers/TransfersPage'
import { StoresPage } from './components/Stores/StoresPage'
import { EmployeesPage } from './components/Employees/EmployeesPage'
import { ClientsPage } from './components/Clients/ClientsPage'
import { OrdersPage } from './components/Orders/OrdersPage'
import { BlogsPage } from './components/Blogs/BlogsPage'
import { ReviewsPage } from './components/Reviews/ReviewsPage'
import { ProductsPage } from './components/EditAddProducts/ProductsPage'
import { AdminPageLayout } from './components/common/AdminPageLayout'
import type { AdminNavItem, AdminNavItemId } from './navigation'
import {
  BOTTOM_NAV_ITEMS,
  TOP_LEVEL_NAV_ITEMS,
  WAREHOUSE_NAV_ITEMS,
} from './navigation'

const ALL_NAV_ITEMS: AdminNavItem[] = [
  ...TOP_LEVEL_NAV_ITEMS,
  ...WAREHOUSE_NAV_ITEMS,
  ...BOTTOM_NAV_ITEMS,
]

const ComingSoonPage = ({ itemId }: { itemId: AdminNavItemId }) => {
  const label = ALL_NAV_ITEMS.find((item) => item.id === itemId)?.label ?? ''

  return (
    <AdminPageLayout>
      <div className="flex min-h-[60vh] items-center justify-center text-[#8a8a8a]">
        Розділ «{label}» у розробці
      </div>
    </AdminPageLayout>
  )
}

const getActiveItem = (pathname: string): AdminNavItemId => {
  const [, firstSegment] = pathname.split('/')

  return (firstSegment || 'stock') as AdminNavItemId
}

export const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const activeItem = getActiveItem(location.pathname)

  return (
    <div>
      <AdminSideBar
        activeItem={activeItem}
        onSelect={(id) => navigate(`/${id}`)}
      />

      <Routes>
        <Route index element={<Navigate to="/stock" replace />} />

        <Route path="products/*" element={<ProductsPage />} />

        <Route path="warehouses" element={<WarehousesListPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="deliveries/*" element={<DeliveriesPage />} />
        <Route path="transfers/*" element={<TransfersPage />} />
        <Route path="writeOffs/*" element={<WriteOffsPage />} />

        <Route path="stores/*" element={<StoresPage />} />
        <Route path="employees/*" element={<EmployeesPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="blogs/*" element={<BlogsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />

        <Route path="*" element={<ComingSoonPage itemId={activeItem} />} />
      </Routes>
    </div>
  )
}
