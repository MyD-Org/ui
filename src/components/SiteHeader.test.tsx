import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('renderiza marca con acento itálico y descriptor', () => {
    render(<SiteHeader brandName="Central" brandAccent="Led" brandSub="Iluminación · Electricidad" />);
    const marca = screen.getByRole('link', { name: /central/i });
    expect(marca.querySelector('em')?.textContent).toBe('Led');
    expect(screen.getByText('Iluminación · Electricidad')).toBeInTheDocument();
  });

  it('renderiza nav con badge cuando el item la tiene', () => {
    render(
      <SiteHeader
        brandName="Central"
        brandSub="s"
        nav={[{ label: 'Iluminación', href: '/ilum' }, { label: 'Decorativa', href: '/deco', badge: 'Nuevo' }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Iluminación' })).toHaveAttribute('href', '/ilum');
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('las slots search y actions se renderizan en su zona', () => {
    render(
      <SiteHeader
        brandName="Central"
        brandSub="s"
        search={<input aria-label="buscar" />}
        actions={<a href="/carrito">Carrito</a>}
        nav={[{ label: 'Ofertas', href: '/ofertas' }]}
      />,
    );
    expect(screen.getByLabelText('buscar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ofertas' })).toBeInTheDocument();
  });

  it('es sticky y usa fondo translúcido', () => {
    const { container } = render(<SiteHeader brandName="Central" brandSub="s" />);
    expect(container.querySelector('header')?.className).toContain('sticky');
  });
});
