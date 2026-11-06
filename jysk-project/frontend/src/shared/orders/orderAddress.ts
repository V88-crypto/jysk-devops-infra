// Pickup orders come without an address, only with a pickup point.
export interface OrderDeliveryResponse {
  address: {
    city: string
    address: string
    postal_code: string | null
  } | null
  pickup_point: {
    name: string
    address: string
  } | null
}

export const formatOrderAddress = ({
  address,
  pickup_point,
}: OrderDeliveryResponse) => {
  if (pickup_point) {
    return `Самовивіз: ${pickup_point.name}, ${pickup_point.address}`
  }

  if (!address) {
    return '—'
  }

  return [address.postal_code, address.city, address.address]
    .filter(Boolean)
    .join(', ')
}
