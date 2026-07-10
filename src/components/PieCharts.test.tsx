import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PieChart } from './PieChart';
import { DonutChart } from './DonutChart';

const data = [
  { estado: 'aceptado', total: 12 },
  { estado: 'enviado', total: 8 },
];

describe('PieChart/DonutChart', () => {
  it('renderiza SVG con leyenda por categoría', () => {
    const { container } = render(<PieChart data={data} labelKey="estado" valueKey="total" width={400} height={240} />);
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
    expect(screen.getByText('aceptado')).toBeInTheDocument();
  });
  it('DonutChart con showTotal muestra la suma', () => {
    render(<DonutChart data={data} labelKey="estado" valueKey="total" showTotal width={400} height={240} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });
  it('sin data muestra Sin datos', () => {
    render(<PieChart labelKey="x" valueKey="y" width={400} />);
    expect(screen.getByRole('img', { name: 'Sin datos' })).toBeInTheDocument();
  });
});
