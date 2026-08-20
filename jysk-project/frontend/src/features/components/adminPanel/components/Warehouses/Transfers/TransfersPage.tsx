import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddTransferForm } from './AddTransferForm'
import { TransfersList } from './TransfersList'

const AddTransferRoute = () => {
  const navigate = useNavigate()

  return (
    <AddTransferForm
      onBack={() => navigate('/transfers')}
      onSaved={() => navigate('/transfers')}
    />
  )
}

const TransfersListRoute = () => {
  const navigate = useNavigate()

  return <TransfersList onAdd={() => navigate('/transfers/add')} />
}

export const TransfersPage = () => {
  return (
    <Routes>
      <Route index element={<TransfersListRoute />} />
      <Route path="add" element={<AddTransferRoute />} />
    </Routes>
  )
}
