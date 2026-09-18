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

  it('grid: tiles uniformes de 4 columnas con flecha circular', () => {
    render(<RoomTiles items={items} variant="grid" />);
    const first = screen.getByRole('link', { name: /Colgantes/ });
    expect(first.className).toContain('lg:min-h-0');
    expect(first.querySelector('[data-go]')).not.toBeNull();
  });

  it('mosaic usa el link "Explorar →"', () => {
    render(<RoomTiles items={items} />);
    expect(screen.getAllByText('Explorar →').length).toBe(3);
  });
});
