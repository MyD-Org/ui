import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartSkeleton, KpiCardSkeleton, TableSkeleton } from './WidgetSkeletons';

describe('WidgetSkeletons', () => {
  it('KpiCardSkeleton expone role status', () => {
    render(<KpiCardSkeleton />);
    expect(screen.getByRole('status', { name: 'Cargando indicador' })).toBeInTheDocument();
  });
  it('ChartSkeleton bar renderiza barras con la altura pedida', () => {
    const { container } = render(<ChartSkeleton kind="bar" height={200} />);
    const root = screen.getByRole('status', { name: 'Cargando gráfico' });
    expect(root.style.height).toBe('200px');
    expect(container.querySelectorAll('.rounded-t').length).toBeGreaterThan(4);
  });
  it('ChartSkeleton donut tiene agujero, pie no', () => {
    const { container: donut } = render(<ChartSkeleton kind="donut" />);
    expect(donut.querySelector('.rounded-full.bg-surface')).toBeTruthy();
    const { container: pie } = render(<ChartSkeleton kind="pie" />);
    expect(pie.querySelector('.rounded-full.bg-surface')).toBeFalsy();
  });
  it('TableSkeleton renderiza las filas pedidas', () => {
    render(<TableSkeleton rows={3} />);
    const root = screen.getByRole('status', { name: 'Cargando tabla' });
    expect(root.querySelectorAll(':scope > div').length).toBe(4); // header + 3 filas
  });
});
