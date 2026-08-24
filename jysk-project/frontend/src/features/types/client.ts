export interface ClientGroup {
  id: number
  name: string
}

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  totalSum: number
  averageCheck: number
  groupId: number | null
}
