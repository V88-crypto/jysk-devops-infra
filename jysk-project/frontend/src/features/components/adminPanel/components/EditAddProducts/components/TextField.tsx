import type { InputHTMLAttributes } from 'react'

const controlClass =
  'h-[56px] rounded-[4px] border border-[#b9b9b9] bg-[#dedede] px-5 text-lg text-[#3b3b3b] outline-none transition placeholder:text-lg placeholder:text-[#565656] focus:border-[#00a9ad]'

export const TextField = ({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`${controlClass} w-full ${className}`}
    />
  )
}