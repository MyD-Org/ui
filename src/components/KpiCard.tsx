import { cn } from '../lib/cn';

export interface KpiCardProps {
  label: string;
  value?: string | number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  hint?: string;
  locale?: string;
  className?: string;
}

const toneClass = {
  neutral: 'text-text',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
} as const;

export function KpiCard({
  label,
  value,
  unit,
  prefix,
  suffix,
  tone = 'neutral',
  hint,
  locale = 'es-AR',
  className,
}: KpiCardProps) {
  const display =
    value === undefined || value === null
      ? '—'
      : typeof value === 'number'
        ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
        : value;
  return (
    <div className={cn('rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-1)]', className)}>
      <div className="text-sm text-muted">{label}</div>
      <div className={cn('mt-1 flex items-baseline gap-1 text-3xl font-semibold tracking-tight', toneClass[tone])}>
        {prefix && <span className="text-xl font-medium text-muted">{prefix}</span>}
        <span>{display}</span>
        {unit && <span className="text-sm font-normal text-muted">{unit}</span>}
        {suffix && <span className="text-xl font-medium text-muted">{suffix}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-subtle">{hint}</div>}
    </div>
  );
}
