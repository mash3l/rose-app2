import { Star } from "lucide-react";

const MAX_STARS = 5;

export interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className = "" }: StarRatingProps) {
  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} out of ${MAX_STARS} stars`}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => {
        const isFilled = index < Math.round(rating);
        return (
          <Star
            key={index}
            size={16}
            className={
              isFilled
                ? "fill-warning text-warning"
                : "fill-none text-muted-foreground"
            }
            aria-hidden
          />
        );
      })}
    </div>
  );
}
