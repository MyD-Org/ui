import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoomTiles } from './RoomTiles';

const items = [
  { eyebrow: 'Interior', title: 'Colgantes y lámparas', imageSrc: '/a.jpg', href: '/c1' },
  { eyebrow: 'Exterior', title: 'Patio y jardín', imageSrc: '/b.jpg', href: '/c2' },
  { eyebrow: 'Interior', title: 'Dormitorio', imageSrc: '/c.jpg', href: '/c3' },
];

describe('RoomTiles', () => {
  it('renderiza todos los tiles como links con su caption', () => {
    render(<RoomTiles items={items} />);
    for (const it of items) {
      expect(screen.getByRole('link', { name: new RegExp(it.title) })).toHaveAttribute('href', it.href);
    }
  });

  it('mosaic: el primer tile ocupa las dos filas (grilla 1.25fr/1fr)', () => {
    render(<RoomTiles items={items} />);
    const first = screen.getByRole('link', { name: /Colgantes/ });
    expect(first.className).toContain('lg:row-span-2');
    expect(first.className).toContain('lg:min-h-[460px]');
  });

  it('grid: tiles uniformes de 4 columnas', () => {
    render(<RoomTiles items={items} variant="grid" />);
    const first = screen.getByRole('link', { name: /Colgantes/ });
    expect(first.className).toContain('lg:min-h-0');
  });

  it('las tres variantes usan el mismo call to action', () => {
    for (const variant of ['mosaic', 'grid', 'stack'] as const) {
      const { unmount } = render(<RoomTiles items={items} variant={variant} />);
      const ctas = screen.getAllByText('Explorar →');
      expect(ctas.length).toBe(3);
      // Link subrayado, no el círculo con la flecha que usaba grid antes.
      expect(ctas[0].className).toContain('border-b-[1.5px]');
      unmount();
    }
  });

  it('ctaLabel cambia el texto del call to action', () => {
    render(<RoomTiles items={items} ctaLabel="Ver productos" />);
    expect(screen.getAllByText('Ver productos →').length).toBe(3);
  });

  it('stack: cada tile se pega más abajo que la anterior y por encima', () => {
    const { container } = render(<RoomTiles items={items} variant="stack" />);
    const pegadas = [...container.querySelectorAll<HTMLElement>('.sticky')];
    expect(pegadas.length).toBe(3);
    expect(pegadas.map((el) => el.style.top)).toEqual(['72px', '82px', '92px']);
    expect(pegadas.map((el) => el.style.zIndex)).toEqual(['1', '2', '3']);
  });

  it('stack: stackTop y stackSolape son configurables', () => {
    const { container } = render(
      <RoomTiles items={items} variant="stack" stackTop={0} stackSolape={24} />,
    );
    const pegadas = [...container.querySelectorAll<HTMLElement>('.sticky')];
    expect(pegadas.map((el) => el.style.top)).toEqual(['0px', '24px', '48px']);
  });

  it('stack: el texto va arriba porque es la franja que queda visible', () => {
    render(<RoomTiles items={items} variant="stack" />);
    const first = screen.getByRole('link', { name: /Colgantes/ });
    expect(first.className).toContain('items-start');
    expect(first.querySelector('[class*="to_bottom"]')).not.toBeNull();
  });
});
