import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'

import { storeService } from '../../services/storeService'
import { warehouseService } from '../../services/warehouseService'

import { useAsyncData } from '../../../../../shared/hooks/useAsyncData'

import { fieldClass } from '../common/formFieldStyles'
import { LabeledField } from '../common/LabeledField'
import { AdminPageLayout } from '../common/AdminPageLayout'
import { PhotoUploadRow } from '../common/PhotoUploadRow'

import type { DayWorkingHours, Store } from '../../../../types/store'

interface EditStoreFormProps {
  storeId: number
  onBack: () => void
  onSaved: () => void
}

interface StoreFormState {
  name: string
  city: string
  street: string
  houseNumber: string
  warehouseId: number | null
  workingHours: DayWorkingHours[]
  photoUrl: string | null
}

const CITY_OPTIONS = ['Івано-Франківськ', 'Львів', 'Київ']

export const EditStoreForm = ({
  storeId,
  onBack,
  onSaved,
}: EditStoreFormProps) => {
  const fetchStore = useCallback(
    () => storeService.getById(storeId),
    [storeId],
  )

  const { data: store, isLoading: isStoreLoading } = useAsyncData(fetchStore)
  const { data: warehouses } = useAsyncData(warehouseService.getAll)

  const [form, setForm] = useState<StoreFormState | null>(null)
  const [formSourceStore, setFormSourceStore] = useState<Store | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (store && store !== formSourceStore) {
    setFormSourceStore(store)
    setForm({
      name: store.name,
      city: store.city,
      street: store.street,
      houseNumber: store.houseNumber,
      warehouseId: store.warehouseId,
      workingHours: store.workingHours.map((day) => ({ ...day })),
      photoUrl: store.photoUrl,
    })
  }

  const updateWorkingHours = (
    day: DayWorkingHours['day'],
    field: 'start' | 'end',
    value: string,
  ) => {
    setForm((currentForm) => {
      if (!currentForm) {
        return currentForm
      }

      return {
        ...currentForm,
        workingHours: currentForm.workingHours.map((item) =>
          item.day === day ? { ...item, [field]: value } : item,
        ),
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!store || !form || form.warehouseId === null) {
      return
    }

    setIsSaving(true)

    try {
      await storeService.update({
        ...store,
        name: form.name,
        city: form.city,
        street: form.street,
        houseNumber: form.houseNumber,
        warehouseId: form.warehouseId,
        workingHours: form.workingHours,
        photoUrl: form.photoUrl,
      })

      onSaved()
    } finally {
      setIsSaving(false)
    }
  }

  const isLoading = isStoreLoading || !form

  return (
    <AdminPageLayout>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-2xl font-semibold transition-opacity hover:opacity-70"
      >
        <span className="text-lg">‹</span> Редагування магазину
      </button>

      <div className="mb-6 border-t border-[#e0e0e0]" />

      {isLoading || !form ? (
        <p className="text-[#8a8a8a]">Завантаження...</p>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex max-w-[560px] flex-col gap-6"
        >
          <LabeledField label="Назва магазину:">
            <input
              type="text"
              disabled
              value={form.name}
              className={fieldClass}
            />
          </LabeledField>

          <LabeledField label="Адреса магазину:">
            <select
              value={form.city}
              onChange={(event) =>
                setForm({ ...form, city: event.target.value })
              }
              className={fieldClass}
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </LabeledField>

          <p className="text-sm text-[#8a8a8a]">
            Поточна адреса: {form.street} {form.houseNumber}, {form.city}
          </p>

          <LabeledField label="Склад магазину:">
            <select
              value={form.warehouseId ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  warehouseId: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className={fieldClass}
            >
              <option value="">Виберіть...</option>

              {(warehouses ?? []).map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </LabeledField>

          <div>
            <span className="mb-3 block text-sm font-medium text-[#333]">
              Робочі години:
            </span>

            <div className="flex flex-col gap-3">
              {form.workingHours.map((item) => (
                <div key={item.day}>
                  <span className="text-xs text-[#8a8a8a]">{item.day}:</span>

                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[#333]">Початок</span>

                    <input
                      type="time"
                      value={item.start}
                      onChange={(event) =>
                        updateWorkingHours(
                          item.day,
                          'start',
                          event.target.value,
                        )
                      }
                      className={`${fieldClass} w-[120px]`}
                    />

                    <span className="text-sm text-[#333]">Кінець</span>

                    <input
                      type="time"
                      value={item.end}
                      onChange={(event) =>
                        updateWorkingHours(item.day, 'end', event.target.value)
                      }
                      className={`${fieldClass} w-[120px]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PhotoUploadRow />

          <button
            type="submit"
            disabled={isSaving}
            className="h-[44px] w-[160px] rounded-[4px] bg-[#00a9ad] text-sm font-semibold text-white transition hover:bg-[#008f93] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Збереження...' : 'Зберегти'}
          </button>
        </form>
      )}
    </AdminPageLayout>
  )
}
