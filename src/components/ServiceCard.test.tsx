import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServiceCard } from './ServiceCard';

describe('ServiceCard', () => {
  it('renderiza título y texto', () => {
    render(<ServiceCard icon={<svg data-testid="ic" />} title="Envío gratis" text="En compras desde $100.000." />);
    expect(screen.getByText('Envío gratis')).toBeInTheDocument();
    expect(screen.getByText('En compras desde $100.000.')).toBeInTheDocument();
    expect(screen.getByTestId('ic')).toBeInTheDocument();
  });

  it('la card usa superficie y bordes redondeados editoriales', () => {
    render(<ServiceCard icon={null} title="Stock real" text="Sincronizado." />);
    const card = screen.getByText('Stock real').closest('div');
    expect(card?.className).toContain('rounded-[20px]');
    expect(card?.className).toContain('bg-surface');
  });

  it('sin título ni texto no deja elementos vacíos', () => {
    const { container } = render(<ServiceCard icon={null} />);
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('span')).toBeNull();
  });
});
