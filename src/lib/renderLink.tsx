import type { ReactNode } from 'react';

/**
 * Escape hatch para que el consumidor reemplace el `<a>` por su enlace de framework
 * (ej. `next/link`) sin reconstruir las clases del DS: recibe TODO lo que el anchor
 * necesita (href, className, aria-*) y devuelve el nodo.
 */
export interface RenderLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page';
  /** Atributos `data-*` del enlace (ej. `data-size` en el tile de `RoomTiles`). Opcionales: aditivo. */
  [dataAttr: `data-${string}`]: string | undefined;
}

export type RenderLink = (props: RenderLinkProps) => ReactNode;

export const defaultRenderLink: RenderLink = (props) => <a {...props} />;
