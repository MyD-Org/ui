import { useId, useMemo, useState } from 'react';
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
  /** Si `items.length` lo supera, colapsa a los primeros n no tildados + todos los tildados. Default: sin colapso. */
  initialVisible?: number;
  /** Default 'Ver todas ({n})' — `{n}` = `items.length`. */
  moreLabel?: string;
  /** Default 'Ver menos'. */
  lessLabel?: string;
  /** Texto cuando `items` está vacío. Default 'Sin opciones'. */
  emptyText?: string;
  /** Texto cuando la búsqueda no coincide con nada. Default 'Sin resultados'. */
  searchEmptyText?: string;
  className?: string;
}

/** Misma filosofía que `unaccent`: compara sin tildes ni mayúsculas. */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

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
  className,
}: FacetGroupProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const searching = searchable && query.trim() !== '';
  const collapsible = !searching && items.length > initialVisible;

  const visible = useMemo(() => {
    if (searching) {
      const q = fold(query.trim());
      return items.filter((it) => fold(it.label).includes(q));
    }
    if (!collapsible || expanded) return items;
    let unchecked = 0;
    return items.filter((it) => it.checked || unchecked++ < initialVisible);
  }, [items, searching, query, collapsible, expanded, initialVisible]);

  const anyChecked = items.some((it) => it.checked);

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
        <ul className="flex flex-col gap-1.5">
          {visible.map((it) => {
            const rowId = `${id}-${it.value}`;
            return (
              <li key={it.value}>
                <label
                  htmlFor={rowId}
                  className={cn('flex cursor-pointer items-center gap-2 text-sm text-text', it.disabled && 'cursor-not-allowed opacity-50')}
                >
                  <Checkbox
                    id={rowId}
                    checked={it.checked}
                    disabled={it.disabled}
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
            {expanded ? lessLabel : moreLabel.replace('{n}', String(items.length))}
          </Button>
        </div>
      )}
    </div>
  );
}
FacetGroup.displayName = 'FacetGroup';
