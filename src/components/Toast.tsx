import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const toast = cva(
  'pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-md border bg-surface px-3 py-2.5 text-sm shadow-[var(--shadow-2)]',
  {
    variants: {
      tone: {
        neutral: 'border-border text-text',
        success: 'border-success/40 text-text',
        danger: 'border-danger/40 text-text',
        warning: 'border-warning/40 text-text',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

const dotTone: Record<NonNullable<ToastTone>, string> = {
  neutral: 'bg-muted',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
};

export type ToastTone = NonNullable<VariantProps<typeof toast>['tone']>;

export interface ToastInput {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
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
        {items.map((it) => {
          const tone = it.tone ?? 'neutral';
          return (
            <div key={it.id} role="status" className={cn(toast({ tone }))}>
              <span className={cn('mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full', dotTone[tone])} aria-hidden="true" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-medium text-text">{it.title}</span>
                {it.description != null && <span className="text-xs text-muted">{it.description}</span>}
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => dismiss(it.id)}
                className="-mr-1 shrink-0 self-start rounded-full p-1 text-muted transition-colors hover:bg-elevated hover:text-text"
              >
                <XIcon />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
ToastProvider.displayName = 'ToastProvider';
