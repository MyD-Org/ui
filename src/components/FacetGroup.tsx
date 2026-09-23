import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { SearchInput } from './SearchInput';

export interface FacetItem {
  value: string;
  label: string;
  count?: number;
  checked: boolean;
  disabled?: boolean;
  /**
   * Nivel en un árbol (0 = raíz, default). Los ítems van en orden de lectura:
   * cada madre seguida de sus hijas. Con alguna madre el grupo se vuelve un
   * árbol plegable (ver `FacetGroupProps`). La fila entera —casilla incluida—
   * se corre a la derecha por nivel, hasta 3.
   */
  depth?: number;
}

/**
 * Sangría por nivel: el ancho del chevron más su separación, para que la
 * casilla de una hija quede bajo la de su madre. Clases fijas (no
 * interpoladas) para que el Tailwind del consumidor las vea.
 */
const sangria = ['', 'pl-6', 'pl-12', 'pl-18'] as const;

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface Nodo {
  depth: number;
  /** Índices de las madres, de la raíz hacia abajo. */
  madres: number[];
  tieneHijas: boolean;
}

/** Arma el árbol a partir del orden de lectura y los `depth`. */
function armarArbol(items: FacetItem[]): Nodo[] {
  const nivel = (i: number) => Math.max(0, items[i]?.depth ?? 0);
  const pila: number[] = [];
  return items.map((_, i) => {
    while (pila.length && nivel(pila[pila.length - 1]) >= nivel(i)) pila.pop();
    const madres = [...pila];
    pila.push(i);
    return { depth: nivel(i), madres, tieneHijas: i + 1 < items.length && nivel(i + 1) > nivel(i) };
  });
}

export interface FacetGroupProps {
  title: string;
  items: FacetItem[];
  onToggle: (value: string, checked: boolean) => void;
  /** Con `onClear` y algún ítem tildado se muestra el botón `clearLabel`. */
  onClear?: () => void;
  /** Default 'Limpiar'. */
  clearLabel?: string;
  /** Default false. Búsqueda client-side, insensible a mayúsculas y tildes. */
  searchable?: boolean;
  /** Default 'Buscar…'. */
  searchPlaceholder?: string;
  /**
   * Si `items.length` lo supera, colapsa a los primeros n no tildados + todos
   * los tildados. Default: sin colapso.
   *
   * Expandida (o con una búsqueda), la lista no crece: queda con el alto que
   * tenía colapsada y scrollea adentro. Así el grupo mide lo mismo abierto o
   * cerrado, y un panel de filtros que entraba en pantalla sigue entrando.
   */
  initialVisible?: number;
  /** Default 'Ver todas ({n})' — `{n}` = filas a la vista, sin las de ramas cerradas. */
  moreLabel?: string;
  /** Default 'Ver menos'. */
  lessLabel?: string;
  /** Texto cuando `items` está vacío. Default 'Sin opciones'. */
  emptyText?: string;
  /** Texto cuando la búsqueda no coincide con nada. Default 'Sin resultados'. */
  searchEmptyText?: string;
  /** Nombre del chevron que abre una rama. Default 'Ver subcategorías de {label}'. */
  expandLabel?: string;
  /** Nombre del chevron que cierra una rama. Default 'Ocultar subcategorías de {label}'. */
  collapseLabel?: string;
  className?: string;
}

/** Misma filosofía que `unaccent`: compara sin tildes ni mayúsculas. */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * Grupo de filtros con casillas.
 *
 * Árbol: si algún ítem tiene hijas (`depth` mayor justo debajo), las ramas se
 * pliegan. Arrancan cerradas salvo las que tienen algo tildado adentro, que se
 * abren solas; el chevron de cada madre las abre y cierra. Tildar una madre
 * cubre a toda su rama: sus hijas se muestran tildadas y deshabilitadas, y una
 * madre con sólo algunas hijas tildadas se muestra en estado intermedio. El
 * componente sólo lo dibuja: qué valores quedan en el filtro lo decide quien
 * recibe `onToggle` (p. ej. quitar las hijas al tildar la madre).
 */
export function FacetGroup({
  title,
  items,
  onToggle,
  onClear,
  clearLabel = 'Limpiar',
  searchable = false,
  searchPlaceholder = 'Buscar…',
  initialVisible = Infinity,
  moreLabel = 'Ver todas ({n})',
  lessLabel = 'Ver menos',
  emptyText = 'Sin opciones',
  searchEmptyText = 'Sin resultados',
  expandLabel = 'Ver subcategorías de {label}',
  collapseLabel = 'Ocultar subcategorías de {label}',
  className,
}: FacetGroupProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const searching = searchable && query.trim() !== '';

  const arbol = useMemo(() => armarArbol(items), [items]);
  const esArbol = arbol.some((n) => n.tieneHijas);
  // Madres con algo tildado adentro: se abren solas y, si no están tildadas,
  // se muestran en estado intermedio.
  const conTildadaAdentro = useMemo(() => {
    const set = new Set<number>();
    items.forEach((it, i) => it.checked && arbol[i].madres.forEach((m) => set.add(m)));
    return set;
  }, [items, arbol]);
  // Lo que el visitante abrió o cerró a mano; lo demás sigue la regla de arriba.
  const [ramas, setRamas] = useState<Record<string, boolean>>({});
  const abierta = (i: number) => ramas[items[i].value] ?? conTildadaAdentro.has(i);

  const filas = useMemo(() => {
    const todas = items.map((it, i) => ({ it, i }));
    if (searching) {
      const q = fold(query.trim());
      return todas.filter(({ it }) => fold(it.label).includes(q));
    }
    return todas.filter(({ i }) => arbol[i].madres.every((m) => ramas[items[m].value] ?? conTildadaAdentro.has(m)));
  }, [items, arbol, searching, query, ramas, conTildadaAdentro]);

  const collapsible = !searching && filas.length > initialVisible;

  const visible = useMemo(() => {
    if (!collapsible || expanded) return filas;
    let unchecked = 0;
    return filas.filter(({ it }) => it.checked || unchecked++ < initialVisible);
  }, [filas, collapsible, expanded, initialVisible]);

  const anyChecked = items.some((it) => it.checked);

  // Alto de la lista colapsada, medido cada vez que se la ve colapsada (cambia
  // si se tilda algo: los tildados se suman a los n visibles). Se mide en vez
  // de calcular n × alto de fila para no depender de lo que mida un checkbox
  // en cada piel. 0 = todavía sin medir (o jsdom): no se pone tope.
  const listaRef = useRef<HTMLUListElement>(null);
  const [altoColapsada, setAltoColapsada] = useState(0);
  const colapsada = collapsible && !expanded;
  useLayoutEffect(() => {
    if (colapsada && listaRef.current) setAltoColapsada(listaRef.current.offsetHeight);
  }, [colapsada, visible.length]);
  const conTope = altoColapsada > 0 && (expanded || searching) && initialVisible !== Infinity;

  return (
    <div role="group" aria-labelledby={titleId} className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 id={titleId} className="text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </h3>
        {onClear && anyChecked && (
          <Button variant="link" size="inline" onClick={onClear}>
            {clearLabel}
          </Button>
        )}
      </div>

      {searchable && items.length > 0 && (
        <SearchInput value={query} onValueChange={setQuery} placeholder={searchPlaceholder} className="w-full" />
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted">{emptyText}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted">{searchEmptyText}</p>
      ) : (
        <ul
          ref={listaRef}
          // `-mx-1 px-1`: aire para el anillo de foco del checkbox, que el
          // `overflow` recortaría contra el borde cuando la lista scrollea.
          //
          // Con tope, barra `scroll-fino` (ver tailwind.css): la nativa es un
          // control gris de sistema en medio del panel. `pr-3` la separa de los
          // conteos, que si no quedan pegados a ella.
          className={cn(
            '-mx-1 flex flex-col gap-1.5 px-1',
            conTope && 'scroll-fino overflow-y-auto overscroll-contain pr-3',
          )}
          style={conTope ? { maxHeight: altoColapsada } : undefined}
        >
          {visible.map(({ it, i }) => {
            const rowId = `${id}-${it.value}`;
            const nodo = arbol[i];
            // Cubierta por una madre tildada: se ve tildada, pero se destilda desde la madre.
            const incluida = nodo.madres.some((m) => items[m].checked);
            const parcial = !it.checked && !incluida && conTildadaAdentro.has(i);
            const conChevron = esArbol && !searching && nodo.tieneHijas;
            return (
              <li key={it.value} className={cn('flex items-center gap-1', sangria[Math.min(nodo.depth, sangria.length - 1)])}>
                {conChevron ? (
                  <button
                    type="button"
                    aria-expanded={abierta(i)}
                    aria-label={(abierta(i) ? collapseLabel : expandLabel).replace('{label}', it.label)}
                    onClick={() => setRamas((r) => ({ ...r, [it.value]: !abierta(i) }))}
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                  >
                    <span className={cn('transition-transform duration-150', !abierta(i) && '-rotate-90')}>
                      <ChevronIcon />
                    </span>
                  </button>
                ) : (
                  esArbol && !searching && <span aria-hidden="true" className="w-5 shrink-0" />
                )}
                <label
                  htmlFor={rowId}
                  className={cn('flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm text-text', (it.disabled || incluida) && 'cursor-not-allowed', it.disabled && 'opacity-50')}
                >
                  <Checkbox
                    id={rowId}
                    checked={it.checked || incluida}
                    indeterminate={parcial}
                    disabled={it.disabled || incluida}
                    aria-label={it.label}
                    onCheckedChange={(checked) => onToggle(it.value, checked)}
                  />
                  <span className="min-w-0 flex-1 truncate">{it.label}</span>
                  {it.count != null && <span className="text-xs tabular-nums text-muted">{it.count}</span>}
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {collapsible && (
        <div>
          <Button variant="link" size="inline" onClick={() => setExpanded((e) => !e)}>
            {expanded ? lessLabel : moreLabel.replace('{n}', String(filas.length))}
          </Button>
        </div>
      )}
    </div>
  );
}
FacetGroup.displayName = 'FacetGroup';
