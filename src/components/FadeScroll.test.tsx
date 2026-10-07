import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FadeScroll } from './FadeScroll';

// jsdom no hace layout: la geometría se simula con getters en el prototipo.
const geo = { scrollHeight: 100, clientHeight: 100, scrollTop: 0 };
const ROs: { cb: () => void; observados: Element[]; desconectado: boolean }[] = [];

class ROFalso {
  rec = { cb: () => {}, observados: [] as Element[], desconectado: false };
  constructor(cb: () => void) {
    this.rec.cb = cb;
    ROs.push(this.rec);
  }
  observe(el: Element) {
    this.rec.observados.push(el);
  }
  unobserve() {}
  disconnect() {
    this.rec.observados = [];
    this.rec.desconectado = true;
  }
}

const original = globalThis.ResizeObserver;
const props = ['scrollHeight', 'clientHeight', 'scrollTop'] as const;

beforeEach(() => {
  Object.assign(geo, { scrollHeight: 100, clientHeight: 100, scrollTop: 0 });
  ROs.length = 0;
  globalThis.ResizeObserver = ROFalso as unknown as typeof ResizeObserver;
  for (const p of props) {
    Object.defineProperty(HTMLElement.prototype, p, {
      configurable: true,
      get: () => geo[p],
      set: (v: number) => {
        geo[p] = v;
      },
    });
  }
});

afterEach(() => {
  globalThis.ResizeObserver = original;
  for (const p of props) delete (HTMLElement.prototype as unknown as Record<string, unknown>)[p];
});

const renderizar = (extra: Partial<React.ComponentProps<typeof FadeScroll>> = {}) =>
  render(
    <FadeScroll data-testid="fs" {...extra}>
      <p>uno</p>
      <p>dos</p>
    </FadeScroll>,
  );

const mascara = () => screen.getByTestId('fs').style.getPropertyValue('--fade-mask');

describe('FadeScroll', () => {
  it('sin overflow no aplica máscara ni entra en el tab order', () => {
    renderizar();
    const el = screen.getByTestId('fs');
    expect(el).toHaveAttribute('data-fade', 'none');
    expect(mascara()).toBe('');
    expect(el).not.toHaveAttribute('tabindex');
    expect(el.className).not.toContain('mask-image');
  });

  it('con contenido por ver sólo abajo, difumina abajo', () => {
    geo.scrollHeight = 400;
    geo.clientHeight = 100;
    renderizar();
    const el = screen.getByTestId('fs');
    expect(el).toHaveAttribute('data-fade', 'bottom');
    expect(mascara()).toBe('linear-gradient(to bottom, black calc(100% - 48px), transparent)');
    expect(el).toHaveAttribute('tabindex', '0');
    expect(el.className).toContain('[mask-image:var(--fade-mask)]');
  });

  it('con contenido por ver sólo arriba, difumina arriba', () => {
    geo.scrollHeight = 400;
    geo.clientHeight = 100;
    renderizar();
    geo.scrollTop = 300;
    fireEvent.scroll(screen.getByTestId('fs'));
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'top');
    expect(mascara()).toBe('linear-gradient(to bottom, transparent, black 48px)');
  });

  it('a mitad de camino difumina ambos lados', () => {
    geo.scrollHeight = 400;
    geo.clientHeight = 100;
    renderizar();
    geo.scrollTop = 120;
    fireEvent.scroll(screen.getByTestId('fs'));
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'both');
    expect(mascara()).toBe(
      'linear-gradient(to bottom, transparent, black 48px, black calc(100% - 48px), transparent)',
    );
  });

  it('tolera restos de 1px', () => {
    geo.scrollHeight = 101;
    geo.clientHeight = 100;
    renderizar();
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'none');
  });

  it('fadeSize cambia el tamaño del difuminado', () => {
    geo.scrollHeight = 400;
    renderizar({ fadeSize: 24 });
    expect(mascara()).toBe('linear-gradient(to bottom, black calc(100% - 24px), transparent)');
  });

  it('fadeFrom aplica la máscara desde el breakpoint', () => {
    geo.scrollHeight = 400;
    renderizar({ fadeFrom: 'lg' });
    const cls = screen.getByTestId('fs').className;
    expect(cls).toContain('lg:[mask-image:var(--fade-mask)]');
    expect(cls).not.toContain(' [mask-image:var(--fade-mask)]');
  });

  it('se re-mide cuando el ResizeObserver avisa que cambió el tamaño', () => {
    renderizar();
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'none');
    geo.scrollHeight = 500;
    act(() => ROs[0].cb());
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'bottom');
    geo.scrollHeight = 100;
    act(() => ROs[0].cb());
    expect(screen.getByTestId('fs')).toHaveAttribute('data-fade', 'none');
  });

  it('observa el contenedor y sus hijos directos, y se desconecta al desmontar', () => {
    const { unmount } = renderizar();
    const el = screen.getByTestId('fs');
    expect(ROs[0].observados).toEqual([el, ...Array.from(el.children)]);
    unmount();
    expect(ROs[0].desconectado).toBe(true);
  });

  it('re-observa cuando cambian los hijos', async () => {
    renderizar();
    const el = screen.getByTestId('fs');
    const nuevo = document.createElement('p');
    el.appendChild(nuevo);
    await act(async () => {
      await Promise.resolve();
    });
    expect(ROs[0].observados).toContain(nuevo);
  });

  it('reenvía el ref, respeta as, className y onScroll', () => {
    const ref = createRef<HTMLElement>();
    const onScroll = vi.fn();
    render(
      <FadeScroll as="aside" ref={ref} className="max-h-40 overflow-y-auto" onScroll={onScroll} data-testid="fs">
        x
      </FadeScroll>,
    );
    const el = screen.getByTestId('fs');
    expect(el.tagName).toBe('ASIDE');
    expect(ref.current).toBe(el);
    expect(el.className).toContain('max-h-40');
    expect(el.className).toContain('[&::-webkit-scrollbar]:hidden');
    expect(el.style.scrollbarWidth).toBe('none');
    fireEvent.scroll(el);
    expect(onScroll).toHaveBeenCalledTimes(1);
  });

  it('aria-label lo anuncia como región; tabIndex del consumidor se respeta', () => {
    geo.scrollHeight = 400;
    renderizar({ 'aria-label': 'Filtros', tabIndex: -1 });
    const el = screen.getByRole('region', { name: 'Filtros' });
    expect(el).toHaveAttribute('tabindex', '-1');
  });
});
