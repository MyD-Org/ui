import { cn } from '../lib/cn';

/**
 * Skeletons fidedignos por tipo de widget (dashboards): mientras la query asociada
 * carga, el placeholder tiene la MISMA silueta que el widget final (ejes+barras,
 * línea, donut, tabla, KPI) — no un rectángulo genérico.
 */

function Bone({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded bg-elevated', className)} />;
}

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Cargando indicador"
      className={cn('rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-1)]', className)}
    >
      <Bone className="h-3.5 w-24" />
      <Bone className="mt-2.5 h-8 w-32" />
    </div>
  );
}

export interface ChartSkeletonProps {
  /** Silueta a imitar. */
  kind?: 'bar' | 'line' | 'area' | 'pie' | 'donut';
  height?: number;
  className?: string;
}

const BAR_HEIGHTS = ['62%', '38%', '78%', '52%', '88%', '44%', '70%', '58%'];

export function ChartSkeleton({ kind = 'bar', height = 280, className }: ChartSkeletonProps) {
  if (kind === 'pie' || kind === 'donut') {
    const hole = kind === 'donut';
    return (
      <div role="status" aria-label="Cargando gráfico" style={{ height }} className={cn('flex flex-col items-center justify-center gap-3', className)}>
        <div className="relative animate-pulse" style={{ width: height * 0.55, height: height * 0.55 }}>
          <div className="h-full w-full rounded-full bg-elevated" />
          {hole && <div className="absolute inset-[19%] rounded-full bg-surface" />}
        </div>
        <div className="flex gap-2">
          <Bone className="h-3 w-14" />
          <Bone className="h-3 w-14" />
          <Bone className="h-3 w-14" />
        </div>
      </div>
    );
  }

  // cartesiano (bar / line / area): eje Y + área de plot + eje X
  return (
    <div role="status" aria-label="Cargando gráfico" style={{ height }} className={cn('flex flex-col gap-2 p-1', className)}>
      <div className="flex min-h-0 flex-1 gap-2">
        <div className="flex w-8 flex-col justify-between py-1">
          <Bone className="h-2.5 w-7" />
          <Bone className="h-2.5 w-6" />
          <Bone className="h-2.5 w-7" />
          <Bone className="h-2.5 w-5" />
        </div>
        <div className="relative min-w-0 flex-1 border-b border-l border-border">
          {kind === 'bar' ? (
            <div className="absolute inset-0 flex items-end justify-around gap-2 px-2 pb-px">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className="w-full max-w-8 animate-pulse rounded-t bg-elevated" style={{ height: h }} />
              ))}
            </div>
          ) : (
            <svg className="absolute inset-0 h-full w-full animate-pulse" preserveAspectRatio="none" viewBox="0 0 100 40" aria-hidden>
              <path
                d="M0 30 Q10 18 20 24 T40 20 T60 14 T80 18 T100 8"
                fill={kind === 'area' ? 'var(--color-elevated)' : 'none'}
                stroke="var(--color-border-strong)"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
              />
              {kind === 'area' && <path d="M0 30 Q10 18 20 24 T40 20 T60 14 T80 18 T100 8 V40 H0 Z" fill="var(--color-elevated)" />}
            </svg>
          )}
        </div>
      </div>
      <div className="flex justify-around pl-10">
        <Bone className="h-2.5 w-10" />
        <Bone className="h-2.5 w-10" />
        <Bone className="h-2.5 w-10" />
        <Bone className="h-2.5 w-10" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div role="status" aria-label="Cargando tabla" className={cn('overflow-hidden', className)}>
      <div className="flex gap-4 border-b border-border pb-2">
        <Bone className="h-3 w-28" />
        <Bone className="h-3 w-20" />
        <Bone className="h-3 w-24" />
        <Bone className="h-3 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-border py-2.5">
          <Bone className="h-3 w-32" />
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-24" />
          <Bone className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
