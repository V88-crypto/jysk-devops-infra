import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddProduct } from './AddProduct/AddProduct'
import { EditProduct } from './EditProduct/EditProducts'
import { ProductsList } from './ProductsList'

const ProductsListRoute = () => {
  const navigate = useNavigate()

  return (
    <ProductsList
      onAdd={() => navigate('/products/add')}
      onEdit={(id) => navigate(`/products/${id}/edit`)}
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
