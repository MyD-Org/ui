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
});
