import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  items: string[];
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[11px] w-[11px] text-accent" aria-hidden="true">
      <path d="M12 2c1.5 5.5 4.5 8.5 10 10-5.5 1.5-8.5 4.5-10 10-1.5-5.5-4.5-8.5-10-10 5.5-1.5 8.5-4.5 10-10z" />
    </svg>
  );
}

export function Marquee({ items, className, ...props }: MarqueeProps) {
  return (
    <div
      className={cn('overflow-hidden whitespace-nowrap border-y border-border py-4', className)}
      aria-hidden="true"
      {...props}
    >
      <div className="inline-flex animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex items-center" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="inline-flex items-center gap-7 px-4 font-display text-[15px] italic text-muted"
              >
                {item}
                <Sparkle />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
