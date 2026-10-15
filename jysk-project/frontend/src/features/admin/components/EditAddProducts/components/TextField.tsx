import type { InputHTMLAttributes } from 'react'

const controlClass =
  'h-[56px] rounded-[4px] border border-line-strong bg-surface-strong px-5 text-lg text-fg outline-none transition placeholder:text-lg placeholder:text-fg-muted focus:border-primary'

export const TextField = ({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return <input {...props} className={`${controlClass} w-full ${className}`} />
}
