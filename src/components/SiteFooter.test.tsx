import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteFooter } from './SiteFooter';

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
});
