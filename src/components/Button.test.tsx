import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });
  it('aplica la clase de la variante danger', () => {
    render(<Button variant="danger">Borrar</Button>);
    expect(screen.getByRole('button').className).toContain('bg-danger');
  });
  it('dispara onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ir</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('queda disabled cuando loading', () => {
    render(<Button loading>Ir</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('no dispara onClick cuando está disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Ir</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
  it('queda disabled por loading aunque disabled sea false', () => {
    render(<Button disabled={false} loading>Ir</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('tiene feedback de press en active', () => {
    render(<Button>Ir</Button>);
    expect(screen.getByRole('button').className).toContain('active:scale-');
  });
  it('variant link es texto primario sin fondo con subrayado en hover', () => {
    render(<Button variant="link">Limpiar</Button>);
    const c = screen.getByRole('button').className;
    expect(c).toContain('bg-transparent');
    expect(c).toContain('text-primary');
    expect(c).toContain('hover:underline');
  });
  it('size inline no reserva alto ni padding', () => {
    render(<Button variant="link" size="inline">Ver todas</Button>);
    const c = screen.getByRole('button').className;
    expect(c).toContain('h-auto');
    expect(c).toContain('p-0');
  });
  it('size icon-lg mide 40px', () => {
    render(<Button size="icon-lg" aria-label="Agregar">+</Button>);
    expect(screen.getByRole('button').className).toContain('h-10 w-10');
  });
  it('shape round es rounded-full y pisa rounded-sm', () => {
    render(<Button shape="round" size="icon" aria-label="Agregar al carrito">+</Button>);
    const c = screen.getByRole('button').className;
    expect(c).toContain('rounded-full');
    expect(c).not.toContain('rounded-sm');
    expect(c).toContain('bg-primary');
    expect(c).toContain('text-on-primary');
  });
  it('por defecto sigue siendo rounded-sm', () => {
    render(<Button>Ir</Button>);
    expect(screen.getByRole('button').className).toContain('rounded-sm');
  });
  it('variant outline tiene borde y fondo surface, sin bg-primary', () => {
    render(<Button variant="outline">Volver a comprar</Button>);
    const c = screen.getByRole('button').className;
    expect(c).toContain('border-border');
    expect(c).toContain('bg-surface');
    expect(c).toContain('text-text');
    expect(c).toContain('hover:bg-elevated');
    expect(c).not.toContain('bg-primary');
  });
  it('variant outline convive con size sm, loading y shape round', () => {
    render(
      <Button variant="outline" size="sm" shape="round" loading>
        Volver a comprar
      </Button>,
    );
    const b = screen.getByRole('button');
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b.className).toContain('h-8');
    expect(b.className).toContain('rounded-full');
    expect(b.className).not.toContain('rounded-sm');
  });
});

describe('Button con href', () => {
  it('con href es un enlace con las clases de la variante y no hay button', () => {
    render(
      <Button href="/mi-cuenta/pedidos/1" variant="outline" size="sm">
        Ver detalle
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Ver detalle' });
    expect(link).toHaveAttribute('href', '/mi-cuenta/pedidos/1');
    expect(link.className).toContain('border-border');
    expect(link.className).toContain('h-8');
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('className del consumidor va último', () => {
    render(<Button href="/x" className="w-full">Ir</Button>);
    expect(screen.getByRole('link').className).toContain('w-full');
  });
  it('renderLink recibe href, className y aria-label', () => {
    const renderLink = vi.fn(({ href, className, children, ...rest }) => (
      <a href={href} className={className} aria-label={rest['aria-label']} data-next>
        {children}
      </a>
    ));
    render(
      <Button href="/catalogo" aria-label="Ir al catálogo" renderLink={renderLink}>
        Catálogo
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Ir al catálogo' });
    expect(link).toHaveAttribute('data-next');
    expect(renderLink).toHaveBeenCalledWith(
      expect.objectContaining({ href: '/catalogo', 'aria-label': 'Ir al catálogo', className: expect.stringContaining('bg-primary') }),
    );
  });
  it('disabled y loading no se pasan al enlace', () => {
    render(
      <Button href="/x" disabled loading>
        Ir
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('disabled');
    expect(link).not.toHaveAttribute('aria-busy');
  });
  it('sin href sigue siendo un button', () => {
    render(<Button>Ir</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
