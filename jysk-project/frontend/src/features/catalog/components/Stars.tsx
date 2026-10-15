interface StarsProps {
  rating: number
  className?: string
}

export const Stars = ({ rating, className = 'text-[22px]' }: StarsProps) => {
  const rounded = Math.round(rating)

  return (
    <span
      className={`tracking-[-1px] text-[#f5a623] ${className}`}
      aria-label={`Оцінка ${rating} з 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < rounded ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

interface StarInputProps {
  value: number
  disabled?: boolean
  onChange: (value: number) => void
}

export const StarInput = ({ value, disabled, onChange }: StarInputProps) => (
  <div className="flex gap-1" role="radiogroup" aria-label="Ваша оцінка">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        role="radio"
        aria-checked={value === star}
        aria-label={`${star} з 5`}
        disabled={disabled}
        onClick={() => onChange(star)}
        className="text-[30px] leading-none text-[#f5a623] transition-transform hover:scale-110 disabled:cursor-not-allowed"
      >
        {star <= value ? '★' : '☆'}
      </button>
    ))}
  </div>
)
