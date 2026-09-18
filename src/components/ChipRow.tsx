import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface ChipRowItem {
  label: string;
  href?: string;
}

export interface ChipRowProps extends HTMLAttributes<HTMLDivElement> {
  chips: ChipRowItem[];
}

const chipClass =
  'inline-flex items-center rounded-full border border-border bg-surface px-5 py-2.5 text-[13px] font-bold text-text transition-[background-color,color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-on-primary';

export function ChipRow({ chips, className, ...props }: ChipRowProps) {
  return (
    <div className={cn('flex flex-wrap gap-2.5', className)} {...props}>
      {chips.map((chip) =>
        chip.href ? (
          <a key={chip.label} href={chip.href} className={chipClass}>
            {chip.label}
          </a>
        ) : (
          <span key={chip.label} className={chipClass}>
            {chip.label}
          </span>
        ),
      )}
    </div>
  );
}
