import type { ReactNode } from 'react';

/**
 * Escape hatch para que el consumidor reemplace el `<img>` por la imagen de su
 * framework (ej. `next/image`) sin reconstruir las clases del DS: recibe todo lo
 * que la imagen necesita y devuelve el nodo, que se inserta en el mismo lugar
 * del árbol que el `<img>` por defecto (sin envolverlo).
 *
 * - `sizes`: lo decide el componente según su layout (se puede pisar con su
 *   prop `imageSizes`). El `<img>` por defecto no lo usa: no lleva `srcset`.
 * - `fit`: `cover` = foto de fondo que llena su caja (`absolute inset-0 …
 *   object-cover`); `logo` = alto fijo y ancho según la proporción.
 * - `priority`: la imagen está arriba del fold (LCP). El default la carga
 *   `eager`; la prioridad real de red la da el renderer del consumidor.
 */
export interface RenderImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  fit: 'cover' | 'logo';
  priority?: boolean;
  /** Atributos `data-*` que el componente quiera dejar en la imagen (ej. `data-logo`). */
  [dataAttr: `data-${string}`]: string | undefined;
}

export type RenderImage = (props: RenderImageProps) => ReactNode;

/**
 * `<img>` con carga diferida salvo `priority`. Sin `fetchPriority`: la prop cambia
 * de nombre entre React 18 y 19 y el DS soporta los dos.
 */
export const defaultRenderImage: RenderImage = ({ src, alt, className, priority, sizes: _sizes, fit: _fit, ...data }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    {...data}
  />
);
