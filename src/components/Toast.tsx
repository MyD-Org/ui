import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

const headerTone: Record<ToastTone, string> = {
  neutral: 'text-muted border-border',
  success: 'text-success border-border',
  danger: 'text-danger border-border',
  warning: 'text-warning border-border',
};

const toneIcon: Record<ToastTone, ReactNode> = {
  neutral: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  danger: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4m0 4h.01" />
    </svg>
  ),
};

export type ToastTone = 'neutral' | 'success' | 'danger' | 'warning';

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  icon?: ReactNode;
  action?: ToastAction;
  durationMs?: number;
}

interface ToastInstance extends ToastInput {
  id: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

export interface ToastProviderProps {
  children: ReactNode;
  defaultDurationMs?: number;
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ToastCard({ it, dismiss }: { it: ToastInstance; dismiss: (id: string) => void }) {
  const tone = it.tone ?? 'neutral';
  const hasBody = it.description != null || it.icon != null;
  const hasAction = it.action != null;

  return (
    <div
      role="status"
      className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-2)]"
    >
      {/* Header */}
      <div className={cn('flex items-center gap-2 border-b px-4 py-2.5 text-sm font-semibold', headerTone[tone])}>
        {toneIcon[tone]}
        <span className="flex-1">{it.title}</span>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => dismiss(it.id)}
          className="-mr-1 shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-elevated hover:text-text"
        >
          <XIcon />
        </button>
      </div>

      {/* Body */}
      {hasBody && (
        <div className="flex items-center gap-3 px-4 py-3">
          {it.icon != null && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-elevated text-muted">
              {it.icon}
            </div>
          )}
          {it.description != null && (
            <p className="min-w-0 flex-1 text-sm text-muted">{it.description}</p>
          )}
        </div>
      )}

      {/* Action */}
      {hasAction && (
        <div className={cn('px-4', hasBody ? 'pb-4' : 'py-3')}>
          {it.action!.href ? (
            <a
              href={it.action!.href}
              onClick={it.action!.onClick}
              className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {it.action!.label}
            </a>
          ) : (
            <button
              type="button"
              onClick={it.action!.onClick}
              className="block w-full rounded-lg bg-primary py-2 text-center text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              {it.action!.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ToastProvider({ children, defaultDurationMs = 4000 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastInstance[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastInstance = { id, ...input };
      setItems((prev) => [...prev, item]);
      const duration = input.durationMs ?? defaultDurationMs;
      if (duration > 0) {
        const t = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, t);
      }
      return id;
    },
    [defaultDurationMs, dismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast: push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notificaciones"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {items.map((it) => (
          <ToastCard key={it.id} it={it} dismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = 'ToastProvider';
