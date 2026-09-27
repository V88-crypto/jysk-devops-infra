import type { AuthUser } from '@/shared/api/authService'
import { apiRequest } from '@/shared/api/httpClient'
import type { Client, ClientPage, ClientRole } from '@/features/admin/types/client'

interface UserListResponse {
  items: AuthUser[]
  total: number
  page: number
  page_size: number
}

interface ClientQuery {
  search: string
  page: number
  pageSize: number
}

const toClient = (user: AuthUser): Client => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  phone: user.phone,
  role: user.role as ClientRole,
  createdAt: user.created_at,
})

export const clientService = {
  async getPage({ search, page, pageSize }: ClientQuery): Promise<ClientPage> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })

    if (search) {
      params.set('search', search)
    }

    const response = await apiRequest<UserListResponse>(`/admin/users?${params}`)

    return {
      items: response.items.map(toClient),
      total: response.total,
      page: response.page,
      pageSize: response.page_size,
    }
  },

  async updateRole(id: number, role: ClientRole): Promise<Client> {
    const user = await apiRequest<AuthUser>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })

    return toClient(user)
  },
}
