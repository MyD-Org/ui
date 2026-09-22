import {
  Children,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Las tarjetas ya armadas. Es el único slot por children del DS: lo que va
   * adentro (precio en vivo, agregar al carrito, favoritos) es de la app, y
   * duplicar la card acá la dejaría desincronizada de `ProductCard`.
   */
  children: ReactNode;
  /** Nombre de la lista para lectores de pantalla ("Los más vendidos"). */
  label: string;
  /** Cuántas tarjetas entran desde lg. En mobile siempre asoma la siguiente. */
  perView?: 3 | 4;
  /** Texto de las flechas para lectores de pantalla. */
  labels?: { prev: string; next: string };
}

const ANCHOS: Record<3 | 4, string> = {
  3: 'w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-2*1.25rem)/3)]',
  4: 'w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3*1.25rem)/4)]',
};

/**
 * Carrusel horizontal de tarjetas.
 *
 * Usa el scroll nativo con `scroll-snap`, no una pista transformada por JS: en
 * touch se arrastra con el dedo con la inercia del sistema, y el arrastre nunca
 * puede trabarse porque no pasa por el hilo principal. Las flechas (sólo desde
 * lg, donde no hay gesto) mueven el scroll casi un ancho por clic.
 *
 * Las flechas se ocultan cuando no hay a dónde ir: si las tarjetas entran todas
 * en pantalla no aparece ningún control que no haga nada.
 */
export function Carousel({
  children,
  label,
  perView = 4,
  labels = { prev: 'Ver anteriores', next: 'Ver siguientes' },
  className,
  ...props
}: CarouselProps) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(true);

  function medir() {
    const el = pistaRef.current;
    if (!el) return;
    setAlInicio(el.scrollLeft <= 1);
    setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }

  useEffect(() => {
    medir();
    const el = pistaRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    // Al cambiar el ancho cambia cuántas tarjetas entran, y con eso si sigue
    // habiendo a dónde scrollear.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function mover(direccion: 1 | -1) {
    const el = pistaRef.current;
    if (!el) return;
    el.scrollBy({ left: direccion * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  const sinScroll = alInicio && alFinal;

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={pistaRef}
        onScroll={medir}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* toArray y no Children.map: cruzando el límite de server component,
            map dejaba las celdas sin key estable y React avisaba por consola. */}
        {Children.toArray(children).map((hijo, i) => (
          <div key={i} className={ANCHOS[perView]}>
            {hijo}
          </div>
        ))}
      </div>

      {!sinScroll ? (
        <>
          <Flecha hacia="prev" onClick={() => mover(-1)} apagada={alInicio} label={labels.prev} />
          <Flecha hacia="next" onClick={() => mover(1)} apagada={alFinal} label={labels.next} />
        </>
      ) : null}
    </div>
  );
}

function Flecha({
  hacia,
  onClick,
  apagada,
  label,
}: {
  hacia: 'prev' | 'next';
  onClick: () => void;
  apagada: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={apagada}
      aria-label={label}
      // Sólo desde lg: en touch se arrastra con el dedo y la flecha estorba.
      className={cn(
        'absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-2 transition-[opacity,scale] duration-150 ease-out active:scale-95 lg:flex',
        hacia === 'prev' ? '-left-4' : '-right-4',
        apagada ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {hacia === 'prev' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
