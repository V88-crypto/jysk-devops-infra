import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddTransferForm } from './AddTransferForm'
import { TransfersList } from './TransfersList'

const AddTransferRoute = () => {
  const navigate = useNavigate()

  return (
    <AddTransferForm
      onBack={() => navigate('/admin/transfers')}
      onSaved={() => navigate('/admin/transfers')}
    />
  )
}

const TransfersListRoute = () => {
  const navigate = useNavigate()

  return <TransfersList onAdd={() => navigate('/admin/transfers/add')} />
}

export const TransfersPage = () => {
  return (
    <Routes>
      <Route index element={<TransfersListRoute />} />
      <Route path="add" element={<AddTransferRoute />} />
    </Routes>
  )
}
