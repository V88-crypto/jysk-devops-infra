import { Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { EditEmployeeForm } from './EditEmployeeForm'
import { EmployeesList } from './EmployeesList'

const EditEmployeeRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <EditEmployeeForm
      employeeId={Number(id)}
      onBack={() => navigate('/employees')}
      onSaved={() => navigate('/employees')}
    />
  )
}

const EmployeesListRoute = () => {
  const navigate = useNavigate()

  return <EmployeesList onEdit={(id) => navigate(`/employees/${id}/edit`)} />
}

export const EmployeesPage = () => {
  return (
    <Routes>
      <Route index element={<EmployeesListRoute />} />
      <Route path=":id/edit" element={<EditEmployeeRoute />} />
    </Routes>
  )
}
