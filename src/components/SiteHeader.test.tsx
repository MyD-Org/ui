import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteHeader } from './SiteHeader';
import type { RenderLink } from '../lib/renderLink';

const enlace: RenderLink = ({ children, ...p }) => <a {...p} data-framework>{children}</a>;

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

  it('brandPlacement="start" pone la marca a la izquierda y la búsqueda al centro', () => {
    const { container } = render(
      <SiteHeader
        brandName="Central"
        brandSub="s"
        brandPlacement="start"
        search={<input aria-label="buscar" />}
      />,
    );
    const fila = container.querySelector('header > div') as HTMLElement;
    expect(fila.className).toContain('grid-cols-[auto_1fr_auto]');
    const marca = screen.getByRole('link', { name: /central/i });
    expect(marca.className).toContain('lg:order-1');
    expect(marca.className).toContain('text-left');
  });

  it('sin compactOnScroll no monta la barra compacta', () => {
    const { container } = render(<SiteHeader brandName="Central" brandSub="s" />);
    expect(container.querySelector('.fixed')).toBeNull();
  });

  it('compactOnScroll: el header deja de ser sticky y la barra arranca oculta e inerte', () => {
    const { container } = render(
      <SiteHeader brandName="Central" brandSub="s" compactOnScroll actions={<a href="/c">Carrito</a>} />,
    );
    // Si el header siguiera pegado habría dos headers arriba a la vez.
    expect(container.querySelector('header')?.className).not.toContain('sticky');

    const barra = container.querySelector('.fixed') as HTMLElement;
    expect(barra).not.toBeNull();
    expect(barra.className).toContain('-translate-y-full');
    expect(barra).toHaveAttribute('aria-hidden', 'true');
    expect(barra).toHaveAttribute('inert');
  });

  it('compactOnScroll: la barra usa los slots propios cuando se los pasan', () => {
    render(
      <SiteHeader
        brandName="Central"
        brandSub="s"
        compactOnScroll
        search={<input aria-label="buscar" />}
        compactSearch={<input aria-label="buscar compacto" />}
        actions={<a href="/c">Carrito</a>}
        compactActions={<a href="/c">Carrito compacto</a>}
      />,
    );
    expect(screen.getByLabelText('buscar compacto')).toBeInTheDocument();
    // Por rol no aparece: plegada, la barra está aria-hidden y queda fuera del
    // árbol de accesibilidad (que es justamente lo que se busca).
    expect(screen.getByText('Carrito compacto')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Carrito compacto' })).toBeNull();
  });

  it('renderLink reemplaza los <a> de la marca y del nav, también en la barra compacta', () => {
    render(
      <SiteHeader
        brandName="Central"
        brandSub="s"
        compactOnScroll
        nav={[{ label: 'Iluminación', href: '/ilum', badge: 'Nuevo' }]}
        renderLink={enlace}
      />,
    );
    const links = document.querySelectorAll('a');
    // Marca + nav, en el header y en la barra compacta.
    expect(links).toHaveLength(4);
    links.forEach((a) => expect(a).toHaveAttribute('data-framework'));
    expect(document.querySelector('a[href="/ilum"]')?.textContent).toContain('Nuevo');
  });
});
