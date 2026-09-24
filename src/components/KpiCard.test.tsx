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
  it('children se muestran debajo del valor (listas, barras)', () => {
    render(
      <KpiCard label="Deuda total" value="$ 150.000,00" hint="Límite $ 500.000,00">
        <ul>
          <li>Factura 0001-00000123</li>
        </ul>
      </KpiCard>,
    );
    const hint = screen.getByText('Límite $ 500.000,00');
    const item = screen.getByText('Factura 0001-00000123');
    expect(hint.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it('sin children no agrega el contenedor extra', () => {
    const { container } = render(<KpiCard label="Total" value={1} />);
    expect(container.firstElementChild!.children).toHaveLength(2);
  });
});

