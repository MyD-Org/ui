import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';
import { Skeleton } from './Skeleton';

const card = cva('group relative flex overflow-hidden transition-shadow duration-200', {
  variants: {
    variant: {
      default: 'cursor-default rounded-lg border border-border bg-surface hover:shadow-2',
      editorial: 'cursor-pointer rounded-[20px] border border-border/50 bg-surface hover:shadow-2',
    },
    layout: {
      grid: 'flex-col',
      list: 'flex-row items-stretch',
    },
  },
  defaultVariants: { variant: 'default', layout: 'grid' },
});

const imageWrap = cva('relative flex items-center justify-center bg-elevated/50 p-4', {
  variants: {
    layout: {
      grid: 'aspect-square',
      list: 'w-32 shrink-0 sm:w-40',
    },
  },
  defaultVariants: { layout: 'grid' },
});

const priceText = cva('', {
  variants: {
    variant: {
      default: 'text-lg font-bold text-text',
      editorial: 'font-display text-xl font-semibold tracking-tight text-text md:text-2xl',
    },
  },
  defaultVariants: { variant: 'default' },
});

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

export type ProductCardVariant = NonNullable<VariantProps<typeof card>['variant']>;
export type ProductCardLayout = NonNullable<VariantProps<typeof card>['layout']>;

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  image?: ReactNode;
  badge?: ReactNode;
  brand?: string;
  name: string;
  /** Código / SKU: línea "Cód. {code}" bajo el nombre. */
  code?: string;
  /** Default 'Cód.'. */
  codeLabel?: string;
  stock?: ProductStock;
  stockLabel?: string;
  /** Default true (desde 0.12.0 también en `variant="editorial"`). */
  showStock?: boolean;
  price: number;
  oldPrice?: number;
  discount?: string;
  currency?: string;
  locale?: string;
  action?: ReactNode;
  /**
   * Aclaracion legal/fiscal bajo el precio (ej. "PRECIO SIN IMPUESTOS NACIONALES $X").
   * Se dibuja chica y muted: el precio sigue siendo lo mas fuerte de la card.
   */
  priceNote?: ReactNode;
  /** Linea de financiacion bajo el precio (ej. "Hasta 3 cuotas de $5.840,69"). */
  installments?: ReactNode;
  /**
   * Enlace de la ficha. El nombre pasa a ser un `<a>` "estirado" que cubre toda la card
   * (patrón stretched link): un solo link por card y el slot `action` queda fuera del anchor.
   */
  href?: string;
  renderLink?: RenderLink;
  /**
   * Acción en la esquina superior derecha de la imagen (simétrica a `badge`), p. ej. el
   * corazón de favoritos (`ToggleIconButton`). Queda por encima del enlace estirado (`z-10`)
   * y fuera del `<a>`: un clic en ella no navega.
   */
  cornerAction?: ReactNode;
}

const nameLink =
  'after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      badge,
      brand,
      name,
      code,
      codeLabel = 'Cód.',
      stock = 'in',
      stockLabel,
      showStock = true,
      price,
      oldPrice,
      discount,
      currency = 'ARS',
      locale = 'es-AR',
      action,
      priceNote,
      installments,
      href,
      renderLink = defaultRenderLink,
      cornerAction,
      variant,
      layout,
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedLayout: ProductCardLayout = layout ?? 'grid';
    // Enteros limpios ($14.990) pero con centavos completos ($713.028,80): con
    // minimumFractionDigits: 0 a secas, Intl imprime "$713.028,8".
    const fmt = (n: number) => {
      const hasCents = Math.round(n * 100) % 100 !== 0;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(n);
    };

    return (
      <div
        ref={ref}
        data-layout={resolvedLayout}
        className={cn(card({ variant, layout: resolvedLayout }), className)}
        {...props}
      >
        <div className={imageWrap({ layout: resolvedLayout })}>
          {badge && <div className="absolute left-2 top-2">{badge}</div>}
          {image}
          {cornerAction && <div className="absolute right-2 top-2 z-10">{cornerAction}</div>}
        </div>

        <div className={cn('flex flex-1 flex-col gap-1.5 p-4', resolvedLayout === 'list' && 'sm:flex-row sm:items-center sm:gap-4')}>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {brand && <span className="text-xs font-medium uppercase tracking-wide text-muted">{brand}</span>}
            <h3 className={cn('line-clamp-2 text-sm font-semibold text-text', resolvedLayout === 'grid' && 'min-h-10')}>
              {href ? renderLink({ href, className: nameLink, children: name }) : name}
            </h3>
            {code && (
              <span className="text-xs text-muted">
                {codeLabel} {code}
              </span>
            )}

            {showStock && (
              <span className={stockIndicator({ stock })}>
                <span className={stockDot({ stock })} />
                {stockLabel ?? stockLabels[stock]}
              </span>
            )}
          </div>

          <div className={cn('mt-auto flex items-end justify-between gap-2 pt-2', resolvedLayout === 'list' && 'sm:mt-0 sm:shrink-0 sm:pt-0')}>
            <div className="flex min-w-0 flex-1 flex-col gap-y-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className={priceText({ variant })}>{fmt(price)}</span>
                {oldPrice != null && (
                  <span className="text-sm text-muted line-through">{fmt(oldPrice)}</span>
                )}
                {discount && (
                  <span className="rounded-sm bg-danger-soft px-1.5 py-0.5 text-xs font-semibold text-danger">
                    {discount}
                  </span>
                )}
              </div>

              {priceNote && (
                <div className="text-[11px] leading-snug text-muted">{priceNote}</div>
              )}
              {installments && (
                <div className="text-xs leading-snug text-muted">{installments}</div>
              )}
            </div>

            {action && <div className="relative z-10 shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    );
  },
);
ProductCard.displayName = 'ProductCard';

export interface ProductCardSkeletonProps {
  layout?: ProductCardLayout;
  variant?: ProductCardVariant;
  className?: string;
}

/** Misma silueta que `ProductCard` (imagen, marca, dos líneas de nombre, precio, botón redondo). */
export function ProductCardSkeleton({ layout = 'grid', variant, className }: ProductCardSkeletonProps) {
  return (
    <div aria-hidden="true" data-layout={layout} className={cn(card({ variant, layout }), 'cursor-default hover:shadow-none', className)}>
      <Skeleton className={cn('rounded-none', layout === 'grid' ? 'aspect-square' : 'w-32 shrink-0 self-stretch sm:w-40')} />
      <div className={cn('flex flex-1 flex-col gap-2 p-4', layout === 'list' && 'sm:flex-row sm:items-center sm:gap-4')}>
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
ProductCardSkeleton.displayName = 'ProductCardSkeleton';
