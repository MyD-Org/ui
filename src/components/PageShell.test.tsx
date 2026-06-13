import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('renderiza el título y el contenido', () => {
    render(<PageShell title="Agentes">contenido</PageShell>);
    expect(screen.getByRole('heading', { name: 'Agentes' })).toBeInTheDocument();
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
  it('renderiza las actions', () => {
    render(<PageShell title="Agentes" actions={<button>Nuevo</button>}>x</PageShell>);
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument();
  });
});
