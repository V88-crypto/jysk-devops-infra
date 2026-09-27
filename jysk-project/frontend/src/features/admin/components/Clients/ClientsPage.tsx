import { useEffect, useState } from 'react'

import { clientService } from '@/features/admin/api/clientService'
import type {
  Client,
  ClientPage,
  ClientRole,
} from '@/features/admin/types/client'
import { ApiError } from '@/shared/api/httpClient'
import { useAuth } from '@/shared/auth/useAuth'

import { SearchField } from '@/features/admin/components/common/SearchField'
import { AdminPageLayout } from '@/features/admin/components/common/AdminPageLayout'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

const ROLE_LABELS: Record<ClientRole, string> = {
  customer: 'Клієнт',
  admin: 'Адміністратор',
}

type LoadResult =
  | { key: string; status: 'ready'; data: ClientPage }
  | { key: string; status: 'error'; message: string }

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
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<LoadResult | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const requestKey = `${debouncedSearch}|${page}`

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    )

    return () => window.clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    let isActive = true
    const key = `${debouncedSearch}|${page}`

    clientService
      .getPage({ search: debouncedSearch, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (isActive) {
          setResult({ key, status: 'ready', data })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setResult({
            key,
            status: 'error',
            message: toLoadErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [debouncedSearch, page])

  const isLoading = result?.key !== requestKey
  const clientPage = result?.status === 'ready' ? result.data : null
  const clients = clientPage?.items ?? []
  const total = clientPage?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const firstShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const lastShown = Math.min(page * PAGE_SIZE, total)

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

      setResult((current) =>
        current?.status === 'ready'
          ? {
              ...current,
              data: {
                ...current.data,
                items: current.data.items.map((item) =>
                  item.id === updated.id ? updated : item,
                ),
              },
            }
          : current,
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
    if (result?.status === 'error' && !isLoading) {
      return (
        <p className="px-4 py-10 text-center text-[#d33]">{result.message}</p>
      )
    }

    if (!clientPage) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">Завантаження...</p>
      )
    }

    if (clients.length === 0) {
      return (
        <p className="px-4 py-10 text-center text-[#8a8a8a]">
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

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e5e5e5] px-2 text-sm font-medium text-[#555]">
          {total}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-5 rounded-md bg-white px-4 py-3 shadow-sm">
        <SearchField
          value={search}
          onChange={handleSearchChange}
          placeholder="Пошук за ім'ям, прізвищем або поштою"
        />
      </div>

      {actionError && (
        <p className="mb-4 rounded-md bg-[#fdecec] px-4 py-3 text-sm text-[#d33]">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-md bg-white shadow-sm">
        <table
          className={`w-full min-w-[760px] border-collapse text-left text-sm transition-opacity ${
            isLoading && clientPage ? 'opacity-60' : ''
          }`}
        >
          <thead>
            <tr className="border-b border-[#e5e5e5] text-[#8a8a8a]">
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
                  className="border-b border-[#f0f0f0] last:border-0"
                >
                  <td className="px-4 py-3">
                    {client.firstName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-[#8a8a8a]">(ви)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{client.lastName}</td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">
                    {client.phone || <span className="text-[#b0b0b0]">—</span>}
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
                          ? 'border-primary bg-[#e6f7f7] font-medium text-[#00787b]'
                          : 'border-[#d5d5d5] bg-[#f4f4f4] text-[#333]'
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

      {total > PAGE_SIZE && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#555]">
          <span>
            Показано {firstShown}–{lastShown} з {total}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={page <= 1}
              className="h-[34px] rounded-[4px] border border-[#d5d5d5] bg-white px-3 transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Назад
            </button>

            <span>
              {page} / {pageCount}
            </span>

            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= pageCount}
              className="h-[34px] rounded-[4px] border border-[#d5d5d5] bg-white px-3 transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Далі ›
            </button>
          </div>
        </div>
      )}
    </AdminPageLayout>
  )
}
