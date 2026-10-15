import type { SelectHTMLAttributes } from 'react'

const controlClass =
  'h-[56px] rounded-[4px] border border-line-strong bg-surface-strong px-5 text-lg text-fg outline-none transition focus:border-primary'

export const SelectField = ({
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => {
  return <select {...props} className={`${controlClass} w-full ${className}`} />
}
