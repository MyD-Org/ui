import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  className?: string;
}

export function Table<T>({ columns, rows, rowKey, empty, className }: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-surface', className)}>
      <table className="w-full text-sm text-text">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            {columns.map((c) => (
              <th key={c.key} className={cn('px-4 py-2.5 font-medium', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-muted">
                {empty ?? 'Sin datos.'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3', c.className)}>
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
