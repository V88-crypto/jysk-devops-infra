import type { TextareaHTMLAttributes } from 'react'

const controlClass =
  'rounded-[4px] border border-[#b9b9b9] bg-[#dedede] px-5 text-lg text-[#3b3b3b] outline-none transition placeholder:text-lg placeholder:text-[#565656] focus:border-primary'

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
