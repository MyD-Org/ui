import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renderiza children sobre una superficie', () => {
    render(<Card>contenido</Card>);
    const el = screen.getByText('contenido');
    expect(el.className).toContain('bg-surface');
  });
  it('renderiza el slot action junto al título en el mismo header', () => {
    render(<Card title="Filtros" action={<button>Limpiar</button>} />);
    const title = screen.getByRole('heading', { name: 'Filtros' });
    const action = screen.getByRole('button', { name: 'Limpiar' });
    const header = title.parentElement?.parentElement as HTMLElement;
    expect(header.contains(action)).toBe(true);
    expect(header.className).toContain('mb-4');
    expect(header.className).toContain('justify-between');
  });
  it('sin action el header no cambia', () => {
    render(<Card title="Filtros" description="Bajada" />);
    const title = screen.getByRole('heading', { name: 'Filtros' });
    expect(title.parentElement?.className).toContain('mb-4');
    expect(screen.getByText('Bajada')).toBeInTheDocument();
  });
});
