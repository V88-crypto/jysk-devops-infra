import { apiRequest } from '@/shared/api/httpClient'

export type DeliveryMethodCode = 'np_courier' | 'np_department' | 'pickup'
export type PaymentMethod = 'card' | 'cash_on_delivery'

interface ListResponse<T> {
  items: T[]
}

interface DeliveryMethodResponse {
  code: DeliveryMethodCode
  name: string
  price: number
  base_price: number
  free_from: number | null
}

export interface DeliveryMethod {
  code: DeliveryMethodCode
  name: string
  price: number
}

export interface PickupPoint {
  code: string
  name: string
  city: string
  address: string
  working_hours: string
}

export interface OrderInput {
  recipient: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  deliveryMethod: DeliveryMethodCode
  address: { city: string; street: string; house: string }
  departmentNumber: number
  pickupPoint: string
  paymentMethod: PaymentMethod
  acceptTerms: boolean
}

interface OrderResponse {
  id: number
  total_price: number
}

export interface CreatedOrder {
  id: number
  totalPrice: number
}

// The backend rejects details that don't belong to the chosen method,
// so only the matching one is sent.
const deliveryDetails = (input: OrderInput) => {
  switch (input.deliveryMethod) {
    case 'np_courier':
      return { address: input.address }
    case 'np_department':
      return {
        department: {
          city: input.address.city,
          number: input.departmentNumber,
        },
      }
    case 'pickup':
      return { pickup_point: input.pickupPoint }
  }
}

export const checkoutApi = {
  async getDeliveryMethods(subtotal: number): Promise<DeliveryMethod[]> {
    const response = await apiRequest<ListResponse<DeliveryMethodResponse>>(
      `/delivery-methods?subtotal=${subtotal}`,
    )

    return response.items.map(({ code, name, price }) => ({
      code,
      name,
      price,
    }))
  },

  async getPickupPoints(): Promise<PickupPoint[]> {
    const response =
      await apiRequest<ListResponse<PickupPoint>>('/pickup-points')

    return response.items
  },

  async createOrder(input: OrderInput): Promise<CreatedOrder> {
    const order = await apiRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        recipient: {
          first_name: input.recipient.firstName,
          last_name: input.recipient.lastName,
          phone: input.recipient.phone,
          email: input.recipient.email,
        },
        delivery_method: input.deliveryMethod,
        ...deliveryDetails(input),
        payment_method: input.paymentMethod,
        accept_terms: input.acceptTerms,
      }),
    })

    return { id: order.id, totalPrice: order.total_price }
  },
}
