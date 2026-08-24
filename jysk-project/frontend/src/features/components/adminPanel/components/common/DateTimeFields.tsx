interface DateTimeFieldsProps {
  label: string
  date: string
  hour: string
  minute: string
  onDateChange: (value: string) => void
  onHourChange: (value: string) => void
  onMinuteChange: (value: string) => void
}

const fieldClass =
  'h-[44px] rounded-[4px] border border-[#d5d5d5] bg-[#f4f4f4] px-3 text-sm text-[#333] outline-none focus:border-[#00a9ad]'

export const DateTimeFields = ({
  label,
  date,
  hour,
  minute,
  onDateChange,
  onHourChange,
  onMinuteChange,
}: DateTimeFieldsProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <span className="min-w-[220px] text-sm font-medium text-[#333]">
        {label}
      </span>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className={`${fieldClass} w-[160px]`}
        />

        <input
          type="number"
          min={0}
          max={23}
          value={hour}
          onChange={(event) => onHourChange(event.target.value)}
          className={`${fieldClass} w-[64px] text-center`}
        />

        <span className="text-[#8a8a8a]">:</span>

        <input
          type="number"
          min={0}
          max={59}
          value={minute}
          onChange={(event) => onMinuteChange(event.target.value)}
          className={`${fieldClass} w-[64px] text-center`}
        />
      </div>
    </div>
  )
}
