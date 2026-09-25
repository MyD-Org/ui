import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('mobile: columnas de a dos y la marca en la fila entera', () => {
    const { container } = render(<SiteFooter brandName="Central" description="Casa de iluminación" columns={columns} />);
    const grilla = container.querySelector('footer > div');
    expect(grilla?.className).toContain('grid-cols-2');
    expect(grilla?.firstElementChild?.className).toContain('col-span-2');
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

  it('compatibilidad: sin barExtra la barra conserva el mismo markup', () => {
    const { container } = render(
      <SiteFooter brandName="B" description="d" columns={[]} barLeft="© 2026 Comercio" barRight="Hecho en Misiones" />,
    );
    expect(container.querySelector('footer > div.border-t')?.innerHTML).toBe(
      '<div class="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-4 px-[clamp(18px,4vw,48px)] py-5 text-xs font-semibold text-on-primary/45"><span>© 2026 Comercio</span><span>Hecho en Misiones</span></div>',
    );
  });
});
