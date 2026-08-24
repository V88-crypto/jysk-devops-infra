import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddDeliveryForm } from './AddDeliveryForm'
import { DeliveriesList } from './DeliveriesList'

const AddDeliveryRoute = () => {
  const navigate = useNavigate()

  return (
    <AddDeliveryForm
      onBack={() => navigate('/deliveries')}
      onSaved={() => navigate('/deliveries')}
    />
  )
}

const DeliveriesListRoute = () => {
  const navigate = useNavigate()

  return <DeliveriesList onAdd={() => navigate('/deliveries/add')} />
}

export const DeliveriesPage = () => {
  return (
    <Routes>
      <Route index element={<DeliveriesListRoute />} />
      <Route path="add" element={<AddDeliveryRoute />} />
    </Routes>
  )
}
