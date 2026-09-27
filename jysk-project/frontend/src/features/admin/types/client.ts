export type ClientRole = 'admin' | 'customer'

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: ClientRole
  createdAt: string
}

export interface ClientPage {
  items: Client[]
  total: number
  page: number
  pageSize: number
}
