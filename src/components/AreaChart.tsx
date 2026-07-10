import { Area, AreaChart as RAreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, ChartEmpty, ChartShell, gridProps, normalizeSeries, tooltipProps, type SeriesSpec } from './chartTheme';

export interface AreaChartProps {
  data?: Array<Record<string, unknown>>;
  xKey: string;
  series?: SeriesSpec[];
  stacked?: boolean;
  height?: number;
  width?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function AreaChart({ data, xKey, series, stacked, height = 280, width, showLegend = true, showGrid = true }: AreaChartProps) {
  const s = normalizeSeries(series);
  if (!data?.length || !s.length) return <ChartEmpty height={height} />;
  return (
    <ChartShell width={width} height={height}>
      <RAreaChart data={data} width={width} height={width ? height : undefined} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid {...gridProps} />}
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={44} />
        <Tooltip {...tooltipProps} />
        {showLegend && <Legend />}
        {s.map((serie) => (
          <Area
            key={serie.key}
            type="monotone"
            dataKey={serie.key}
            name={serie.label}
            stroke={serie.color}
            fill={serie.color}
            fillOpacity={0.15}
            strokeWidth={2}
            stackId={stacked ? 'stack' : undefined}
            isAnimationActive={false}
          />
        ))}
      </RAreaChart>
    </ChartShell>
  );
}
