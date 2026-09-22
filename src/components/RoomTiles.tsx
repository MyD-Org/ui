import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export interface RoomTile {
  eyebrow: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
  href: string;
}

const tile = cva('group relative isolate flex overflow-hidden rounded-[24px]', {
  variants: {
    variant: {
      mosaic: 'items-end min-h-[300px] lg:min-h-[220px]',
      grid: 'items-end min-h-[240px] lg:min-h-0 lg:aspect-[1/1.25]',
      // Apilada: el texto va arriba porque, tapada por la siguiente, la franja
      // que queda a la vista es la de arriba.
      stack: 'items-start min-h-[320px] shadow-2',
    },
  },
  defaultVariants: { variant: 'mosaic' },
});

/** Dónde se pega la primera tarjeta apilada, en px desde el borde superior. */
const STACK_TOP = 72;
/** Franja visible de la tarjeta de atrás, en px. */
const STACK_SOLAPE = 10;

export interface RoomTilesProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tile> {
  items: RoomTile[];
  /**
   * Sólo en `variant="stack"`: px desde el borde superior donde se pega la
   * primera tarjeta. Subilo si la app tiene un header fijo más alto.
   */
  stackTop?: number;
  /** Sólo en `variant="stack"`: franja visible de la tarjeta de atrás, en px. */
  stackSolape?: number;
  /** Texto del call to action de cada tile. */
  ctaLabel?: string;
}

/**
 * Tiles de ambientes. Tres disposiciones:
 * - `mosaic` (default): la primera tile grande + el resto al costado.
 * - `grid`: todas iguales, 2 columnas en mobile y 4 desde lg.
 * - `stack`: una por fila, apiladas — cada una se pega un poco más abajo que la
 *   anterior y la siguiente se monta encima, así se despegan al scrollear.
 *   Es `position: sticky` puro, sin JS: sigue al dedo y nunca queda a mitad de
 *   camino. Con reduced motion quedan una debajo de otra, sin pila.
 */
export function RoomTiles({
  items,
  variant,
  stackTop = STACK_TOP,
  stackSolape = STACK_SOLAPE,
  ctaLabel = 'Explorar',
  className,
  ...props
}: RoomTilesProps) {
  if (variant === 'stack') {
    return (
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {items.map((item, i) => (
          <div
            key={item.href + item.title}
            className="sticky motion-reduce:static"
            style={{ top: `${stackTop + i * stackSolape}px`, zIndex: i + 1 }}
          >
            <Tile item={item} variant="stack" ctaLabel={ctaLabel} />
          </div>
        ))}
      </div>
    );
  }

  const esMosaic = variant !== 'grid';
  return (
    <div
      className={cn(
        'grid gap-5',
        esMosaic ? 'lg:grid-cols-[1.25fr_1fr]' : 'grid-cols-2 lg:grid-cols-4',
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <Tile
          key={item.href + item.title}
          item={item}
          variant={esMosaic ? 'mosaic' : 'grid'}
          destacada={i === 0 && esMosaic}
          ctaLabel={ctaLabel}
        />
      ))}
    </div>
  );
}

function Tile({
  item,
  variant,
  ctaLabel,
  destacada = false,
}: {
  item: RoomTile;
  variant: 'mosaic' | 'grid' | 'stack';
  ctaLabel: string;
  destacada?: boolean;
}) {
  const esStack = variant === 'stack';
  return (
    <a
      href={item.href}
      data-size={destacada ? 'big' : undefined}
      className={cn(tile({ variant }), destacada && 'lg:row-span-2 lg:min-h-[460px]')}
    >
      <img
        src={item.imageSrc}
        alt={item.imageAlt ?? ''}
        className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
      />
      <div
        className={cn(
          'absolute inset-0 -z-10',
          esStack
            ? 'bg-[linear-gradient(to_bottom,rgba(30,22,14,0.72)_0%,rgba(30,22,14,0.18)_45%,transparent_75%)]'
            : 'bg-[linear-gradient(to_top,rgba(30,22,14,0.62)_0%,rgba(30,22,14,0.12)_45%,transparent_70%)]',
        )}
      />
      <div className="p-[clamp(22px,2.5vw,34px)]">
        <small className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-highlight">
          {item.eyebrow}
        </small>
        <h3 className="font-display text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] text-white">
          {item.title}
        </h3>
        {/* Mismo CTA en las tres variantes: antes `grid` y `stack` usaban un
            círculo con la flecha rotando, que no se parecía al resto de las
            cards y llamaba más la atención que el título. */}
        <span
          data-go
          className="mt-3.5 inline-flex items-center gap-2 border-b-[1.5px] border-white/50 pb-[3px] text-[13px] font-extrabold text-white transition-[border-color,gap] duration-200 group-hover:border-highlight group-hover:gap-3"
        >
          {ctaLabel} →
        </span>
      </div>
    </a>
  );
}
