'use client';

import { type HTMLAttributes, type ReactNode, forwardRef, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';
import { Skeleton } from './Skeleton.js';

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

// `bg-surface` (no `bg-elevated`): `elevated` es un rol que cada piel tiñe libremente
// (en el theme azul del Shop es celeste) y detrás de fotos con fondo blanco/transparente
// se veía como un tinte de color en vez de un fondo neutro. `bg-surface` es el mismo fondo
// de la card → sin bloque de color detrás; un borde sutil (mismo token que el de la card)
// es lo que enmarca la foto, en los dos temas: abajo en `grid` (separa foto de texto,
// apilados) y a la derecha en `list` (van lado a lado).
const imageWrap = cva('relative flex items-center justify-center bg-surface p-4', {
  variants: {
    layout: {
      grid: 'aspect-square border-b border-border/60',
      list: 'w-32 shrink-0 border-r border-border/60 sm:w-40',
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
export type ProductCardActionPlacement = 'inline' | 'below';

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  image?: ReactNode;
  /**
   * Todas las fotos del producto, ya armadas (p. ej. `next/image`). Con más de una, la imagen
   * pasa a ser una galería que se desliza con el dedo (scroll-snap nativo) y, desde md, con
   * flechas al pasar el mouse. Reemplaza a `image`. La 2.ª foto en adelante no se monta hasta
   * que la persona se acerca a la card (hover, toque o foco): la grilla no baja todas las fotos
   * de todos los productos.
   */
  images?: ReactNode[];
  /** Textos de la galería para lectores de pantalla. */
  imagesLabels?: { prev: string; next: string };
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
   * Dónde va `action` respecto del precio. Default 'inline'.
   * - 'inline': al costado del precio; si no entran juntos, baja a su propia
   *   línea. Pensado para acciones chicas (un botón redondo "+").
   * - 'below': siempre en su propia línea, debajo del precio y a la derecha.
   *   Para acciones anchas (un `QuantityStepper`): con 'inline' unas cards de
   *   la grilla lo ponían al lado y otras abajo, según lo largo del precio.
   */
  actionPlacement?: ProductCardActionPlacement;
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
      images,
      imagesLabels,
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
      actionPlacement = 'inline',
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
    const galeria = images != null && images.length > 1;
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
        <div className={cn(imageWrap({ layout: resolvedLayout }), galeria && 'p-0')}>
          {badge && <div className={cn('absolute left-2 top-2', galeria && 'z-[2]')}>{badge}</div>}
          {galeria ? (
            <Galeria fotos={images} href={href} renderLink={renderLink} labels={imagesLabels} />
          ) : (
            (images?.[0] ?? image)
          )}
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

          {/*
            Precio y acción comparten fila, pero la fila puede partirse: si un
            precio largo y una acción ancha (p. ej. un QuantityStepper) no entran
            juntos, la acción baja a su propia línea en vez de montarse sobre el
            precio. Por eso el precio no lleva `min-w-0`: no se achica por debajo
            de su ancho real. Con `actionPlacement="below"` la fila no depende del
            precio: la acción va siempre abajo, y todas las cards quedan iguales.
          */}
          <div
            className={cn(
              'mt-auto flex gap-2 pt-2',
              actionPlacement === 'below' ? 'flex-col' : 'flex-wrap items-end justify-between',
              resolvedLayout === 'list' && 'sm:mt-0 sm:shrink-0 sm:pt-0',
            )}
          >
            <div className="flex flex-1 flex-col gap-y-0.5">
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

            {action && (
              <div className={cn('relative z-10 shrink-0', actionPlacement === 'below' ? 'self-end' : 'ml-auto')}>{action}</div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ProductCard.displayName = 'ProductCard';

/**
 * Galería de la card. Scroll nativo con `scroll-snap` (como `Carousel`): el arrastre usa la
 * inercia del sistema y no pasa por el hilo principal.
 *
 * La pista va por encima del enlace estirado (`z-[1]`), si no el dedo agarraría el `<a>` y no
 * se podría deslizar. Para que tocar la foto siga abriendo la ficha, cada foto va envuelta en
 * su propio enlace, fuera del tab y del lector: el enlace real sigue siendo el nombre.
 */
function Galeria({
  fotos,
  href,
  renderLink,
  labels = { prev: 'Foto anterior', next: 'Foto siguiente' },
}: {
  fotos: ReactNode[];
  href?: string;
  renderLink: RenderLink;
  labels?: { prev: string; next: string };
}) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [activa, setActiva] = useState(0);
  // Hasta qué foto está montada. Arranca en la primera; al acercarse se precarga la siguiente.
  const [montadas, setMontadas] = useState(0);
  const precargar = (hasta: number) => setMontadas((m) => Math.max(m, Math.min(hasta, fotos.length - 1)));

  function alScrollear() {
    const el = pistaRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActiva(i);
    precargar(i + 1);
  }

  function ir(i: number) {
    const el = pistaRef.current;
    if (!el) return;
    precargar(i + 1);
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div
      className="absolute inset-0 z-[1]"
      data-galeria=""
      onPointerEnter={() => precargar(1)}
      onTouchStart={() => precargar(1)}
      onFocus={() => precargar(1)}
    >
      <div
        ref={pistaRef}
        onScroll={alScrollear}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, i) => {
          const contenido = i <= montadas ? foto : null;
          // `relative`: `next/image` con `fill` se posiciona contra la foto, no contra la card.
          const clase = 'relative flex h-full w-full items-center justify-center p-4';
          return (
            <div key={i} data-foto={i} className="h-full w-full shrink-0 snap-center">
              {href
                ? renderLink({ href, className: clase, children: contenido, tabIndex: -1, 'aria-hidden': true })
                : <div className={clase}>{contenido}</div>}
            </div>
          );
        })}
      </div>

      <FlechaFoto hacia="prev" label={labels.prev} oculta={activa === 0} onClick={() => ir(activa - 1)} />
      <FlechaFoto hacia="next" label={labels.next} oculta={activa >= fotos.length - 1} onClick={() => ir(activa + 1)} />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-2 z-[2] flex justify-center gap-1">
        {fotos.map((_, i) => (
          <span
            key={i}
            data-activo={i === activa ? '' : undefined}
            className={cn(
              'h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out',
              i === activa ? 'w-3 bg-text/70' : 'w-1.5 bg-text/25',
            )}
          />
        ))}
      </div>
    </div>
  );
}

function FlechaFoto({
  hacia,
  label,
  oculta,
  onClick,
}: {
  hacia: 'prev' | 'next';
  label: string;
  oculta: boolean;
  onClick: () => void;
}) {
  if (oculta) return null;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      // Sólo desde md y al pasar el mouse: en touch se desliza con el dedo.
      className={cn(
        'absolute top-1/2 z-[2] hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-2 opacity-0 transition-[opacity,scale] duration-150 ease-out focus-visible:opacity-100 active:scale-95 group-hover:opacity-100 md:flex',
        hacia === 'prev' ? 'left-2' : 'right-2',
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {hacia === 'prev' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}

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
