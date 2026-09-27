import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityStepper } from './QuantityStepper';

describe('QuantityStepper', () => {
  it('renders the current value', () => {
    render(<QuantityStepper value={3} onValueChange={() => {}} />);
    expect(screen.getByDisplayValue('3')).toBeDefined();
  });

  it('increments on + click', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={1} onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Aumentar cantidad'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements on − click', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={5} onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Disminuir cantidad'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables decrement at min', () => {
    render(<QuantityStepper value={1} min={1} onValueChange={() => {}} />);
    expect(screen.getByLabelText('Disminuir cantidad')).toBeDisabled();
  });

  it('disables increment at max', () => {
    render(<QuantityStepper value={10} max={10} onValueChange={() => {}} />);
    expect(screen.getByLabelText('Aumentar cantidad')).toBeDisabled();
  });
});

describe('bordes de los botones', () => {
  it('los botones extremos siguen la curva del contorno (el fondo del hover no se sale)', () => {
    render(<QuantityStepper value={1} onValueChange={() => {}} />);
    const [menos, mas] = screen.getAllByRole('button');
    expect(menos.className).toContain('rounded-l-sm');
    expect(mas.className).toContain('rounded-r-sm');
  });
});

describe('size, tone, fullWidth y removeLabel (0.37.0)', () => {
  it('sin props nuevas se ve igual que antes: sm (h-9) con borde', () => {
    const { container } = render(<QuantityStepper value={2} onValueChange={() => {}} />);
    expect(container.firstElementChild!.className).toContain('border-border-strong');
    for (const b of screen.getAllByRole('button')) expect(b.className).toContain('h-9');
  });

  it('size md y lg: el mismo alto que Button (h-10 / h-12)', () => {
    const { rerender } = render(<QuantityStepper value={2} size="md" onValueChange={() => {}} />);
    for (const b of screen.getAllByRole('button')) expect(b.className).toContain('h-10');
    rerender(<QuantityStepper value={2} size="lg" onValueChange={() => {}} />);
    for (const b of screen.getAllByRole('button')) expect(b.className).toContain('h-12');
    expect(screen.getByDisplayValue('2').className).toContain('h-12');
  });

  it('tone soft: fondo accent-soft, sin bordes internos', () => {
    const { container } = render(<QuantityStepper value={2} tone="soft" onValueChange={() => {}} />);
    const raiz = container.firstElementChild!;
    expect(raiz.className).toContain('bg-accent-soft');
    expect(raiz.className).not.toContain('border');
    expect(screen.getByDisplayValue('2').className).not.toContain('border-x');
  });

  it('fullWidth: ocupa todo el ancho y el número toma el espacio del medio', () => {
    const { container } = render(<QuantityStepper value={2} fullWidth onValueChange={() => {}} />);
    expect(container.firstElementChild!.className).toContain('w-full');
    expect(screen.getByDisplayValue('2').className).toContain('flex-1');
  });

  it('removeLabel: si el próximo toque llega al mínimo, el − pasa a ser "quitar" (tacho)', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={1} min={0} removeLabel="Quitar del carrito" onValueChange={onChange} />);
    const quitar = screen.getByRole('button', { name: 'Quitar del carrito' });
    expect(quitar).toBeEnabled();
    expect(quitar.querySelector('svg')).not.toBeNull();
    await userEvent.click(quitar);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('removeLabel: con más unidades el botón sigue siendo "−"', () => {
    render(<QuantityStepper value={3} min={0} removeLabel="Quitar del carrito" onValueChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Quitar del carrito' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Disminuir cantidad' })).toBeEnabled();
  });
});
