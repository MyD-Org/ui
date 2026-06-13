import { type ReactNode, useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { Checkbox } from './Checkbox';

export type SortDir = 'asc' | 'desc';
export interface SortState {
  key: string;
  dir: SortDir;
}

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  defaultSortDir?: SortDir;
  hideBelow?: 'sm' | 'md' | 'lg';
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  className?: string;
  // sorting — uncontrolled by default (built-in client sort); controlled via sort + onSortChange
  defaultSort?: SortState;
  sort?: SortState | null;
  onSortChange?: (sort: SortState) => void;
  // selection — opt-in; uncontrolled by default, controlled via selectedKeys + onSelectionChange
  selectable?: boolean;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  // interaction
  onRowClick?: (row: T) => void;
}

const alignClass = (align?: 'left' | 'right' | 'center') =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

const hideClass = (b?: 'sm' | 'md' | 'lg') =>
  b === 'sm' ? 'hidden sm:table-cell' : b === 'md' ? 'hidden md:table-cell' : b === 'lg' ? 'hidden lg:table-cell' : '';

function defaultCompare(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function getSortValue<T>(col: TableColumn<T>, row: T): string | number {
  if (col.sortValue) return col.sortValue(row);
  const v = (row as Record<string, unknown>)[col.key];
  return typeof v === 'number' ? v : String(v ?? '');
}

function SortIndicator({ dir }: { dir: SortDir }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', dir === 'asc' && 'rotate-180')}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  empty,
  className,
  defaultSort,
  sort,
  onSortChange,
  selectable,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  onRowClick,
}: TableProps<T>) {
  const isControlledSort = sort !== undefined;
  const [internalSort, setInternalSort] = useState<SortState | null>(defaultSort ?? null);
  const activeSort = isControlledSort ? sort : internalSort;

  const isControlledSel = selectedKeys !== undefined;
  const [internalSel, setInternalSel] = useState<string[]>(defaultSelectedKeys ?? []);
  const selected = isControlledSel ? selectedKeys : internalSel;
  const selectedSet = new Set(selected);

  function toggleSort(col: TableColumn<T>) {
    const dir: SortDir =
      activeSort && activeSort.key === col.key
        ? activeSort.dir === 'asc'
          ? 'desc'
          : 'asc'
        : col.defaultSortDir ?? 'asc';
    const next: SortState = { key: col.key, dir };
    onSortChange?.(next);
    if (!isControlledSort) setInternalSort(next);
  }

  function setSelection(next: string[]) {
    onSelectionChange?.(next);
    if (!isControlledSel) setInternalSel(next);
  }

  const displayRows = useMemo(() => {
    if (isControlledSort || !activeSort) return rows;
    const col = columns.find((c) => c.key === activeSort.key && c.sortable);
    if (!col) return rows;
    const sorted = [...rows].sort((a, b) => defaultCompare(getSortValue(col, a), getSortValue(col, b)));
    if (activeSort.dir === 'desc') sorted.reverse();
    return sorted;
  }, [rows, activeSort, isControlledSort, columns]);

  const allKeys = displayRows.map(rowKey);
  const allSelected = selectable === true && allKeys.length > 0 && allKeys.every((k) => selectedSet.has(k));
  const someSelected = selectable === true && !allSelected && allKeys.some((k) => selectedSet.has(k));

  function toggleAll() {
    if (allSelected) {
      setSelection(selected.filter((k) => !allKeys.includes(k)));
    } else {
      setSelection(Array.from(new Set([...selected, ...allKeys])));
    }
  }

  function toggleRow(key: string) {
    setSelection(selectedSet.has(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  }

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm text-text">
        <thead>
          <tr className="border-b border-border">
            {selectable && (
              <th className="w-10 px-2 py-2">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar todo"
                />
              </th>
            )}
            {columns.map((col) => {
              const isActive = activeSort?.key === col.key;
              return (
                <th
                  key={col.key}
                  aria-sort={
                    col.sortable
                      ? isActive
                        ? activeSort?.dir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  className={cn(
                    'px-3 py-2 text-xs font-medium text-muted',
                    alignClass(col.align),
                    hideClass(col.hideBelow),
                    col.headerClassName,
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col)}
                      className={cn(
                        'inline-flex cursor-pointer select-none items-center gap-1 font-medium transition-colors hover:text-text',
                        isActive && 'text-primary',
                      )}
                    >
                      {col.header}
                      {isActive && activeSort && <SortIndicator dir={activeSort.dir} />}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayRows.length === 0 ? (
            <tr>
              <td colSpan={colSpan} className="px-3 py-8 text-center text-muted">
                {empty ?? 'Sin datos.'}
              </td>
            </tr>
          ) : (
            displayRows.map((row) => {
              const key = rowKey(row);
              const isSelected = selectedSet.has(key);
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-border transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-primary/10' : 'hover:bg-elevated',
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(key)}
                        aria-label="Seleccionar fila"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-3 py-2.5', alignClass(col.align), hideClass(col.hideBelow), col.className)}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
