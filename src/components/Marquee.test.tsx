import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Marquee } from './Marquee';
import type { RenderImage } from '../lib/renderImage';

function mitades(container: HTMLElement) {
  const pista = container.querySelector('.animate-marquee') as HTMLElement;
  return Array.from(pista.children) as HTMLElement[];
}

describe('Marquee', () => {
  it('renderiza dos mitades idénticas para el loop infinito', () => {
    const { container } = render(<Marquee items={['Más de 5.000 productos', 'Despacho en 24 h']} />);
    const [a, b] = mitades(container);
    expect(mitades(container)).toHaveLength(2);
    expect(a.innerHTML).toBe(b.innerHTML);
    expect(screen.getAllByText('Más de 5.000 productos').length).toBeGreaterThanOrEqual(2);
  });

  it('repite los ítems hasta que una mitad cubra cualquier viewport (sin hueco al final)', () => {
    const { container } = render(<Marquee items={['a', 'b', 'c', 'd']} />);
    const [mitad] = mitades(container);
    expect(mitad.children.length).toBeGreaterThanOrEqual(24);
    // Conserva el orden original al repetir.
    const textos = Array.from(mitad.children).map((s) => s.textContent);
    expect(textos.slice(0, 8)).toEqual(['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd']);
  });

  it('no repite de más cuando la lista ya es larga', () => {
    const items = Array.from({ length: 30 }, (_, i) => `item ${i}`);
    const { container } = render(<Marquee items={items} />);
    expect(mitades(container)[0].children.length).toBe(30);
  });

  it('escala la duración con las repeticiones para mantener la velocidad', () => {
    const { container: corta } = render(<Marquee items={['a', 'b', 'c', 'd']} />);
    const { container: larga } = render(<Marquee items={Array.from({ length: 24 }, (_, i) => `i${i}`)} />);
    const pista = (c: HTMLElement) => c.querySelector('.animate-marquee') as HTMLElement;
    expect(pista(corta).style.animationDuration).toBe('192s'); // 6 repeticiones × 32 s
    expect(pista(larga).style.animationDuration).toBe('32s');
  });

  it('usa la animación marquee, bordes de línea y respeta reduced motion', () => {
    const { container } = render(<Marquee items={['x']} />);
    const pista = container.querySelector('.animate-marquee');
    expect(pista).not.toBeNull();
    expect(pista?.className).toContain('motion-reduce:');
    expect((container.firstChild as HTMLElement)?.className).toContain('border-y');
  });

  it('recorta con clip y no es interactiva (scrolleable, robaría el scroll de la página)', () => {
    const { container } = render(<Marquee items={['x']} />);
    const cinta = container.firstChild as HTMLElement;
    expect(cinta.className).toContain('overflow-clip');
    expect(cinta.className).not.toContain('overflow-hidden');
    expect(cinta.className).toContain('select-none');
    expect(container.querySelector('.animate-marquee')?.className).toContain('pointer-events-none');
  });

  it('muestra logos como imagen en gris, mezclados con textos', () => {
    const { container } = render(
      <Marquee items={['Despacho en 24 h', { src: '/marcas/acme.png', alt: 'Acme' }]} />,
    );
    const [mitad] = mitades(container);
    const logo = mitad.querySelector('img') as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('/marcas/acme.png');
    expect(logo.getAttribute('alt')).toBe('');
    expect(logo.className).toContain('brightness-0');
    expect(logo.className).toContain('h-7');
    // El orden se conserva: texto, logo, texto, logo…
    expect(mitad.children[0].textContent).toBe('Despacho en 24 h');
    expect(mitad.children[1].querySelector('img')).not.toBeNull();
  });

  it('no renderiza nada sin ítems', () => {
    const { container } = render(<Marquee items={[]} />);
    expect(container.firstChild).toBeNull();
  });


  it('sin renderImage el logo conserva el <img> de siempre (lazy, async, sin arrastre)', () => {
    const { container } = render(<Marquee items={[{ src: '/marcas/acme.png', alt: 'Acme' }]} />);
    const logo = container.querySelector('img') as HTMLImageElement;
    expect(logo).toHaveAttribute('loading', 'lazy');
    expect(logo).toHaveAttribute('decoding', 'async');
    expect(logo).toHaveAttribute('draggable', 'false');
    expect(logo).toHaveAttribute('data-logo', 'Acme');
  });

  it('renderImage recibe los logos con fit logo, sizes 150px, alt vacío y data-logo; los textos no pasan por ahí', () => {
    const vistos: Parameters<RenderImage>[0][] = [];
    const imagen: RenderImage = (p) => {
      vistos.push(p);
      return <img src={p.src} alt={p.alt} className={p.className} data-framework-img />;
    };
    const { container } = render(
      <Marquee items={['Despacho en 24 h', { src: '/marcas/acme.png', alt: 'Acme' }]} renderImage={imagen} />,
    );
    const [mitad] = mitades(container);
    const logo = mitad.querySelector('img') as HTMLImageElement;
    expect(logo).toHaveAttribute('data-framework-img');
    expect(logo.className).toBe('h-7 w-auto max-w-[150px] object-contain brightness-0 opacity-50');
    expect(vistos.length).toBeGreaterThan(0);
    expect(vistos.every((p) => p.src === '/marcas/acme.png')).toBe(true);
    expect(vistos[0]).toMatchObject({ alt: '', sizes: '150px', fit: 'logo', 'data-logo': 'Acme' });
    expect(vistos[0].priority).toBeUndefined();
  });
});
