import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'

import { employeeService } from '@/features/admin/api/employeeService'
import { storeService } from '@/features/admin/api/storeService'
import type { Employee } from '@/features/admin/types/employee'

import { useAsyncData } from '@/shared/hooks/useAsyncData'

import { fieldClass } from '@/features/admin/components/common/formFieldStyles'
import { LabeledField } from '@/features/admin/components/common/LabeledField'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

interface EditEmployeeFormProps {
  employeeId: number
  onBack: () => void
  onSaved: () => void
}

interface EmployeeFormState {
  fullName: string
  position: string
  email: string
  storeId: number | null
  phone: string
}

export const EditEmployeeForm = ({
  employeeId,
  onBack,
  onSaved,
}: EditEmployeeFormProps) => {
  const fetchEmployee = useCallback(
    () => employeeService.getById(employeeId),
    [employeeId],
  )

  const { data: employee, isLoading: isEmployeeLoading } =
    useAsyncData(fetchEmployee)

  const { data: stores } = useAsyncData(storeService.getAll)

  const [form, setForm] = useState<EmployeeFormState | null>(null)
  const [formSourceEmployee, setFormSourceEmployee] = useState<Employee | null>(
    null,
  )
  const [isSaving, setIsSaving] = useState(false)

  if (employee && employee !== formSourceEmployee) {
    setFormSourceEmployee(employee)
    setForm({
      fullName: employee.fullName,
      position: employee.position,
      email: employee.email,
      storeId: employee.storeId,
      phone: employee.phone,
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!employee || !form) {
      return
    }

    setIsSaving(true)

    try {
      await employeeService.update({
        ...employee,
        fullName: form.fullName,
        position: form.position,
        email: form.email,
        storeId: form.storeId,
        phone: form.phone,
      })

      onSaved()
    } finally {
      setIsSaving(false)
    }
  }

  const isLoading = isEmployeeLoading || !form

  return (
    <AdminPageLayout>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-2xl font-semibold transition-opacity hover:opacity-70"
      >
        <span className="text-lg">‹</span> Редагування картки працівника
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      {isLoading || !form ? (
        <p className="text-[#8a8a8a]">Завантаження...</p>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex max-w-[560px] flex-col gap-6"
        >
          <LabeledField label="Ім'я та прізвище працівника">
            <input
              type="text"
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              className={fieldClass}
            />
          </LabeledField>

          <LabeledField label="Посада">
            <input
              type="text"
              value={form.position}
              onChange={(event) =>
                setForm({ ...form, position: event.target.value })
              }
              className={fieldClass}
            />
          </LabeledField>

          <LabeledField label="Ел. пошта">
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className={fieldClass}
            />
          </LabeledField>

          <LabeledField label="Коментар">
            <select
              value={form.storeId ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  storeId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className={fieldClass}
            >
              <option value="">Назва магазину</option>

              {(stores ?? []).map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </LabeledField>

          <LabeledField label="Телефон">
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              className={fieldClass}
            />
          </LabeledField>

          <button
            type="submit"
            disabled={isSaving}
            className="h-[44px] w-[160px] rounded-[4px] bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>
        </form>
      )}
    </AdminPageLayout>
  )
}
