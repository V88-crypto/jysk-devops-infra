import type { TextareaHTMLAttributes } from 'react'

const controlClass =
  'rounded-[4px] border border-line-strong bg-surface-strong px-5 text-lg text-fg outline-none transition placeholder:text-lg placeholder:text-fg-muted focus:border-primary'

export const TextAreaField = ({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      {...props}
      className={`${controlClass} h-[280px] w-full resize-none p-5 ${className}`}
    />
  )
}
