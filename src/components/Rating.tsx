import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export interface RatingProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  count?: number;
  countLabel?: string;
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  ({ value, max = 5, count, countLabel = 'opiniones', className, ...props }, ref) => {
    const stars = Array.from({ length: max }, (_, i) => i < Math.round(value));

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${value} de ${max} estrellas${count != null ? `, ${count} ${countLabel}` : ''}`}
        className={cn('inline-flex items-center gap-1 text-warning', className)}
        {...props}
      >
        {stars.map((filled, i) => (
          <StarIcon key={i} filled={filled} />
        ))}
        {count != null && (
          <span className="ml-1 text-sm text-muted">
            {value} · {count} {countLabel}
          </span>
        )}
      </div>
    );
  },
);
Rating.displayName = 'Rating';
