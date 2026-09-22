import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  items: string[];
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
      className={cn('overflow-hidden whitespace-nowrap border-y border-border py-4', className)}
      aria-hidden="true"
      {...props}
    >
      <div
        className="inline-flex animate-marquee motion-reduce:[animation-play-state:paused]"
        style={{ animationDuration: duracion }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="inline-flex items-center">
            {mitad.map((item, i) => (
              <span
                key={`${copy}-${i}`}
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
