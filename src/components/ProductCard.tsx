import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

const stockIndicator = cva('inline-flex items-center gap-1.5 text-xs font-medium', {
  variants: {
    stock: {
      in: 'text-success',
      low: 'text-warning',
      out: 'text-danger',
    },
  },
  defaultVariants: { stock: 'in' },
});

const stockDot = cva('h-1.5 w-1.5 rounded-full', {
  variants: {
    stock: {
      in: 'bg-success',
      low: 'bg-warning',
      out: 'bg-danger',
    },
  },
  defaultVariants: { stock: 'in' },
});

const stockLabels: Record<string, string> = {
  in: 'En stock',
  low: 'Últimas unidades',
  out: 'Sin stock',
};

export type ProductStock = 'in' | 'low' | 'out';

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  image?: ReactNode;
  badge?: ReactNode;
  brand?: string;
  name: string;
  stock?: ProductStock;
  stockLabel?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  currency?: string;
  locale?: string;
  action?: ReactNode;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      badge,
      brand,
      name,
      stock = 'in',
      stockLabel,
      price,
      oldPrice,
      discount,
      currency = 'ARS',
      locale = 'es-AR',
      action,
      className,
      ...props
    },
    ref,
  ) => {
    const fmt = (n: number) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0 }).format(n);

    return (
      <div
        ref={ref}
        className={cn(
          'group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-2',
          className,
        )}
        {...props}
      >
        <div className="relative flex aspect-square items-center justify-center bg-elevated/50 p-4">
          {badge && <div className="absolute left-2 top-2">{badge}</div>}
          {image}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          {brand && <span className="text-xs font-medium uppercase tracking-wide text-muted">{brand}</span>}
          <h3 className="line-clamp-2 text-sm font-semibold text-text">{name}</h3>

          <span className={stockIndicator({ stock })}>
            <span className={stockDot({ stock })} />
            {stockLabel ?? stockLabels[stock]}
          </span>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-lg font-bold text-text">{fmt(price)}</span>
              {oldPrice != null && (
                <span className="text-sm text-muted line-through">{fmt(oldPrice)}</span>
              )}
              {discount && (
                <span className="rounded-sm bg-danger-soft px-1.5 py-0.5 text-xs font-semibold text-danger">
                  {discount}
                </span>
              )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    );
  },
);
ProductCard.displayName = 'ProductCard';
