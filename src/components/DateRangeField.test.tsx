import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangeField } from './DateRangeField';

describe('DateRangeField', () => {
  it('sin valor muestra el placeholder', () => {
    render(<DateRangeField label="Período" />);
    expect(screen.getByRole('button', { name: 'Período' })).toHaveTextContent('Elegir período');
  });

  it('con rango muestra las fechas formateadas es-AR', () => {
    render(<DateRangeField label="Período" value={{ start: '2026-01-05', end: '2026-07-11' }} />);
    const trigger = screen.getByRole('button', { name: 'Período' });
    expect(trigger.textContent).toContain('2026');
    expect(trigger.textContent).toContain('–');
  });

  it('un preset emite {start,end} ISO y cierra', () => {
    const onChange = vi.fn();
    render(<DateRangeField label="Período" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Período' }));
    fireEvent.click(screen.getByRole('button', { name: 'Últimos 30 días' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const value = onChange.mock.calls[0][0];
    expect(value.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(value.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('Limpiar emite rango vacío', () => {
    const onChange = vi.fn();
    render(<DateRangeField label="Período" value={{ start: '2026-01-01', end: '2026-02-01' }} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Período' }));
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(onChange).toHaveBeenCalledWith({ start: '', end: '' });
  });
});
