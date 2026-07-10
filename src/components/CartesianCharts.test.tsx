import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LineChart } from './LineChart';
import { AreaChart } from './AreaChart';
import { BarChart } from './BarChart';

const data = [
  { mes: 'Ene', ventas: 10, costos: 6 },
  { mes: 'Feb', ventas: 14, costos: 8 },
];

describe.each([
  ['LineChart', LineChart],
  ['AreaChart', AreaChart],
  ['BarChart', BarChart],
] as const)('%s', (_name, Chart) => {
  it('renderiza SVG con leyenda de las series', () => {
    const { container } = render(
      <Chart data={data} xKey="mes" series={['ventas', { key: 'costos', label: 'Costos' }]} width={400} height={240} />,
    );
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
    expect(screen.getByText('ventas')).toBeInTheDocument();
    expect(screen.getByText('Costos')).toBeInTheDocument();
  });
  it('sin data muestra Sin datos', () => {
    render(<Chart xKey="mes" series={['ventas']} width={400} />);
    expect(screen.getByRole('img', { name: 'Sin datos' })).toBeInTheDocument();
  });
});

describe('BarChart horizontal', () => {
  it('renderiza con layout vertical de recharts (barras horizontales)', () => {
    const { container } = render(
      <BarChart data={data} xKey="mes" series={['ventas']} horizontal width={400} height={240} />,
    );
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
  });
});
