import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, paginationWindow } from './Pagination';

describe('paginationWindow', () => {
  it('lista todas las páginas cuando entran en la ventana', () => {
    expect(paginationWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(paginationWindow(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(paginationWindow(1, 3)).toEqual([1, 2, 3]);
  });
  it('al inicio: ventana pegada al 1 y elipsis antes de la última', () => {
    expect(paginationWindow(1, 20)).toEqual([1, 2, 3, 4, null, 20]);
  });
  it('en el medio: elipsis a ambos lados', () => {
    expect(paginationWindow(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(paginationWindow(5, 492)).toEqual([1, null, 4, 5, 6, null, 492]);
  });
  it('al final: ventana pegada a la última', () => {
    expect(paginationWindow(20, 20)).toEqual([1, null, 17, 18, 19, 20]);
    expect(paginationWindow(492, 492)).toEqual([1, null, 489, 490, 491, 492]);
  });
  it('no deja huecos de una sola página: cerca del inicio se corre hacia adentro', () => {
    expect(paginationWindow(2, 492)).toEqual([1, 2, 3, 4, null, 492]);
  });
  it('siempre incluye la primera, la última y la actual', () => {
    for (const page of [1, 2, 8, 57, 117]) {
      const w = paginationWindow(page, 117);
      expect(w).toContain(1);
      expect(w).toContain(117);
      expect(w).toContain(page);
    }
  });
  it('siblings=2 amplía la ventana', () => {
    expect(paginationWindow(10, 40, 2)).toEqual([1, null, 8, 9, 10, 11, 12, null, 40]);
  });
});

describe('Pagination', () => {
  const hrefFor = (n: number) => `/catalogo?pagina=${n}`;

  it('no renderiza nada con totalPages <= 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} hrefFor={hrefFor} />);
    expect(container.firstChild).toBeNull();
  });

  it('es una navegación "Paginación" con una lista', () => {
    render(<Pagination page={1} totalPages={5} hrefFor={hrefFor} />);
    const nav = screen.getByRole('navigation', { name: 'Paginación' });
    expect(nav.querySelector('ul')).not.toBeNull();
  });

  it('con hrefFor los ítems son enlaces y la actual es un span aria-current sin link', () => {
    render(<Pagination page={5} totalPages={492} hrefFor={hrefFor} />);
    expect(screen.getByRole('link', { name: 'Página 4' })).toHaveAttribute('href', '/catalogo?pagina=4');
    expect(screen.getByRole('link', { name: 'Página 6' })).toHaveAttribute('href', '/catalogo?pagina=6');
    expect(screen.getByRole('link', { name: 'Página 492' })).toHaveAttribute('href', '/catalogo?pagina=492');
    const current = screen.getByText('5');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.className).toContain('bg-primary');
    expect(current.className).toContain('text-on-primary');
    expect(screen.queryByRole('link', { name: 'Página 5' })).toBeNull();
  });

  it('secuencia ‹ 1 … 4 5 6 … 492 › con elipsis aria-hidden', () => {
    const { container } = render(<Pagination page={5} totalPages={492} hrefFor={hrefFor} />);
    const items = Array.from(container.querySelectorAll('li')).map((li) => li.textContent?.trim());
    expect(items).toEqual(['‹', '1', '…', '4', '5', '6', '…', '492', '›']);
    const dots = Array.from(container.querySelectorAll('li[aria-hidden="true"]'));
    expect(dots).toHaveLength(2);
  });

  it('flechas con aria-label y deshabilitadas en los bordes', () => {
    render(<Pagination page={1} totalPages={3} hrefFor={hrefFor} />);
    const prev = screen.getByLabelText('Página anterior');
    expect(prev.tagName).toBe('SPAN');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(prev.className).toContain('opacity-40');
    expect(screen.getByRole('link', { name: 'Página siguiente' })).toHaveAttribute('href', '/catalogo?pagina=2');
  });

  it('en la última página › está deshabilitada y la actual lleva aria-current', () => {
    render(<Pagination page={492} totalPages={492} hrefFor={hrefFor} />);
    expect(screen.getByLabelText('Página siguiente')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Página anterior' })).toHaveAttribute('href', '/catalogo?pagina=491');
    expect(screen.getByText('492')).toHaveAttribute('aria-current', 'page');
  });

  it('sin hrefFor y con onPageChange, los ítems son botones', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Página 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('labels sobreescribe los textos', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        hrefFor={hrefFor}
        labels={{ ariaLabel: 'Paginación del catálogo', previous: 'Atrás', next: 'Adelante', page: (n) => `Ir a ${n}` }}
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Paginación del catálogo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Atrás' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Adelante' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a 3' })).toBeInTheDocument();
  });

  it('renderLink recibe aria-label y className', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        hrefFor={hrefFor}
        renderLink={(p) => (
          <a href={p.href} className={p.className} aria-label={p['aria-label']} data-next>
            {p.children}
          </a>
        )}
      />,
    );
    const link = screen.getByRole('link', { name: 'Página 3' });
    expect(link).toHaveAttribute('data-next');
    expect(link.className).toContain('rounded-full');
  });
});
