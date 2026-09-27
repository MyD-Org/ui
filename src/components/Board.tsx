'use client';

import { type DragEvent, type ReactNode, useState } from 'react';
import { cn } from '../lib/cn.js';

export interface BoardColumn {
  id: string;
  title: string;
  /** Texto o nodo corto al lado del contador (ej. un total en $). */
  hint?: ReactNode;
}

export interface BoardProps<T> {
  columns: BoardColumn[];
  items: T[];
  getColumnId: (item: T) => string;
  getItemId: (item: T) => string;
  renderCard: (item: T) => ReactNode;
  /**
   * Si no se pasa, cualquier destino es válido. Se evalúa mientras se arrastra
   * (sobre cada columna) para pintar el feedback y de nuevo al soltar.
   */
  canDrop?: (item: T, toColumnId: string) => boolean;
  /** No se llama si `toColumnId` es la columna en la que ya estaba la tarjeta. */
  onMove?: (item: T, toColumnId: string) => void;
  /** Nodo por columna cuando no tiene tarjetas. */
  empty?: ReactNode;
  className?: string;
}

/**
 * Tablero kanban genérico y accesible. El arrastre es drag and drop nativo de
 * HTML5, mejora progresiva: sin JS de arrastre el tablero sigue siendo
 * columnas legibles con sus tarjetas. El componente **no** ofrece un menú de
 * "Mover a…" — quien lo consume lo agrega dentro de `renderCard` (por ejemplo
 * un `DropdownMenu` con una opción por columna) para que el movimiento no
 * dependa del arrastre.
 */
export function Board<T>({
  columns,
  items,
  getColumnId,
  getItemId,
  renderCard,
  canDrop,
  onMove,
  empty,
  className,
}: BoardProps<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const draggingItem = draggingId == null ? undefined : items.find((it) => getItemId(it) === draggingId);

  const dropAllowed = (toColumnId: string) => {
    if (!draggingItem) return true;
    return canDrop ? canDrop(draggingItem, toColumnId) : true;
  };

  const reset = () => {
    setDraggingId(null);
    setOverColumnId(null);
  };

  return (
    <div
      className={cn('grid auto-cols-[minmax(230px,1fr)] grid-flow-col gap-4 overflow-x-auto scroll-fino pb-2', className)}
    >
      {columns.map((column) => {
        const columnItems = items.filter((it) => getColumnId(it) === column.id);
        const isOver = overColumnId === column.id;
        const valid = isOver && dropAllowed(column.id);
        const invalid = isOver && !dropAllowed(column.id);

        return (
          <section
            key={column.id}
            aria-label={column.title}
            onDragOver={(e: DragEvent<HTMLElement>) => {
              if (!draggingId) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = dropAllowed(column.id) ? 'move' : 'none';
              setOverColumnId(column.id);
            }}
            onDragLeave={(e: DragEvent<HTMLElement>) => {
              if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
              setOverColumnId((current) => (current === column.id ? null : current));
            }}
            onDrop={(e: DragEvent<HTMLElement>) => {
              e.preventDefault();
              const itemId = e.dataTransfer.getData('text/plain') || draggingId;
              const item = itemId == null ? undefined : items.find((it) => getItemId(it) === itemId);
              reset();
              if (!item) return;
              if (getColumnId(item) === column.id) return;
              if (!dropAllowed(column.id)) return;
              onMove?.(item, column.id);
            }}
            className={cn(
              'flex min-w-0 flex-col rounded-lg border bg-surface transition-colors',
              valid && 'border-primary bg-primary-soft/40',
              invalid && 'border-danger bg-danger-soft/40',
              !valid && !invalid && 'border-border',
            )}
          >
            <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <h3 className="truncate text-sm font-semibold text-text">{column.title}</h3>
              <div className="flex shrink-0 items-center gap-2 text-xs text-muted">
                {column.hint}
                <span className="tabular-nums">{columnItems.length}</span>
              </div>
            </header>
            <div className="scroll-fino flex min-h-16 flex-1 flex-col gap-2 overflow-y-auto p-2">
              {columnItems.length === 0
                ? empty && <div className="px-1 py-3 text-center text-xs text-muted">{empty}</div>
                : columnItems.map((item) => {
                    const itemId = getItemId(item);
                    const isDragging = draggingId === itemId;
                    return (
                      <div
                        key={itemId}
                        draggable
                        onDragStart={(e: DragEvent<HTMLDivElement>) => {
                          e.dataTransfer.effectAllowed = 'move';
                          e.dataTransfer.setData('text/plain', itemId);
                          setDraggingId(itemId);
                        }}
                        onDragEnd={reset}
                        className={cn(
                          'motion-reduce:transition-none transition-opacity',
                          isDragging && 'opacity-40',
                        )}
                      >
                        {renderCard(item)}
                      </div>
                    );
                  })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
