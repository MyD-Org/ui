import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/** Logo en la cinta: se muestra en gris uniforme. Conviene PNG o SVG con fondo transparente. */
export interface MarqueeLogo {
  src: string;
  alt: string;
}

/** Un texto, o un logo. */
export type MarqueeItem = string | MarqueeLogo;

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  items: MarqueeItem[];
}

/**
 * Cada mitad de la pista repite `items` hasta llegar a este mínimo. La pista
 * son dos mitades idénticas y la animación desplaza -50 %, así que el loop es
 * invisible SOLO si una mitad es más ancha que el viewport: con pocos ítems
 * cortos (4 ítems ≈ 900 px) una pantalla de 1920 px mostraba un hueco antes
 * de que la cinta volviera a empezar. 24 ítems (~5.000 px) cubren 4K de sobra.
 */
const MIN_ITEMS_POR_MITAD = 24;

/** Duración de una vuelta cuando la mitad tiene una sola repetición (velocidad base). */
const SEGUNDOS_POR_VUELTA_BASE = 32;

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[11px] w-[11px] text-accent" aria-hidden="true">
      <path d="M12 2c1.5 5.5 4.5 8.5 10 10-5.5 1.5-8.5 4.5-10 10-1.5-5.5-4.5-8.5-10-10 5.5-1.5 8.5-4.5 10-10z" />
    </svg>
  );
}

export function Marquee({ items, className, ...props }: MarqueeProps) {
  if (items.length === 0) return null;

  const repeticiones = Math.max(1, Math.ceil(MIN_ITEMS_POR_MITAD / items.length));
  const mitad = Array.from({ length: repeticiones }, () => items).flat();
  // La duración escala con las repeticiones para que la velocidad en px/s no
  // dependa de cuántos ítems haya.
  const duracion = `${SEGUNDOS_POR_VUELTA_BASE * repeticiones}s`;

  return (
    <div
      // `overflow-clip`, no `overflow-hidden`: con hidden la cinta es un
      // contenedor scrolleable (la pista mide miles de px), así que al hacer
      // clic adentro el navegador la toma como scroll activo y la página deja
      // de responder al teclado. `clip` recorta sin generar ese contenedor.
      // Y al ser decorativa (aria-hidden) no recibe clics ni se selecciona.
      className={cn(
        'select-none overflow-clip whitespace-nowrap border-y border-border py-4',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <div
        className="pointer-events-none inline-flex animate-marquee motion-reduce:[animation-play-state:paused]"
        style={{ animationDuration: duracion }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex items-center">
            {mitad.map((item, i) => (
              <span
                key={`${copy}-${i}`}
                className="inline-flex items-center gap-7 px-4 font-display text-[15px] italic text-muted"
              >
                {typeof item === 'string' ? (
                  item
                ) : (
                  // Alto fijo con ancho tope: los logos muy apaisados quedan
                  // más bajos y el peso visual se empareja. brightness-0 los
                  // lleva a negro y la opacidad al gris de la cinta, sea cual
                  // sea el color de la marca. alt vacío: la cinta es
                  // decorativa (aria-hidden).
                  <img
                    src={item.src}
                    alt=""
                    data-logo={item.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-7 w-auto max-w-[150px] object-contain brightness-0 opacity-50"
                  />
                )}
                <Sparkle />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
