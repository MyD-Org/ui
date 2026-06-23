import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface PriceTierItem {
  label: string;
  price: number;
  discount?: string;
}

export interface PriceTierProps extends HTMLAttributes<HTMLDivElement> {
  tiers: PriceTierItem[];
  currency?: string;
  locale?: string;
}

export const PriceTier = forwardRef<HTMLDivElement, PriceTierProps>(
  ({ tiers, currency = 'ARS', locale = 'es-AR', className, ...props }, ref) => {
    const fmt = (n: number) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0 }).format(n);

    return (
      <div ref={ref} className={cn('rounded-sm border border-border', className)} {...props}>
        <div className="border-b border-border px-3 py-2.5 text-sm font-semibold text-text">
          Precio por cantidad
        </div>
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center justify-between px-3 py-2 text-sm',
              i !== tiers.length - 1 && 'border-b border-border',
            )}
          >
            <span className="text-muted">{tier.label}</span>
            <span className="flex items-center gap-2">
              {tier.discount && (
                <span className="rounded-sm bg-success-soft px-1.5 py-0.5 text-xs font-medium text-success">
                  {tier.discount}
                </span>
              )}
              <span className="font-semibold text-text">{fmt(tier.price)}</span>
            </span>
          </div>
        ))}
      </div>
    );
  },
);
PriceTier.displayName = 'PriceTier';
