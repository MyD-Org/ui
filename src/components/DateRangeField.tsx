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

/** Textos del campo (i18n). Defaults en español; el consumidor puede pisarlos por locale. */
export interface DateRangeFieldLabels {
  placeholder: string;
  clear: string;
  /** Prefijos para rangos abiertos: "Desde X" / "Hasta X". */
  from: string;
  until: string;
  presets: {
    last30: string;
    last90: string;
    last12m: string;
    thisYear: string;
  };
}

export const defaultDateRangeFieldLabels: DateRangeFieldLabels = {
  placeholder: 'Elegir período',
  clear: 'Limpiar',
  from: 'Desde',
  until: 'Hasta',
  presets: {
    last30: 'Últimos 30 días',
    last90: 'Últimos 90 días',
    last12m: 'Últimos 12 meses',
    thisYear: 'Este año',
  },
};

export interface DateRangeFieldProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  /** aria-label del trigger. */
  label?: string;
  /** @deprecated usar labels.placeholder. Se mantiene por retrocompat. */
  placeholder?: string;
  /** Textos del campo (i18n). Merge superficial sobre los defaults en español. */
  labels?: Partial<DateRangeFieldLabels>;
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

function formatRange(value: DateRangeValue | undefined, labels: DateRangeFieldLabels): string | null {
  const start = parseIso(value?.start);
  const end = parseIso(value?.end);
  if (!start && !end) return null;
  if (start && end) return `${fmt.format(start)} – ${fmt.format(end)}`;
  if (start) return `${labels.from} ${fmt.format(start)}`;
  return `${labels.until} ${fmt.format(end!)}`;
}

const PRESETS: Array<{ key: keyof DateRangeFieldLabels['presets']; range: () => DateRangeValue }> = [
  { key: 'last30', range: () => lastDays(30) },
  { key: 'last90', range: () => lastDays(90) },
  { key: 'last12m', range: () => lastDays(365) },
  { key: 'thisYear', range: () => ({ start: `${new Date().getFullYear()}-01-01`, end: toIso(new Date()) }) },
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
  placeholder,
  labels,
  presets = true,
  disabled,
  className,
}: DateRangeFieldProps) {
  const [open, setOpen] = useState(false);
  const t: DateRangeFieldLabels = {
    ...defaultDateRangeFieldLabels,
    ...labels,
    // placeholder legacy: labels.placeholder > prop placeholder > default
    placeholder: labels?.placeholder ?? placeholder ?? defaultDateRangeFieldLabels.placeholder,
    presets: { ...defaultDateRangeFieldLabels.presets, ...labels?.presets },
  };
  const display = formatRange(value, t);
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
          aria-label={label ?? t.placeholder}
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
          {display ?? t.placeholder}
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
                    key={p.key}
                    type="button"
                    className="rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm text-text transition-colors hover:bg-elevated"
                    onClick={() => {
                      apply(p.range());
                      setOpen(false);
                    }}
                  >
                    {t.presets[p.key]}
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
                  {t.clear}
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
                // El número vive en day_button (que trae text-text). Forzamos el color del botón
                // a on-primary en el día seleccionado, si no queda invisible (blanco/blanco en dark,
                // oscuro/oscuro en light). Los días intermedios conservan text-text sobre el soft.
                selected: 'bg-primary hover:bg-primary [&>button]:text-on-primary [&>button]:hover:bg-primary',
                range_start: 'rounded-r-none',
                range_end: 'rounded-l-none',
                range_middle: 'rounded-none bg-primary-soft [&>button]:!text-text [&>button]:hover:bg-primary-soft',
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
