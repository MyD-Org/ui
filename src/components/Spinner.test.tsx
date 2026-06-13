import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('expone role status con label accesible', () => {
    render(<Spinner label="Cargando agentes" />);
    expect(screen.getByRole('status', { name: 'Cargando agentes' })).toBeInTheDocument();
  });
  it('aplica la clase de tamaño lg', () => {
    render(<Spinner size="lg" label="x" />);
    expect(screen.getByRole('status').className).toContain('h-8');
  });
});
