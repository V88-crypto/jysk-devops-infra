export interface WorkingHour {
  day: string
  hours: string
}

export interface StoreDetails {
  id: string
  name: string
  address: string
  phone: string
  mapLink: string
  image: string
  workingHours: WorkingHour[]
  todayHours: string
  tomorrowHours: string
}

export const storeMockData: StoreDetails = {
  id: 'zhytomyr-oldi',
  name: 'HYGGY Житомир ТЦ Олді',
  address: 'вул. Михайла Грушевського, 5 10002 Житомир',
  phone: '+380442470786',
  mapLink: '#',
  image: '/src/assets/images/store-zhytomyr.jpg',
  workingHours: [
    { day: 'Понеділок', hours: '10:00 - 20:00' },
    { day: 'Вівторок', hours: '10:00 - 20:00' },
    { day: 'Середа', hours: '10:00 - 20:00' },
    { day: 'Четвер', hours: '10:00 - 20:00' },
    { day: "П'ятниця", hours: '10:00 - 20:00' },
    { day: 'Субота', hours: '10:00 - 20:00' },
    { day: 'Неділя', hours: '10:00 - 20:00' },
  ],
  todayHours: '10:00 - 20:00',
  tomorrowHours: '10:00 - 20:00',
}
