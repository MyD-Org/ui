import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoomTiles, profundidadesPila } from './RoomTiles';

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

  it('stack: todas se pegan a la misma altura, cada una por encima de la anterior', () => {
    const { container } = render(<RoomTiles items={items} variant="stack" />);
    const pegadas = [...container.querySelectorAll<HTMLElement>('.sticky')];
    expect(pegadas.length).toBe(3);
    // 72 de tope + 2 franjas de 10 para las que se asoman detrás.
    expect(pegadas.map((el) => el.style.top)).toEqual(['92px', '92px', '92px']);
    expect(pegadas.map((el) => el.style.zIndex)).toEqual(['1', '2', '3']);
  });

  it('stack: stackTop, stackSolape y stackProfundidad son configurables', () => {
    const { container } = render(
      <RoomTiles items={items} variant="stack" stackTop={0} stackSolape={24} stackProfundidad={2} />,
    );
    const pegadas = [...container.querySelectorAll<HTMLElement>('.sticky')];
    expect(pegadas.map((el) => el.style.top)).toEqual(['48px', '48px', '48px']);
  });

  it('stack: la de atrás se achica y sube según cuánto la taparon', () => {
    const tops = [92, 92, 242];
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
      const i = [...(this.parentElement?.children ?? [])].indexOf(this);
      const top = this.classList.contains('sticky') ? tops[i] : 0;
      return { top, height: 300, bottom: top + 300, left: 0, right: 0, width: 0, x: 0, y: top, toJSON() {} } as DOMRect;
    };
    try {
      const { container } = render(<RoomTiles items={items} variant="stack" />);
      const caras = [...container.querySelectorAll<HTMLElement>('[data-pila-cara]')];
      // La 1ª: tapada por la 2ª entera y la 3ª a mitad → 1.5 niveles.
      expect(caras[0].style.transform).toBe('translateY(-15px) scale(0.88)');
      // La 2ª: la 3ª va por la mitad.
      expect(caras[1].style.transform).toBe('translateY(-5px) scale(0.96)');
      // La de adelante no se toca.
      expect(caras[2].style.transform).toBe('');
    } finally {
      HTMLElement.prototype.getBoundingClientRect = rect;
    }
  });

  it('stack: más allá de la profundidad máxima se desvanece', () => {
    // 4 tarjetas pegadas: la 1ª tiene 3 encima y el máximo es 2 → invisible.
    const cuatro = [...items, { eyebrow: 'Interior', title: 'Veladores', imageSrc: '/d.jpg', href: '/c4' }];
    const rect = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return { top: 92, height: 300, bottom: 392, left: 0, right: 0, width: 0, x: 0, y: 92, toJSON() {} } as DOMRect;
    };
    try {
      const { container } = render(<RoomTiles items={cuatro} variant="stack" />);
      const caras = [...container.querySelectorAll<HTMLElement>('[data-pila-cara]')];
      expect(caras.map((c) => c.style.opacity)).toEqual(['0', '', '', '']);
    } finally {
      HTMLElement.prototype.getBoundingClientRect = rect;
    }
  });

  it('profundidadesPila: suma cuánto llegó cada una de las siguientes', () => {
    // Todas pegadas: la 1ª tiene 3 encima, la última ninguna.
    expect(profundidadesPila([100, 100, 100, 100], [300, 300, 300, 300], 100)).toEqual([3, 2, 1, 0]);
    // Las que todavía no llegaron no cuentan; las que ya pasaron cuentan 1.
    expect(profundidadesPila([100, 700, 50], [300, 300, 300], 100)).toEqual([1, 1, 0]);
  });

  it('stack: el texto va arriba porque es la franja que queda visible', () => {
    render(<RoomTiles items={items} variant="stack" />);
    const first = screen.getByRole('link', { name: /Colgantes/ });
    expect(first.className).toContain('items-start');
    expect(first.querySelector('[class*="to_bottom"]')).not.toBeNull();
  });

  it('un tile sin título ni eyebrow no deja elementos vacíos', () => {
    const { container } = render(<RoomTiles items={[{ imageSrc: '/a.jpg', href: '/a' }]} />);
    expect(container.querySelector('h3')).toBeNull();
    expect(container.querySelector('small')).toBeNull();
  });

  it('el velo de contraste va pegado al bloque de texto, no al alto del tile', () => {
    const { container } = render(<RoomTiles items={[{ eyebrow: 'Instalación', title: 'Cajas', imageSrc: '/a.jpg', href: '/a' }]} />);
    const bloque = container.querySelector('h3')?.parentElement;
    expect(bloque?.className).toContain('before:-top-24');
    expect(bloque?.className).toContain('w-full');
  });
});
