import { type HTMLAttributes, useEffect, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export interface RoomTile {
  /** Vacío o ausente ⇒ no se muestra. */
  eyebrow?: string;
  /** Vacío o ausente ⇒ no se muestra. */
  title?: string;
  imageSrc: string;
  imageAlt?: string;
  href: string;
  /**
   * Cuánto se oscurece la foto para que se lea el texto: `soft` para fotos
   * oscuras (ya tienen contraste), `strong` para fotos claras. Default `default`.
   */
  overlay?: RoomTileOverlay;
}

export type RoomTileOverlay = 'soft' | 'default' | 'strong';

/**
 * Velos por intensidad. `base` cubre todo el tile; `texto` va pegado al bloque
 * de texto. Clases literales (no armadas con template) para que Tailwind las vea.
 */
const VELOS: Record<
  RoomTileOverlay,
  { base: string; baseStack: string; texto: string; textoStack: string }
> = {
  soft: {
    base: 'bg-[linear-gradient(to_top,rgba(30,22,14,0.4)_0%,rgba(30,22,14,0.06)_45%,transparent_70%)]',
    baseStack: 'bg-[linear-gradient(to_bottom,rgba(30,22,14,0.5)_0%,rgba(30,22,14,0.08)_45%,transparent_75%)]',
    texto: 'before:bg-[linear-gradient(to_top,rgba(30,22,14,0.55)_0%,rgba(30,22,14,0.3)_55%,transparent_100%)]',
    textoStack: 'before:bg-[linear-gradient(to_bottom,rgba(30,22,14,0.55)_0%,rgba(30,22,14,0.3)_55%,transparent_100%)]',
  },
  default: {
    base: 'bg-[linear-gradient(to_top,rgba(30,22,14,0.62)_0%,rgba(30,22,14,0.12)_45%,transparent_70%)]',
    baseStack: 'bg-[linear-gradient(to_bottom,rgba(30,22,14,0.72)_0%,rgba(30,22,14,0.18)_45%,transparent_75%)]',
    texto: 'before:bg-[linear-gradient(to_top,rgba(30,22,14,0.82)_0%,rgba(30,22,14,0.6)_55%,transparent_100%)]',
    textoStack: 'before:bg-[linear-gradient(to_bottom,rgba(30,22,14,0.82)_0%,rgba(30,22,14,0.6)_55%,transparent_100%)]',
  },
  strong: {
    base: 'bg-[linear-gradient(to_top,rgba(30,22,14,0.78)_0%,rgba(30,22,14,0.3)_45%,rgba(30,22,14,0.08)_100%)]',
    baseStack: 'bg-[linear-gradient(to_bottom,rgba(30,22,14,0.85)_0%,rgba(30,22,14,0.32)_45%,rgba(30,22,14,0.08)_100%)]',
    texto: 'before:bg-[linear-gradient(to_top,rgba(30,22,14,0.9)_0%,rgba(30,22,14,0.72)_55%,transparent_100%)]',
    textoStack: 'before:bg-[linear-gradient(to_bottom,rgba(30,22,14,0.9)_0%,rgba(30,22,14,0.72)_55%,transparent_100%)]',
  },
};

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

/** Borde superior de la pila (la franja de la tarjeta más al fondo), en px. */
const STACK_TOP = 72;
/** Franja visible de cada tarjeta de atrás, en px. */
const STACK_SOLAPE = 10;
/** Cuántas tarjetas se asoman detrás de la de adelante. */
const STACK_PROFUNDIDAD = 2;
/** Cuánto se achica cada nivel de profundidad (0.08 = 8% por tarjeta). */
const STACK_ESCALA = 0.08;

/**
 * Profundidad continua de cada tarjeta: cuántas de las siguientes ya se le
 * montaron encima (0 = adelante; 1.5 = una entera y media más).
 * `tops` son los bordes superiores de los wrappers sticky, `alturas` sus alturas
 * y `pegue` la altura a la que se pegan todas.
 */
export function profundidadesPila(tops: number[], alturas: number[], pegue: number): number[] {
  const llegada = tops.map((top, j) => {
    const h = alturas[j] || 1;
    return Math.min(1, Math.max(0, 1 - (top - pegue) / h));
  });
  return tops.map((_, i) => {
    let d = 0;
    for (let j = i + 1; j < llegada.length; j++) d += llegada[j];
    return d;
  });
}

export interface RoomTilesProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tile> {
  items: RoomTile[];
  /**
   * Sólo en `variant="stack"`: px desde el borde superior donde arranca la pila
   * (la franja de la tarjeta más al fondo). La de adelante se pega
   * `stackProfundidad * stackSolape` px más abajo. Subilo si la app tiene un
   * header fijo más alto.
   */
  stackTop?: number;
  /** Sólo en `variant="stack"`: franja visible de cada tarjeta de atrás, en px. */
  stackSolape?: number;
  /** Sólo en `variant="stack"`: cuántas tarjetas se asoman detrás (default 2). */
  stackProfundidad?: number;
  /** Texto del call to action de cada tile. */
  ctaLabel?: string;
}

/**
 * Tiles de ambientes. Tres disposiciones:
 * - `mosaic` (default): la primera tile grande + el resto al costado.
 * - `grid`: todas iguales, 2 columnas en mobile y 4 desde lg.
 * - `stack`: una por fila, en pila tipo billetera. Todas se pegan a la misma
 *   altura y la siguiente se monta encima; la de atrás se achica y sube a medida
 *   que la tapan, así se asoma una franja cada vez más chica (como mucho
 *   `stackProfundidad` detrás). El pegado es `position: sticky`; la profundidad
 *   se calcula por scroll y se escribe como `transform` en cada tarjeta, así
 *   sigue al dedo sin easing. Con reduced motion quedan una debajo de otra.
 */
export function RoomTiles({
  items,
  variant,
  stackTop = STACK_TOP,
  stackSolape = STACK_SOLAPE,
  stackProfundidad = STACK_PROFUNDIDAD,
  ctaLabel = 'Explorar',
  className,
  ...props
}: RoomTilesProps) {
  if (variant === 'stack') {
    return (
      <PilaTiles
        items={items}
        stackTop={stackTop}
        stackSolape={stackSolape}
        stackProfundidad={stackProfundidad}
        ctaLabel={ctaLabel}
        className={className}
        {...props}
      />
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
          key={`${item.href}|${item.title ?? ''}|${i}`}
          item={item}
          variant={esMosaic ? 'mosaic' : 'grid'}
          destacada={i === 0 && esMosaic}
          ctaLabel={ctaLabel}
        />
      ))}
    </div>
  );
}

function PilaTiles({
  items,
  stackTop,
  stackSolape,
  stackProfundidad,
  ctaLabel,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  items: RoomTile[];
  stackTop: number;
  stackSolape: number;
  stackProfundidad: number;
  ctaLabel: string;
}) {
  const pegue = stackTop + stackProfundidad * stackSolape;
  const wrappers = useRef<(HTMLDivElement | null)[]>([]);
  const caras = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const pintar = () => {
      frame = 0;
      const els = wrappers.current.slice(0, items.length);
      const rects = els.map((el) => el?.getBoundingClientRect());
      const ds = profundidadesPila(
        rects.map((r) => r?.top ?? 0),
        rects.map((r) => r?.height ?? 0),
        pegue,
      );
      ds.forEach((d, i) => {
        const cara = caras.current[i];
        if (!cara) return;
        const nivel = Math.min(d, stackProfundidad + 1);
        cara.style.transform =
          nivel === 0
            ? ''
            : `translateY(${-nivel * stackSolape}px) scale(${1 - nivel * STACK_ESCALA})`;
        // Más allá de la profundidad máxima se desvanece en vez de seguir asomando.
        const opacidad = Math.min(1, Math.max(0, stackProfundidad + 1 - d));
        cara.style.opacity = opacidad === 1 ? '' : String(opacidad);
      });
    };
    const pedir = () => {
      if (!frame) frame = requestAnimationFrame(pintar);
    };
    pintar();
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    return () => {
      window.removeEventListener('scroll', pedir);
      window.removeEventListener('resize', pedir);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length, pegue, stackSolape, stackProfundidad]);

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      {items.map((item, i) => (
        <div
          key={`${item.href}|${item.title ?? ''}|${i}`}
          ref={(el) => {
            wrappers.current[i] = el;
          }}
          className="sticky motion-reduce:static"
          style={{ top: `${pegue}px`, zIndex: i + 1 }}
        >
          <div
            ref={(el) => {
              caras.current[i] = el;
            }}
            data-pila-cara
            className="origin-top will-change-transform motion-reduce:transform-none"
          >
            <Tile item={item} variant="stack" ctaLabel={ctaLabel} />
          </div>
        </div>
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
  const velo = VELOS[item.overlay ?? 'default'] ?? VELOS.default;
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
        data-overlay={item.overlay ?? 'default'}
        className={cn('absolute inset-0 -z-10', esStack ? velo.baseStack : velo.base)}
      />
      {/* Velo pegado al bloque de texto (no al alto del tile): se estira
          96px más allá del texto hacia la foto, así el contraste no depende
          de la imagen ni de cuánto mide el tile. */}
      <div
        className={cn(
          'relative w-full p-[clamp(22px,2.5vw,34px)] [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]',
          "before:pointer-events-none before:absolute before:inset-x-0 before:-z-10 before:content-['']",
          esStack
            ? cn('before:-bottom-24 before:top-0', velo.textoStack)
            : cn('before:-top-24 before:bottom-0', velo.texto),
        )}
      >
        {item.eyebrow ? (
          <small className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.2em] text-highlight">
            {item.eyebrow}
          </small>
        ) : null}
        {item.title ? (
          <h3 className="font-display text-[clamp(24px,2.4vw,34px)] font-medium leading-[1.1] text-white">
            {item.title}
          </h3>
        ) : null}
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
