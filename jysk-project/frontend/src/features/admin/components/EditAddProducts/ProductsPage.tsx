import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddProduct } from './AddProduct/AddProduct'
import { EditProduct } from './EditProduct/EditProduct'
import { ProductsList } from './ProductsList'

const ProductsListRoute = () => {
  const navigate = useNavigate()

  return (
    <ProductsList
      onAdd={() => navigate('/admin/products/add')}
      onEdit={(id) => navigate(`/admin/products/${id}/edit`)}
    />
  )
}

export const ProductsPage = () => {
  return (
    <Routes>
      <Route index element={<ProductsListRoute />} />
      <Route path="add" element={<AddProduct />} />
      <Route path=":id/edit" element={<EditProduct />} />
    </Routes>
  )
}
