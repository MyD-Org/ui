import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders name and brand', () => {
    render(<ProductCard name="Panel LED 48W" brand="Macroled" price={14990} />);
    expect(screen.getByText('Panel LED 48W')).toBeDefined();
    expect(screen.getByText('Macroled')).toBeDefined();
  });

  it('shows stock indicator', () => {
    render(<ProductCard name="Test" price={100} stock="low" />);
    expect(screen.getByText('Últimas unidades')).toBeDefined();
  });

  it('shows old price and discount', () => {
    render(<ProductCard name="Test" price={14990} oldPrice={17900} discount="-16%" />);
    const old = screen.getByText((c) => c.includes('17.900'));
    expect(old.className).toContain('line-through');
    expect(screen.getByText('-16%')).toBeDefined();
  });

  it('renders badge slot', () => {
    render(<ProductCard name="Test" price={100} badge={<span data-testid="badge">OFERTA</span>} />);
    expect(screen.getByTestId('badge')).toBeDefined();
  });

  it('renders action slot', () => {
    render(<ProductCard name="Test" price={100} action={<button>Agregar</button>} />);
    expect(screen.getByText('Agregar')).toBeDefined();
  });
});
