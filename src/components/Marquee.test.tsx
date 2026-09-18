import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Marquee } from './Marquee';

describe('Marquee', () => {
  it('renderiza los items duplicados para el loop infinito', () => {
    render(<Marquee items={['Más de 5.000 productos', 'Despacho en 24 h']} />);
    expect(screen.getAllByText('Más de 5.000 productos').length).toBe(2);
    expect(screen.getAllByText('Despacho en 24 h').length).toBe(2);
  });

  it('usa la animación marquee y bordes de línea', () => {
    const { container } = render(<Marquee items={['x']} />);
    expect(container.querySelector('.animate-marquee')).not.toBeNull();
    expect((container.firstChild as HTMLElement)?.className).toContain('border-y');
  });
});
