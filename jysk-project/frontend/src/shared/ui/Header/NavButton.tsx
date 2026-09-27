import React from 'react'

interface NavButtonProps {
  text: string
  active: boolean
  className?: string // Знак питання означає, що цей пропс не є обов'язковим
  onClick?: () => void
}

export const NavButton: React.FC<NavButtonProps> = ({
  text,
  active,
  className = '',
  onClick,
}) => {
  const colorClasses = active
    ? 'bg-primary text-white'
    : 'bg-gray-border text-dark hover:bg-[#868686]'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
      flex items-center justify-center shrink-0
      h-[40px] md:h-[5.85vw] xl:h-[2.65vw]
      text-[14px] md:text-[2.6vw] xl:text-[1.25vw]
      rounded-[2px] 
      font-normal whitespace-nowrap 
      transition-colors duration-200 
      ${colorClasses}
      ${className}
    `}
    >
      {text}
    </button>
  )
}
