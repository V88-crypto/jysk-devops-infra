import { useMemo, useState } from 'react'

import { clientGroupService } from '../../services/clientGroupService'
import { clientService } from '../../services/clientService'

import { useAsyncData } from '../../../../../shared/hooks/useAsyncData'

import { FilterDropdown } from '../common/FilterDropdown'
import { SearchField } from '../common/SearchField'
import { RowDeleteButton } from '../common/RowDeleteButton'
import { AdminPageLayout } from '../common/AdminPageLayout'

export const ClientsPage = () => {
  const { data: clients, isLoading: isClientsLoading } = useAsyncData(
    clientService.getAll,
  )

  const { data: groups, isLoading: isGroupsLoading } = useAsyncData(
    clientGroupService.getAll,
  )

  const [search, setSearch] = useState('')
  const [groupId, setGroupId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletedIds, setDeletedIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  )

  const isLoading = isClientsLoading || isGroupsLoading

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA')

    return (clients ?? []).filter((client) => {
      if (deletedIds.has(client.id)) {
        return false
      }

      const matchesSearch = normalizedSearch
        ? `${client.firstName} ${client.lastName}`
            .toLocaleLowerCase('uk-UA')
            .includes(normalizedSearch) ||
          client.email.toLocaleLowerCase('uk-UA').includes(normalizedSearch)
        : true

      const matchesGroup = groupId === null || client.groupId === groupId

      return matchesSearch && matchesGroup
    })
  }, [clients, deletedIds, search, groupId])

  const handleDelete = async (id: number) => {
    setDeletingId(id)

    try {
      await clientService.delete(id)
      setDeletedIds((current) => new Set(current).add(id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Клієнти</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {filteredClients.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField value={search} onChange={setSearch} />

        <FilterDropdown
          label="Група"
          options={groups ?? []}
          selectedId={groupId}
          onSelect={setGroupId}
        />

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-[#333] transition-opacity hover:opacity-70"
        >
          Фільтр <span>+</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
              <th className="px-4 py-3 font-normal">Ім'я ˅</th>
              <th className="px-4 py-3 font-normal">Прізвище</th>
              <th className="px-4 py-3 font-normal">Пошта</th>
              <th className="px-4 py-3 font-normal">Телефон</th>
              <th className="px-4 py-3 font-normal">Загальна сума</th>
              <th className="px-4 py-3 font-normal">Середній чек</th>
              <th className="px-4 py-3 font-normal">Дії</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-[#f0f0f0] last:border-0"
              >
                <td className="px-4 py-3">{client.firstName}</td>
                <td className="px-4 py-3">{client.lastName}</td>
                <td className="px-4 py-3">{client.email}</td>
                <td className="px-4 py-3">{client.phone}</td>
                <td className="px-4 py-3">{client.totalSum}₴</td>
                <td className="px-4 py-3">{client.averageCheck}₴</td>
                <td className="px-4 py-3">
                  <RowDeleteButton
                    disabled={deletingId === client.id}
                    onClick={() => void handleDelete(client.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && filteredClients.length === 0 && (
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
