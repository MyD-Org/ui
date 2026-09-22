import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Carousel } from './Carousel';

/**
 * jsdom no hace layout: `scrollWidth` y `clientWidth` son 0, así que por
 * default el carrusel se cree que entra todo y no dibuja flechas. Para probar
 * el caso con scroll hay que fingir las medidas de la pista.
 */
function conMedidas(pista: HTMLElement, { scrollWidth = 0, clientWidth = 0, scrollLeft = 0 }) {
  Object.defineProperty(pista, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(pista, 'clientWidth', { value: clientWidth, configurable: true });
  Object.defineProperty(pista, 'scrollLeft', { value: scrollLeft, writable: true, configurable: true });
}

const tarjetas = [<span key="a">A</span>, <span key="b">B</span>, <span key="c">C</span>];

describe('Carousel', () => {
  it('es una región con nombre y una celda por hijo', () => {
    render(<Carousel label="Los más vendidos">{tarjetas}</Carousel>);
    const pista = screen.getByRole('region', { name: 'Los más vendidos' });
    expect(pista.children.length).toBe(3);
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('la pista es enfocable y hace snap horizontal', () => {
    render(<Carousel label="Destacados">{tarjetas}</Carousel>);
    const pista = screen.getByRole('region', { name: 'Destacados' });
    expect(pista).toHaveAttribute('tabindex', '0');
    expect(pista.className).toContain('snap-x');
    expect(pista.className).toContain('overflow-x-auto');
  });

  it('sin scroll posible no dibuja flechas', () => {
    render(<Carousel label="Destacados">{tarjetas}</Carousel>);
    expect(screen.queryByRole('button', { name: 'Ver siguientes' })).toBeNull();
  });

  it('con contenido más ancho que la pista aparecen las flechas', () => {
    const { rerender } = render(<Carousel label="Destacados">{tarjetas}</Carousel>);
    const pista = screen.getByRole('region', { name: 'Destacados' });
    conMedidas(pista, { scrollWidth: 1200, clientWidth: 400 });
    // Un scroll dispara la remedición del componente.
    pista.dispatchEvent(new Event('scroll', { bubbles: true }));
    rerender(<Carousel label="Destacados">{tarjetas}</Carousel>);

    expect(screen.getByRole('button', { name: 'Ver siguientes' })).toBeEnabled();
    // Al inicio no hay nada a la izquierda: la flecha existe pero apagada.
    expect(screen.getByRole('button', { name: 'Ver anteriores' })).toBeDisabled();
  });

  it('perView define cuántas tarjetas entran desde lg', () => {
    const { container } = render(
      <Carousel label="Destacados" perView={3}>
        {tarjetas}
      </Carousel>,
    );
    const celda = container.querySelector('[role=region] > div');
    expect(celda?.className).toContain('lg:w-[calc((100%-2*1.25rem)/3)]');
  });
});
