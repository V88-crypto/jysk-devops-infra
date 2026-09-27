import { useMemo, useState } from 'react'

import { employeeService } from '@/features/components/adminPanel/services/employeeService'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { SearchField } from '@/features/components/adminPanel/components/common/SearchField'
import { RowEditButton } from '@/features/components/adminPanel/components/common/RowEditButton'
import { RowDeleteButton } from '@/features/components/adminPanel/components/common/RowDeleteButton'
import { formatDocumentDate } from '@/features/components/adminPanel/utils/formatDocumentDate'
import { AdminPageLayout } from '@/features/components/adminPanel/components/common/AdminPageLayout'

interface EmployeesListProps {
  onEdit: (employeeId: number) => void
}

export const EmployeesList = ({ onEdit }: EmployeesListProps) => {
  const { data: employees, isLoading } = useAsyncData(employeeService.getAll)

  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (employees ?? []).filter((employee) => {
      if (deletedIds.has(employee.id)) {
        return false
      }

      return normalizedSearch
        ? employee.fullName
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch) ||
            employee.login.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true
    })
  }, [employees, deletedIds, search])

  const handleDelete = async (id: number) => {
    setDeletingId(id)

    try {
      await employeeService.delete(id)
      setDeletedIds((current) => new Set(current).add(id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Працівники</h1>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
            {filteredEmployees.length}
          </span>
        </div>

        <button
          type="button"
          className="h-[40px] rounded-[4px] bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Додати
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Ім'я ˅</th>
              <th className="px-4 py-3 font-normal">Логін</th>
              <th className="px-4 py-3 font-normal">Пін-код</th>
              <th className="px-4 py-3 font-normal">Посада</th>
              <th className="px-4 py-3 font-normal">Дата останнього входу</th>
              <th className="px-4 py-3" />
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">{employee.fullName}</td>
                <td className="px-4 py-3">{employee.login}</td>
                <td className="px-4 py-3">{employee.pinCode}</td>
                <td className="px-4 py-3">{employee.position}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDocumentDate(employee.lastLoginAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowEditButton onClick={() => onEdit(employee.id)} />
                </td>
                <td className="px-4 py-3 text-right">
                  <RowDeleteButton
                    disabled={deletingId === employee.id}
                    onClick={() => void handleDelete(employee.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredEmployees.length === 0 && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Нічого не знайдено
          </p>
        )}

        {isLoading && (
          <p className="px-4 py-10 text-center text-[#8a8a8a]">
            Завантаження...
          </p>
        )}
      </div>
    </AdminPageLayout>
  )
}
