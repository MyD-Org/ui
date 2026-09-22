import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Iluminación' },
];

describe('Breadcrumb', () => {
  it('es una navegación con el nombre por defecto "Ubicación"', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByRole('navigation', { name: 'Ubicación' })).toBeInTheDocument();
  });

  it('ariaLabel sobreescribe el nombre', () => {
    render(<Breadcrumb items={items} ariaLabel="Migas" />);
    expect(screen.getByRole('navigation', { name: 'Migas' })).toBeInTheDocument();
  });

  it('con tres ítems hay dos enlaces y el último lleva aria-current="page" sin ser enlace', () => {
    render(<Breadcrumb items={items} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/catalogo');
    const current = screen.getByText('Iluminación');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.closest('a')).toBeNull();
  });

  it('el último ítem no es enlace aunque traiga href', () => {
    render(<Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo', href: '/catalogo' }]} />);
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText('Catálogo')).toHaveAttribute('aria-current', 'page');
  });

  it('los separadores quedan ocultos para lectores de pantalla', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const seps = container.querySelectorAll('[aria-hidden="true"]');
    expect(seps).toHaveLength(2);
    expect(seps[0].textContent).toBe('/');
  });

  it('separator personalizado', () => {
    const { container } = render(<Breadcrumb items={items} separator="›" />);
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('›');
  });

  it('renderLink recibe href, className y children', () => {
    render(
      <Breadcrumb
        items={items}
        renderLink={({ href, className, children }) => (
          <a href={href} className={className} data-next>
            {children}
          </a>
        )}
      />,
    );
    const link = screen.getByRole('link', { name: 'Inicio' });
    expect(link).toHaveAttribute('data-next');
    expect(link).toHaveAttribute('href', '/');
    expect(link.className).toContain('hover:text-text');
  });
});
