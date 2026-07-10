import { CartesianGrid, Legend, Line, LineChart as RLineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, ChartEmpty, ChartShell, gridProps, normalizeSeries, tooltipProps, type SeriesSpec } from './chartTheme';

export interface LineChartProps {
  data?: Array<Record<string, unknown>>;
  xKey: string;
  series?: SeriesSpec[];
  height?: number;
  width?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function LineChart({ data, xKey, series, height = 280, width, showLegend = true, showGrid = true }: LineChartProps) {
  const s = normalizeSeries(series);
  if (!data?.length || !s.length) return <ChartEmpty height={height} />;
  return (
    <ChartShell width={width} height={height}>
      <RLineChart data={data} width={width} height={width ? height : undefined} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid {...gridProps} />}
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={44} />
        <Tooltip {...tooltipProps} />
        {showLegend && <Legend />}
        {s.map((serie) => (
          <Line
            key={serie.key}
            type="monotone"
            dataKey={serie.key}
            name={serie.label}
            stroke={serie.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </RLineChart>
    </ChartShell>
  );
}
