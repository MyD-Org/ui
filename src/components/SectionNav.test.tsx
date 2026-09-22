import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionNav, type SectionNavItem } from './SectionNav';

const onSeguridad = vi.fn();
const onSalir = vi.fn();

const items: SectionNavItem[] = [
  { id: 'pedidos', label: 'Pedidos', href: '/mi-cuenta/pedidos', icon: <svg data-testid="icono-pedidos" /> },
  { id: 'facturas', label: 'Facturas', href: '/mi-cuenta/facturas' },
  { id: 'favoritos', label: 'Favoritos', href: '/mi-cuenta/favoritos', active: true },
  { id: 'direcciones', label: 'Direcciones', href: '/mi-cuenta/direcciones' },
  { id: 'envios', label: 'Envíos y retiro', href: '/mi-cuenta/envios' },
  { id: 'datos', label: 'Mis datos', href: '/mi-cuenta/datos' },
  { id: 'seguridad', label: 'Seguridad', onSelect: onSeguridad },
  { id: 'salir', label: 'Cerrar sesión', onSelect: onSalir, tone: 'danger' },
];

describe('SectionNav', () => {
  it('es una navegación con el nombre por defecto "Secciones de su cuenta"', () => {
    render(<SectionNav items={items} />);
    expect(screen.getByRole('navigation', { name: 'Secciones de su cuenta' })).toBeInTheDocument();
  });

  it('ariaLabel sobreescribe el nombre', () => {
    render(<SectionNav items={items} ariaLabel="Secciones" />);
    expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeInTheDocument();
  });

  it('sólo el ítem activo tiene aria-current="page" y el estilo activo', () => {
    const { container } = render(<SectionNav items={items} />);
    const actuales = container.querySelectorAll('[aria-current]');
    expect(actuales).toHaveLength(1);
    const activo = screen.getByRole('link', { name: 'Favoritos' });
    expect(activo).toHaveAttribute('aria-current', 'page');
    expect(activo.className).toContain('bg-primary-soft');
    expect(activo.className).toContain('text-primary');
    expect(screen.getByRole('link', { name: 'Pedidos' }).className).not.toContain('bg-primary-soft');
  });

  it('ítems con href son enlaces; con onSelect y sin href son button type="button"', async () => {
    render(<SectionNav items={items} />);
    expect(screen.getAllByRole('link')).toHaveLength(6);
    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveAttribute('href', '/mi-cuenta/pedidos');
    const seguridad = screen.getByRole('button', { name: 'Seguridad' });
    expect(seguridad).toHaveAttribute('type', 'button');
    await userEvent.click(seguridad);
    expect(onSeguridad).toHaveBeenCalledOnce();
  });

  it('con href y onSelect gana href', () => {
    const onSelect = vi.fn();
    render(<SectionNav items={[{ id: 'x', label: 'Pedidos', href: '/p', onSelect }]} />);
    expect(screen.getByRole('link', { name: 'Pedidos' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('antes del primer ítem danger hay un separador y el danger usa text-danger', async () => {
    render(<SectionNav items={items} />);
    const lis = screen.getByRole('list').children;
    const sep = screen.getByRole('separator');
    const idx = Array.from(lis).indexOf(sep);
    expect(within(lis[idx + 1] as HTMLElement).getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument();
    const salir = screen.getByRole('button', { name: 'Cerrar sesión' });
    expect(salir.className).toContain('text-danger');
    await userEvent.click(salir);
    expect(onSalir).toHaveBeenCalledOnce();
  });

  it('sin ítems danger no hay separador', () => {
    render(<SectionNav items={items.slice(0, 6)} />);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('un solo separador aunque haya varios danger', () => {
    render(
      <SectionNav
        items={[
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', onSelect: () => {}, tone: 'danger' },
          { id: 'c', label: 'C', onSelect: () => {}, tone: 'danger' },
        ]}
      />,
    );
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('renderLink recibe href, className y aria-current', () => {
    const renderLink = vi.fn(({ href, className, children, ...rest }) => (
      <a href={href} className={className} aria-current={rest['aria-current']} data-next>
        {children}
      </a>
    ));
    render(<SectionNav items={items} renderLink={renderLink} />);
    expect(screen.getByRole('link', { name: 'Favoritos' })).toHaveAttribute('data-next');
    expect(renderLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: '/mi-cuenta/favoritos', 'aria-current': 'page', className: expect.stringContaining('text-primary') }),
    );
    expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ href: '/mi-cuenta/pedidos', 'aria-current': undefined }));
  });

  it('disabled no dispara onSelect', async () => {
    const onSelect = vi.fn();
    render(<SectionNav items={[{ id: 'x', label: 'Seguridad', onSelect, disabled: true }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Seguridad' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('los íconos son decorativos y el label queda visible', () => {
    render(<SectionNav items={items} />);
    const icono = screen.getByTestId('icono-pedidos');
    expect(icono.parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Pedidos' })).toHaveTextContent('Pedidos');
  });

  it('la lista es horizontal desplazable en móvil y vertical desde md', () => {
    render(<SectionNav items={items} />);
    const c = screen.getByRole('list').className;
    expect(c).toContain('overflow-x-auto');
    expect(c).toContain('md:flex-col');
  });
});
