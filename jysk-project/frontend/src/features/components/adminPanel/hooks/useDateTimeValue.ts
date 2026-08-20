import { useState } from 'react'

const pad = (value: number): string => String(value).padStart(2, '0')

export const useDateTimeValue = () => {
  const now = new Date()

  const [date, setDate] = useState(
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  )

  const [hour, setHour] = useState(pad(now.getHours()))
  const [minute, setMinute] = useState(pad(now.getMinutes()))

  const toISOString = (): string => {
    if (!date) {
      return new Date().toISOString()
    }

    const safeHour = hour ? hour.padStart(2, '0') : '00'
    const safeMinute = minute ? minute.padStart(2, '0') : '00'

    return new Date(`${date}T${safeHour}:${safeMinute}:00`).toISOString()
  }

  return { date, setDate, hour, setHour, minute, setMinute, toISOString }
}
