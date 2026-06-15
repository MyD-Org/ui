import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renderiza title (status role)', () => {
    render(<EmptyState title="No hay datos" />);
    expect(screen.getByRole('status')).toHaveTextContent('No hay datos');
  });

  it('renderiza description y action cuando se pasan', () => {
    render(
      <EmptyState
        title="Vacío"
        description="No se encontraron resultados"
        action={<button>Volver</button>}
      />,
    );
    expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });
});
