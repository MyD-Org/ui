import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SelectionBarProps {
  count: number;
  label?: ReactNode;
  summary?: ReactNode;
  emptyHint?: ReactNode;
  onClear?: () => void;
  children?: ReactNode;
  className?: string;
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function SelectionBar({ count, label, summary, emptyHint, onClear, children, className }: SelectionBarProps) {
  const active = count > 0;
  if (!active && emptyHint == null) return null;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        active ? 'bg-primary text-on-primary' : 'border border-border bg-elevated text-muted',
        className,
      )}
    >
      {active && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpiar selección"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
        >
          <XIcon />
        </button>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <span className="text-sm font-semibold">{label ?? `${count} seleccionado${count !== 1 ? 's' : ''}`}</span>
            {summary != null && <span className="text-xs opacity-80">{summary}</span>}
          </>
        ) : (
          <span className="text-sm">{emptyHint}</span>
        )}
      </div>
      {active && children != null && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}
