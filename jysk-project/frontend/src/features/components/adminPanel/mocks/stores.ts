import type { DayWorkingHours, Store } from '@/features/types/store'

const STANDARD_HOURS: DayWorkingHours[] = [
  { day: 'ПН', start: '10:00', end: '19:00' },
  { day: 'ВТ', start: '10:00', end: '19:00' },
  { day: 'СР', start: '10:00', end: '19:00' },
  { day: 'ЧТ', start: '10:00', end: '19:00' },
  { day: 'ПТ', start: '10:00', end: '19:00' },
  { day: 'СБ', start: '10:00', end: '19:00' },
  { day: 'НД', start: '10:00', end: '19:00' },
]

export const mockStores: Store[] = [
  {
    id: 1,
    name: 'HYGGY Івано-Франківськ, ТЦ Арсен',
    street: 'Північний бульвар',
    houseNumber: '2а',
    city: 'Івано-Франківськ',
    warehouseId: 3,
    workingHours: STANDARD_HOURS,
    photoUrl: null,
  },
  {
    id: 2,
    name: 'HYGGY Івано-Франківськ, ТЦ Велес',
    street: 'Галицька',
    houseNumber: '20Г',
    city: 'Івано-Франківськ',
    warehouseId: 3,
    workingHours: STANDARD_HOURS,
    photoUrl: null,
  },
  {
    id: 3,
    name: 'HYGGY Івано-Франківськ, ТЦ Арсен',
    street: 'Вовчинецька',
    houseNumber: '55Б',
    city: 'Івано-Франківськ',
    warehouseId: 3,
    workingHours: STANDARD_HOURS,
    photoUrl: null,
  },
]
