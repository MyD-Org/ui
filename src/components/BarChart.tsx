import { Bar, BarChart as RBarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, ChartEmpty, ChartShell, gridProps, normalizeSeries, tooltipProps, type SeriesSpec } from './chartTheme';

export interface BarChartProps {
  data?: Array<Record<string, unknown>>;
  xKey: string;
  series?: SeriesSpec[];
  stacked?: boolean;
  /** Barras horizontales (mapea a layout="vertical" de Recharts). */
  horizontal?: boolean;
  height?: number;
  width?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function BarChart({
  data,
  xKey,
  series,
  stacked,
  horizontal,
  height = 280,
  width,
  showLegend = true,
  showGrid = true,
}: BarChartProps) {
  const s = normalizeSeries(series);
  if (!data?.length || !s.length) return <ChartEmpty height={height} />;
  return (
    <ChartShell width={width} height={height}>
      <RBarChart
        data={data}
        width={width}
        height={width ? height : undefined}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
      >
        {showGrid && <CartesianGrid {...gridProps} />}
        {horizontal ? (
          <>
            <XAxis type="number" {...axisProps} />
            <YAxis dataKey={xKey} type="category" {...axisProps} width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps} />
            <YAxis {...axisProps} width={44} />
          </>
        )}
        <Tooltip {...tooltipProps} />
        {showLegend && <Legend />}
        {s.map((serie) => (
          <Bar
            key={serie.key}
            dataKey={serie.key}
            name={serie.label}
            fill={serie.color}
            stackId={stacked ? 'stack' : undefined}
            radius={horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </RBarChart>
    </ChartShell>
  );
}
