import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentLogos } from './PaymentLogos';

const logos = [
  { name: 'Visa', src: 'https://cdn.example/visa.png' },
  { name: 'Mastercard Débito', src: 'https://cdn.example/master-debito.png' },
];

describe('PaymentLogos', () => {
  it('compacto: sólo logos, con el nombre como texto alternativo', () => {
    render(<PaymentLogos logos={logos} />);
    expect(screen.getByRole('img', { name: 'Visa' })).toBeInTheDocument();
    expect(screen.queryByText('Visa')).not.toBeInTheDocument();
  });
  it('con nombres: logo decorativo + nombre visible', () => {
    render(<PaymentLogos logos={logos} variant="labeled" />);
    expect(screen.getByText('Mastercard Débito')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Visa' })).not.toBeInTheDocument();
  });
  it('sin logos no renderiza nada', () => {
    const { container } = render(<PaymentLogos logos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
