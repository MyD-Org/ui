import type { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';

export type SeriesSpec = string | { key: string; label?: string; color?: string };
export interface NormalizedSeries {
  key: string;
  label: string;
  color: string;
}

/** Paleta categórica del DS (tokens --chart-1..6; las apps la re-marcan por CSS). */
export const CHART_COLORS = [1, 2, 3, 4, 5, 6].map((n) => `var(--chart-${n})`);

export function normalizeSeries(series?: SeriesSpec[]): NormalizedSeries[] {
  if (!series) return [];
  return series.map((s, i) => {
    const spec = typeof s === 'string' ? { key: s } : s;
    return {
      key: spec.key,
      label: spec.label ?? spec.key,
      color: spec.color ?? CHART_COLORS[i % CHART_COLORS.length],
    };
  });
}

/** Placeholder para charts sin datos (regla SDUI: nunca crashear). */
export function ChartEmpty({ height, label = 'Sin datos' }: { height: number; label?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ height }}
      className="flex items-center justify-center rounded-[var(--radius)] border border-dashed border-border text-sm text-muted"
    >
      {label}
    </div>
  );
}

export const axisProps = {
  tick: { fill: 'var(--color-muted)', fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: 'var(--color-border)' },
} as const;

export const gridProps = { stroke: 'var(--color-border)', vertical: false } as const;

export const tooltipProps = {
  contentStyle: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
  },
} as const;

/** Con `width` fijo renderiza directo (tests / hosts que miden); si no, ResponsiveContainer. */
export function ChartShell({ width, height, children }: { width?: number; height: number; children: ReactElement }) {
  if (width) return children;
  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  );
}
