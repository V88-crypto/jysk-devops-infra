import { Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { EditStoreForm } from './EditStoreForm'
import { StoresList } from './StoresList'

const EditStoreRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <EditStoreForm
      storeId={Number(id)}
      onBack={() => navigate('/stores')}
      onSaved={() => navigate('/stores')}
    />
  )
}

const StoresListRoute = () => {
  const navigate = useNavigate()

  return <StoresList onEdit={(id) => navigate(`/stores/${id}/edit`)} />
}

export const StoresPage = () => {
  return (
    <Routes>
      <Route index element={<StoresListRoute />} />
      <Route path=":id/edit" element={<EditStoreRoute />} />
    </Routes>
  )
}
