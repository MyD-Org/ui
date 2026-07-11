import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker, type DateRange as DayPickerRange } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { cn } from '../lib/cn';

/** Rango en ISO YYYY-MM-DD (vacío = sin límite). Es el shape que consumen los dashboards. */
export interface DateRangeValue {
  start?: string;
  end?: string;
}

export interface DateRangeFieldProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  /** aria-label del trigger. */
  label?: string;
  placeholder?: string;
  /** Atajos rápidos (últimos 30/90 días, 12 meses, este año). Default: true. */
  presets?: boolean;
  disabled?: boolean;
  className?: string;
}

// '2026-07-11' → Date local (sin corrimiento de zona horaria).
function parseIso(iso?: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIso(date?: Date): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const fmt = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

function formatRange(value?: DateRangeValue): string | null {
  const start = parseIso(value?.start);
  const end = parseIso(value?.end);
  if (!start && !end) return null;
  if (start && end) return `${fmt.format(start)} – ${fmt.format(end)}`;
  if (start) return `Desde ${fmt.format(start)}`;
  return `Hasta ${fmt.format(end!)}`;
}

const PRESETS: Array<{ label: string; range: () => DateRangeValue }> = [
  { label: 'Últimos 30 días', range: () => lastDays(30) },
  { label: 'Últimos 90 días', range: () => lastDays(90) },
  { label: 'Últimos 12 meses', range: () => lastDays(365) },
  {
    label: 'Este año',
    range: () => ({ start: `${new Date().getFullYear()}-01-01`, end: toIso(new Date()) }),
  },
];

function lastDays(days: number): DateRangeValue {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start: toIso(start), end: toIso(end) };
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/** Selector de rango de fechas con calendario (2 meses) + presets, estilado con los tokens del DS. */
export function DateRangeField({
  value,
  onChange,
  label,
  placeholder = 'Elegir período',
  presets = true,
  disabled,
  className,
}: DateRangeFieldProps) {
  const [open, setOpen] = useState(false);
  const display = formatRange(value);
  const selected: DayPickerRange | undefined =
    value?.start || value?.end ? { from: parseIso(value?.start), to: parseIso(value?.end) } : undefined;

  const apply = (next: DateRangeValue) => {
    onChange?.(next);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={label ?? placeholder}
          disabled={disabled}
          className={cn(
            'flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border-strong bg-surface px-3 text-sm text-text',
            'transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            !display && 'text-muted',
            className,
          )}
        >
          <span className="text-muted"><CalendarIcon /></span>
          {display ?? placeholder}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 rounded-[var(--radius)] border border-border bg-surface p-3 shadow-2"
        >
          <div className="flex gap-3">
            {presets && (
              <div className="flex w-36 flex-col gap-0.5 border-r border-border pr-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm text-text transition-colors hover:bg-elevated"
                    onClick={() => {
                      apply(p.range());
                      setOpen(false);
                    }}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="mt-1 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm text-muted transition-colors hover:bg-elevated"
                  onClick={() => {
                    apply({ start: '', end: '' });
                    setOpen(false);
                  }}
                >
                  Limpiar
                </button>
              </div>
            )}
            <DayPicker
              mode="range"
              numberOfMonths={2}
              locale={es}
              selected={selected}
              defaultMonth={selected?.from}
              onSelect={(range) => {
                apply({ start: toIso(range?.from), end: toIso(range?.to) });
              }}
              classNames={{
                months: 'flex gap-6',
                month: 'space-y-2',
                month_caption: 'flex items-center justify-center h-8 text-sm font-medium text-text capitalize',
                nav: 'absolute inset-x-3 top-3 flex items-center justify-between',
                button_previous: 'h-7 w-7 rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-elevated hover:text-text inline-flex items-center justify-center',
                button_next: 'h-7 w-7 rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-elevated hover:text-text inline-flex items-center justify-center',
                chevron: 'fill-current h-4 w-4',
                month_grid: 'border-collapse',
                weekdays: 'flex',
                weekday: 'w-8 text-center text-xs font-normal text-subtle capitalize',
                week: 'flex mt-0.5',
                day: 'p-0',
                day_button:
                  'h-8 w-8 rounded-[var(--radius-sm)] text-sm text-text transition-colors hover:bg-elevated aria-selected:opacity-100',
                selected: 'bg-primary text-on-primary hover:bg-primary [&>button]:hover:bg-primary',
                range_start: 'rounded-r-none',
                range_end: 'rounded-l-none',
                range_middle: 'rounded-none bg-primary-soft text-text [&>button]:hover:bg-primary-soft',
                today: 'font-semibold',
                outside: 'text-subtle opacity-50',
                disabled: 'text-subtle opacity-40',
                hidden: 'invisible',
              }}
              className="relative"
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
