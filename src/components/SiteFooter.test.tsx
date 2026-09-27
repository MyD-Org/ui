import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';
import type { RenderLink } from '../lib/renderLink';

const enlace: RenderLink = ({ children, ...p }) => <a {...p} data-framework>{children}</a>;

const columns = [
  { title: 'Rubros', links: [{ label: 'Iluminación LED', href: '/c1' }, { label: 'Tableros', href: '/c2' }] },
  { title: 'Mi cuenta', links: [{ label: 'Mis pedidos', href: '/m1' }] },
];

describe('SiteFooter', () => {
  it('renderiza marca, descripción y columnas con links', () => {
    render(
      <SiteFooter
        brandName="Central"
        brandAccent="Led"
        description="Materiales eléctricos en Puerto Iguazú."
        columns={columns}
        barLeft="© 2026 Central Led"
        barRight="Hecho con luz en Misiones"
      />,
    );
    expect(screen.getByText('Materiales eléctricos en Puerto Iguazú.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Iluminación LED' })).toHaveAttribute('href', '/c1');
    expect(screen.getByRole('heading', { name: 'Mi cuenta' })).toBeInTheDocument();
    expect(screen.getByText('Hecho con luz en Misiones')).toBeInTheDocument();
  });

  it('usa fondo primario (tinta) y esquinas superiores redondeadas', () => {
    const { container } = render(
      <SiteFooter brandName="Central" description="d" columns={[]} barLeft="l" />,
    );
    const footer = container.querySelector('footer');
    expect(footer?.className).toContain('bg-primary');
    expect(footer?.className).toContain('rounded-t-[32px]');
  });

  it('mobile: cada columna es un desplegable cerrado que se abre con su título', () => {
    render(<SiteFooter brandName="Central" description="Casa de iluminación" columns={columns} />);
    const boton = screen.getByRole('button', { name: 'Mi cuenta' });
    expect(boton).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(boton.getAttribute('aria-controls')!);
    expect(panel?.className).toContain('max-lg:hidden');
    fireEvent.click(boton);
    expect(boton).toHaveAttribute('aria-expanded', 'true');
    expect(panel?.className).not.toContain('max-lg:hidden');
  });

  it('mobile: sin descripción ni barRight; desktop los muestra', () => {
    render(<SiteFooter brandName="Central" description="Casa de iluminación" columns={[]} barLeft="© 2026" barRight="Horario" />);
    expect(screen.getByText('Casa de iluminación').className).toContain('max-lg:hidden');
    expect(screen.getByText('Horario').className).toContain('max-lg:hidden');
    expect(screen.getByText('© 2026').className).not.toContain('max-lg:hidden');
  });

  it('desktop: una columna con más de 4 links se reparte en dos', () => {
    const larga = { title: 'Legales', links: ['a', 'b', 'c', 'd', 'e'].map((l) => ({ label: l, href: `/${l}` })) };
    render(<SiteFooter brandName="Central" description="d" columns={[larga, columns[1]]} />);
    const panel = (t: string) => document.getElementById(screen.getByRole('button', { name: t }).getAttribute('aria-controls')!);
    expect(panel('Legales')?.className).toContain('lg:grid-cols-2');
    expect(panel('Mi cuenta')?.className).not.toContain('lg:grid-cols-2');
  });

  it('renderLink reemplaza los <a> de las columnas', () => {
    render(<SiteFooter brandName="Central" description="d" columns={columns} renderLink={enlace} />);
    expect(screen.getByRole('link', { name: 'Tableros' })).toHaveAttribute('data-framework');
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('link external: pestaña nueva con rel seguro y sin pasar por renderLink', () => {
    const spy = vi.fn(enlace);
    const cols = [
      {
        title: 'Legales',
        links: [
          { label: 'Términos y condiciones', href: '/terminos' },
          { label: 'Defensa del Consumidor', href: 'https://defensa.example/formulario', external: true },
        ],
      },
    ];
    render(<SiteFooter brandName="Central" description="d" columns={cols} renderLink={spy} />);
    const externo = screen.getByRole('link', { name: 'Defensa del Consumidor' });
    expect(externo).toHaveAttribute('href', 'https://defensa.example/formulario');
    expect(externo).toHaveAttribute('target', '_blank');
    expect(externo).toHaveAttribute('rel', 'noopener noreferrer');
    expect(externo).not.toHaveAttribute('data-framework');
    expect(spy.mock.calls.map(([p]) => p.href)).not.toContain('https://defensa.example/formulario');
  });

  it('link interno sin external sigue pasando por renderLink y sin target', () => {
    const spy = vi.fn(enlace);
    render(<SiteFooter brandName="Central" description="d" columns={columns} renderLink={spy} />);
    expect(spy.mock.calls.map(([p]) => p.href)).toContain('/c1');
    const interno = screen.getByRole('link', { name: 'Iluminación LED' });
    expect(interno).toHaveAttribute('data-framework');
    expect(interno).not.toHaveAttribute('target');
  });

  it('barExtra: contenido extra (imagen enlazada) dentro de la barra inferior', () => {
    const { container } = render(
      <SiteFooter
        brandName="Central"
        description="d"
        columns={[]}
        barLeft="© 2026 Comercio"
        barExtra={
          <a href="https://qr.afip.gob.ar/?qr=EJEMPLO">
            <img alt="Data Fiscal" src="/x.jpg" />
          </a>
        }
      />,
    );
    const barra = container.querySelector('footer > div.border-t');
    expect(barra).not.toBeNull();
    const img = screen.getByAltText('Data Fiscal');
    expect(barra).toContainElement(img);
    expect(barra).toContainElement(screen.getByRole('link', { name: 'Data Fiscal' }));
  });

  it('barExtra solo, sin barLeft ni barRight, igual muestra la barra', () => {
    const { container } = render(
      <SiteFooter brandName="Central" description="d" columns={[]} barExtra={<span>extra</span>} />,
    );
    expect(container.querySelector('footer > div.border-t')).toContainElement(screen.getByText('extra'));
  });
});
