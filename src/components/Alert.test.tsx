import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renderiza título y contenido con role alert', () => {
    render(<Alert tone="danger" title="Error">Algo falló</Alert>);
    const el = screen.getByRole('alert');
    expect(el).toHaveTextContent('Error');
    expect(el).toHaveTextContent('Algo falló');
    expect(el.className).toContain('bg-danger-soft');
  });
  it('usa role status (polite) para tonos no críticos', () => {
    render(<Alert tone="success" title="Listo">Guardado</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Guardado');
  });
});
