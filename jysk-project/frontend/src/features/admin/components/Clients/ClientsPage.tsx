import { useCallback, useEffect, useState } from 'react'

import { clientService } from '@/features/admin/api/clientService'
import type { Client, ClientRole } from '@/features/admin/types/client'
import { usePagedData } from '@/features/admin/hooks/usePagedData'
import { ApiError } from '@/shared/api/httpClient'
import { useAuth } from '@/shared/auth/useAuth'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'
import { Pagination } from '@/features/admin/components/common/Pagination'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

const ROLE_LABELS: Record<ClientRole, string> = {
  customer: 'Клієнт',
  admin: 'Адміністратор',
}

const toLoadErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status === 403
    ? 'Недостатньо прав для перегляду клієнтів'
    : 'Не вдалося завантажити клієнтів'

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('uk-UA')

export const ClientsPage = () => {
  const { user: currentUser } = useAuth()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [search])

  const loadPage = useCallback(
    (page: number) =>
      clientService.getPage({
        search: debouncedSearch,
        page,
        pageSize: PAGE_SIZE,
      }),
    [debouncedSearch],
  )
  const { page, setPage, data, error, isLoading, updateItems } =
    usePagedData(loadPage)

  const clients = data?.items ?? []
  const total = data?.total ?? 0

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRoleChange = async (client: Client, role: ClientRole) => {
    const name = `${client.firstName} ${client.lastName}`
    const question =
      role === 'admin'
        ? `Надати користувачу ${name} права адміністратора?`
        : `Забрати в користувача ${name} права адміністратора?`

    if (!window.confirm(question)) {
      return
    }

    setUpdatingId(client.id)
    setActionError(null)

    try {
      const updated = await clientService.updateRole(client.id, role)

      updateItems((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      )
    } catch (error) {
      setActionError(
        error instanceof ApiError ? error.message : 'Не вдалося змінити роль',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const renderStatus = () => {
    if (error) {
      return (
        <p className="px-4 py-10 text-center text-danger">
          {toLoadErrorMessage(error)}
        </p>
      )
    }

    if (!data) {
      return (
        <p className="px-4 py-10 text-center text-fg-subtle">Завантаження...</p>
      )
    }

    if (clients.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-fg-subtle">
          Нічого не знайдено
        </p>
      )
    }

    return null
  }

  return (
    <AdminPageLayout>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Клієнти</h1>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-surface-strong px-2 text-sm font-medium text-fg-muted">
          {total}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-surface px-4 py-3 shadow-sm">
        <SearchField
          value={search}
          onChange={handleSearchChange}
          placeholder="Пошук за ім'ям, прізвищем або поштою"
        />
      </div>

      {actionError && (
        <p className="mb-4 rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-surface shadow-sm">
        <table
          className={`w-full min-w-[760px] border-collapse text-left text-sm transition-opacity ${
            isLoading && data ? 'opacity-60' : ''
          }`}
        >
          <thead>
            <tr className="border-b border-line text-fg-subtle">
              <th className="px-4 py-3 font-normal">Ім'я</th>
              <th className="px-4 py-3 font-normal">Прізвище</th>
              <th className="px-4 py-3 font-normal">Пошта</th>
              <th className="px-4 py-3 font-normal">Телефон</th>
              <th className="px-4 py-3 font-normal">Дата реєстрації</th>
              <th className="px-4 py-3 font-normal">Роль</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => {
              const isCurrentUser = client.id === currentUser?.id

              return (
                <tr
                  key={client.id}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-3">
                    {client.firstName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-fg-subtle">(ви)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{client.lastName}</td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">
                    {client.phone || <span className="text-fg-subtle">—</span>}
                  </td>
                  <td className="px-4 py-3">{formatDate(client.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={client.role}
                      disabled={isCurrentUser || updatingId === client.id}
                      title={
                        isCurrentUser
                          ? 'Не можна змінити власну роль'
                          : 'Змінити роль'
                      }
                      aria-label={`Роль користувача ${client.firstName} ${client.lastName}`}
                      onChange={(event) =>
                        void handleRoleChange(
                          client,
                          event.target.value as ClientRole,
                        )
                      }
                      className={`h-[34px] rounded-[4px] border px-2 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${
                        client.role === 'admin'
                          ? 'border-primary bg-primary-soft font-medium text-primary-strong'
                          : 'border-line-strong bg-surface-muted text-fg'
                      }`}
                    >
                      {(Object.keys(ROLE_LABELS) as ClientRole[]).map(
                        (role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {renderStatus()}
      </div>

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />
    </AdminPageLayout>
  )
}
