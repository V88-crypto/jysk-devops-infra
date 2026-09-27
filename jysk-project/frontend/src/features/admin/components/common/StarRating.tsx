interface StarRatingProps {
  rating: number
  maxRating?: number
}

export const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <span className="tracking-[-1px] text-[#f5a623]" aria-label={`${rating} з ${maxRating}`}>
      {Array.from({ length: maxRating }, (_, index) => (
        <span key={index}>{index < rating ? '★' : '☆'}</span>
      ))}
    </span>
  )
}
