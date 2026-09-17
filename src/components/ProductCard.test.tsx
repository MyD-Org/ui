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

  it('renders priceNote and installments inside the card', () => {
    const { container } = render(
      <ProductCard
        name="Test"
        price={100}
        priceNote={<span data-testid="nota">PRECIO SIN IMPUESTOS NACIONALES $82,64</span>}
        installments={<span data-testid="cuotas">Hasta 3 cuotas de $33,33</span>}
      />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.contains(screen.getByTestId('nota'))).toBe(true);
    expect(card.contains(screen.getByTestId('cuotas'))).toBe(true);
  });

  it('omits the priceNote / installments wrappers when not provided', () => {
    const { container } = render(<ProductCard name="Test" price={100} />);
    expect(container.querySelector('.text-\\[11px\\]')).toBeNull();
  });

  it('formats prices with cents and keeps round prices clean', () => {
    render(<ProductCard name="Test" price={713028.8} oldPrice={14990} />);
    expect(screen.getByText((c) => c.includes('713.028,80'))).toBeDefined();
    expect(screen.getByText((c) => c.includes('14.990') && !c.includes('14.990,00'))).toBeDefined();
  });
});
