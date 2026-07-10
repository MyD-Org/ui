import { BasePie, type PieChartProps } from './PieChart';

export interface DonutChartProps extends PieChartProps {
  /** Muestra la suma de valueKey centrada en el agujero. */
  showTotal?: boolean;
  locale?: string;
}

export function DonutChart({ showTotal, locale = 'es-AR', ...props }: DonutChartProps) {
  const total = showTotal
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
        (props.data ?? []).reduce((acc, row) => acc + (Number(row[props.valueKey]) || 0), 0),
      )
    : undefined;
  return <BasePie {...props} innerRadius="62%" centerLabel={total} />;
}
