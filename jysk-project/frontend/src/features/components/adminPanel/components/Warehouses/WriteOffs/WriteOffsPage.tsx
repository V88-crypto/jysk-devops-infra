import { Route, Routes, useNavigate } from 'react-router-dom'

import { AddWriteOffForm } from './AddWriteOffForm'
import { WriteOffsList } from './WriteOffsList'

const AddWriteOffRoute = () => {
  const navigate = useNavigate()

  return (
    <AddWriteOffForm
      onBack={() => navigate('/admin/writeOffs')}
      onSaved={() => navigate('/admin/writeOffs')}
    />
  )
}

const WriteOffsListRoute = () => {
  const navigate = useNavigate()

  return <WriteOffsList onAdd={() => navigate('/admin/writeOffs/add')} />
}

export const WriteOffsPage = () => {
  return (
    <Routes>
      <Route index element={<WriteOffsListRoute />} />
      <Route path="add" element={<AddWriteOffRoute />} />
    </Routes>
  )
}
