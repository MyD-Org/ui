import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromoTag } from './PromoTag';

describe('PromoTag', () => {
  it('lee "Hasta", el número y el título en orden', () => {
    const { container } = render(<PromoTag eyebrow="Hasta" value="6" title="cuotas sin interés" text="Con tarjeta de crédito." />);
    expect(container.querySelector('p')?.textContent).toBe('Hasta 6cuotas sin interés');
    expect(screen.getByText('Con tarjeta de crédito.')).toBeInTheDocument();
  });

  it('el valor decorativo no se lee', () => {
    render(<PromoTag value="%" decorativeValue title="Grandes descuentos" />);
    expect(screen.getByText('%')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sin texto ni valor no deja elementos vacíos', () => {
    const { container } = render(<PromoTag title="Envío gratis" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
    expect(container.querySelector('.text-accent')).toBeNull();
  });

  it('usa el fondo suave del acento y acepta className', () => {
    const { container } = render(<PromoTag title="x" className="extra" />);
    expect(container.firstElementChild?.className).toContain('bg-accent-soft');
    expect(container.firstElementChild?.className).toContain('extra');
  });
});
