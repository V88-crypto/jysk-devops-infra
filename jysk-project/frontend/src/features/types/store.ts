export type WeekdayLabel = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ' | 'НД'

export interface DayWorkingHours {
  day: WeekdayLabel
  start: string
  end: string
}

export interface Store {
  id: number
  name: string
  street: string
  houseNumber: string
  city: string
  warehouseId: number
  workingHours: DayWorkingHours[]
  photoUrl: string | null
}
