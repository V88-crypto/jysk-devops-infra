import type { ReactNode } from 'react'

interface LabeledFieldProps {
  label: string
  children: ReactNode
}

export const LabeledField = ({ label, children }: LabeledFieldProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
      <span className="min-w-[220px] text-sm font-medium text-fg">{label}</span>

      <div className="w-full sm:w-[320px]">{children}</div>
    </div>
  )
}
