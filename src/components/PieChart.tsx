import { Cell, Legend, Pie, PieChart as RPieChart, Tooltip } from 'recharts';
import { CHART_COLORS, ChartEmpty, ChartShell, tooltipProps } from './chartTheme';

export interface PieChartProps {
  data?: Array<Record<string, unknown>>;
  labelKey: string;
  valueKey: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
  colors?: string[];
}

export interface BasePieProps extends PieChartProps {
  innerRadius?: string | number;
  centerLabel?: string;
}

/** Núcleo compartido de PieChart/DonutChart. NO se exporta en el barrel. */
export function BasePie({
  data,
  labelKey,
  valueKey,
  height = 280,
  width,
  showLegend = true,
  colors = CHART_COLORS,
  innerRadius,
  centerLabel,
}: BasePieProps) {
  if (!data?.length) return <ChartEmpty height={height} />;
  return (
    <ChartShell width={width} height={height}>
      <RPieChart width={width} height={width ? height : undefined}>
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={labelKey}
          innerRadius={innerRadius}
          outerRadius="82%"
          strokeWidth={1}
          stroke="var(--color-surface)"
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        {centerLabel !== undefined && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 24, fontWeight: 600, fill: 'var(--color-text)' }}
          >
            {centerLabel}
          </text>
        )}
        <Tooltip {...tooltipProps} />
        {showLegend && <Legend />}
      </RPieChart>
    </ChartShell>
  );
}

export function PieChart(props: PieChartProps) {
  return <BasePie {...props} />;
}
