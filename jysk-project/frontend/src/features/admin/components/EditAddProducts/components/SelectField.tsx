import type { SelectHTMLAttributes } from 'react'

const controlClass =
  'h-[56px] rounded-[4px] border border-[#b9b9b9] bg-[#dedede] px-5 text-lg text-[#3b3b3b] outline-none transition focus:border-primary'

export const SelectField = ({
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => {
  return <select {...props} className={`${controlClass} w-full ${className}`} />
}
