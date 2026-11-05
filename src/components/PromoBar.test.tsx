import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromoBar } from './PromoBar';

describe('PromoBar', () => {
  it('renderiza un ítem por aviso con título y texto', () => {
    render(
      <PromoBar
        items={[
          { eyebrow: 'Hasta', value: '8', title: 'cuotas sin interés', text: 'Con tarjeta de crédito.' },
          { value: '%', decorativeValue: true, title: 'Grandes descuentos', text: 'Pagando con transferencia.' },
        ]}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('cuotas sin interés')).toBeInTheDocument();
    expect(screen.getByText('Pagando con transferencia.')).toBeInTheDocument();
  });

  it('oculta el símbolo decorativo a lectores de pantalla', () => {
    render(<PromoBar items={[{ value: '%', decorativeValue: true, title: 'Grandes descuentos' }]} />);
    expect(screen.getByText('%')).toHaveAttribute('aria-hidden', 'true');
  });

  it('sin avisos no dibuja nada', () => {
    const { container } = render(<PromoBar items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
