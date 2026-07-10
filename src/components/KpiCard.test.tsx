import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('muestra label y valor numérico formateado es-AR', () => {
    render(<KpiCard label="Ventas del mes" value={125430.5} prefix="$" />);
    expect(screen.getByText('Ventas del mes')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('125.430,5')).toBeInTheDocument();
  });
  it('valor string pasa tal cual + unit y hint', () => {
    render(<KpiCard label="Stock crítico" value="12" unit="ítems" hint="últimos 30 días" />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('ítems')).toBeInTheDocument();
    expect(screen.getByText('últimos 30 días')).toBeInTheDocument();
  });
  it('sin value muestra —', () => {
    render(<KpiCard label="Total" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
