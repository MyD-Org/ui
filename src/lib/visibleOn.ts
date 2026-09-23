/**
 * Dónde se ve algo: solo en mobile (debajo de `md`) o solo en desktop (`md` en
 * adelante). Ausente ⇒ en los dos. Es el mismo corte que las versiones
 * `…Mobile` de los textos. Se resuelve por CSS: sin JS ni salto de hidratación.
 */
export type VisibleOn = 'mobile' | 'desktop';

/** Clase que oculta el elemento en el otro tamaño. */
export function visibleOnClass(visibleOn?: VisibleOn): string | undefined {
  if (visibleOn === 'mobile') return 'md:hidden';
  if (visibleOn === 'desktop') return 'max-md:hidden';
  return undefined;
}
