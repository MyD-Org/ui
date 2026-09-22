import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

const icono = <svg data-testid="icono" />;

describe('StatCard', () => {
  it('formatea números con Intl es-AR y muestra la etiqueta', () => {
    render(<StatCard icon={icono} value={1234} label="Pedidos del año" />);
    expect(screen.getByText('1.234')).toBeInTheDocument();
    expect(screen.getByText('Pedidos del año')).toBeInTheDocument();
  });

  it('respeta locale custom', () => {
    render(<StatCard icon={icono} value={1234} label="Orders" locale="en-US" />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('value string se muestra tal cual', () => {
    render(<StatCard icon={icono} value="12+" label="Favoritos guardados" />);
    expect(screen.getByText('12+')).toBeInTheDocument();
  });

  it('sin value y sin loading muestra "—"', () => {
    render(<StatCard icon={icono} label="Pedidos en curso" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('loading: sin valor numérico, con esqueleto y aria-busy', () => {
    const { container } = render(<StatCard icon={icono} loading value={3} label="Productos en el carrito" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('3')).toBeNull();
    expect(root.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('el ícono va en un tile bg-primary-soft text-primary oculto para lectores', () => {
    render(<StatCard icon={icono} value={1} label="Pedido en curso" />);
    const tile = screen.getByTestId('icono').parentElement as HTMLElement;
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(tile.className).toContain('bg-primary-soft');
    expect(tile.className).toContain('text-primary');
  });

  it('con href toda la tarjeta es un enlace con nombre "{valor} {label}"', () => {
    render(<StatCard icon={icono} href="/mi-cuenta/pedidos" value={1} label="Pedido en curso" />);
    const link = screen.getByRole('link', { name: '1 Pedido en curso' });
    expect(link).toHaveAttribute('href', '/mi-cuenta/pedidos');
    expect(link.className).toContain('rounded-lg');
  });

  it('sin href no hay enlace', () => {
    render(<StatCard icon={icono} value={1} label="Pedido en curso" />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renderLink recibe href y className', () => {
    const renderLink = vi.fn(({ href, className, children }) => (
      <a href={href} className={className} data-next>
        {children}
      </a>
    ));
    render(<StatCard icon={icono} href="/carrito" value={2} label="Productos en el carrito" renderLink={renderLink} />);
    expect(screen.getByRole('link')).toHaveAttribute('data-next');
    expect(renderLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: '/carrito', className: expect.stringContaining('bg-surface') }),
    );
  });

  it('className del consumidor se aplica al contenedor', () => {
    const { container } = render(<StatCard icon={icono} value={1} label="X" className="md:col-span-2" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('md:col-span-2');
  });
});
