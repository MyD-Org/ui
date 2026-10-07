'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type UIEvent,
} from 'react';
import { cn } from '../lib/cn.js';

/** Elemento host. Enum de strings (SDUI-ready) en vez de `ElementType`. */
export type FadeScrollAs = 'div' | 'aside' | 'section' | 'nav' | 'article' | 'ul' | 'ol';

/** Desde qué breakpoint (Tailwind) se aplica el difuminado. `'always'` = en todos. */
export type FadeScrollFrom = 'always' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface FadeScrollProps extends HTMLAttributes<HTMLElement> {
  /** Elemento que se renderiza. Default `div`. */
  as?: FadeScrollAs;
  /** Alto del difuminado, en px. Default 48. */
  fadeSize?: number;
  /**
   * Desde qué breakpoint se aplica la máscara. Default `'always'`. El scroll y
   * el ocultar la barra no dependen de esto: el `overflow` lo define el
   * consumidor con `className` (ej. `lg:max-h-[...] lg:overflow-y-auto`).
   */
  fadeFrom?: FadeScrollFrom;
}

/**
 * Clases por breakpoint. Literales completos para que el Tailwind del consumidor
 * (que compila el DS con `@source`) los detecte. La máscara sale de la variable
 * `--fade-mask`, que el componente setea inline sólo del lado con más contenido.
 */
const MASCARA: Record<FadeScrollFrom, string> = {
  always: '[-webkit-mask-image:var(--fade-mask)] [mask-image:var(--fade-mask)]',
  sm: 'sm:[-webkit-mask-image:var(--fade-mask)] sm:[mask-image:var(--fade-mask)]',
  md: 'md:[-webkit-mask-image:var(--fade-mask)] md:[mask-image:var(--fade-mask)]',
  lg: 'lg:[-webkit-mask-image:var(--fade-mask)] lg:[mask-image:var(--fade-mask)]',
  xl: 'xl:[-webkit-mask-image:var(--fade-mask)] xl:[mask-image:var(--fade-mask)]',
  '2xl': '2xl:[-webkit-mask-image:var(--fade-mask)] 2xl:[mask-image:var(--fade-mask)]',
};

/** Tolerancia en px: el scroll por fracciones deja restos de 0,5 px. */
const TOLERANCIA = 1;

function asignar<T>(ref: Ref<T> | undefined, valor: T | null) {
  if (typeof ref === 'function') ref(valor);
  else if (ref) (ref as { current: T | null }).current = valor;
}

/**
 * Contenedor con scroll vertical SIN barra visible que difumina el borde de
 * arriba y/o el de abajo, sólo del lado donde todavía hay contenido por ver.
 *
 * - Se re-mide con `onScroll` y con `ResizeObserver` sobre el contenedor y sus
 *   hijos directos (el contenido cambia de alto: acordeones, carga de datos). Un
 *   `MutationObserver` re-suscribe cuando los hijos cambian.
 * - El layout (alto máximo, `overflow-y-auto`, sticky, padding) va en
 *   `className`. El componente no impone `overflow`: así el consumidor decide en
 *   qué breakpoint scrollea. Conviene un `pb` del tamaño del difuminado si el
 *   último elemento no debe quedar tapado.
 * - Con overflow, el contenedor entra en el orden de tabulación (`tabIndex=0`)
 *   para poder scrollearlo con el teclado, ya que no tiene barra. Con
 *   `aria-label` (y `as="div"`) se anuncia como `region`.
 * - `data-fade` (`none | top | bottom | both`) expone el estado, por si el
 *   consumidor quiere estilar con él. Sin animaciones.
 */
export const FadeScroll = forwardRef<HTMLElement, FadeScrollProps>(
  (
    {
      as = 'div',
      fadeSize = 48,
      fadeFrom = 'always',
      className,
      style,
      onScroll,
      tabIndex,
      role,
      children,
      ...props
    },
    ref,
  ) => {
    const elRef = useRef<HTMLElement | null>(null);
    const [hayMasArriba, setHayMasArriba] = useState(false);
    const [hayMasAbajo, setHayMasAbajo] = useState(false);

    const setRefs = useCallback(
      (el: HTMLElement | null) => {
        elRef.current = el;
        asignar(ref, el);
      },
      [ref],
    );

    const medir = useCallback(() => {
      const el = elRef.current;
      if (!el) return;
      setHayMasAbajo(el.scrollHeight - el.scrollTop - el.clientHeight > TOLERANCIA);
      setHayMasArriba(el.scrollTop > TOLERANCIA);
    }, []);

    useEffect(() => {
      const el = elRef.current;
      if (!el) return;
      medir();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(medir);
      const observar = () => {
        ro.disconnect();
        ro.observe(el);
        for (const hijo of Array.from(el.children)) ro.observe(hijo);
      };
      observar();
      let mo: MutationObserver | undefined;
      if (typeof MutationObserver !== 'undefined') {
        mo = new MutationObserver(() => {
          observar();
          medir();
        });
        mo.observe(el, { childList: true });
      }
      return () => {
        ro.disconnect();
        mo?.disconnect();
      };
    }, [medir]);

    const handleScroll = (e: UIEvent<HTMLElement>) => {
      medir();
      onScroll?.(e);
    };

    const n = fadeSize;
    const mascara =
      hayMasArriba && hayMasAbajo
        ? `linear-gradient(to bottom, transparent, black ${n}px, black calc(100% - ${n}px), transparent)`
        : hayMasAbajo
          ? `linear-gradient(to bottom, black calc(100% - ${n}px), transparent)`
          : hayMasArriba
            ? `linear-gradient(to bottom, transparent, black ${n}px)`
            : undefined;
    const desborda = hayMasArriba || hayMasAbajo;
    const lado = hayMasArriba && hayMasAbajo ? 'both' : hayMasAbajo ? 'bottom' : hayMasArriba ? 'top' : 'none';

    const Tag = as;
    return (
      <Tag
        ref={setRefs as Ref<never>}
        data-fade={lado}
        tabIndex={tabIndex ?? (desborda ? 0 : undefined)}
        role={role ?? (as === 'div' && props['aria-label'] ? 'region' : undefined)}
        onScroll={handleScroll}
        style={
          { ...(mascara ? { '--fade-mask': mascara } : null), scrollbarWidth: 'none', ...style } as CSSProperties
        }
        className={cn(
          '[&::-webkit-scrollbar]:hidden',
          mascara && MASCARA[fadeFrom],
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]',
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
FadeScroll.displayName = 'FadeScroll';
