import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FadeScroll } from './FadeScroll';
import { Button } from './Button';

const meta: Meta<typeof FadeScroll> = {
  title: 'Utilities/FadeScroll',
  component: FadeScroll,
};
export default meta;
type Story = StoryObj<typeof FadeScroll>;

const filas = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <p key={i} className="rounded-sm bg-surface px-3 py-2 text-sm text-text shadow-[var(--shadow-1)]">
      Fila {i + 1}
    </p>
  ));

/** Contenido largo: sin barra visible, difumina sólo del lado donde hay más. */
export const ContenidoLargo: Story = {
  render: () => (
    <FadeScroll
      aria-label="Filtros"
      className="max-h-72 w-64 space-y-2 overflow-y-auto overscroll-contain pb-12"
    >
      {filas(20)}
    </FadeScroll>
  ),
};

/** El contenido crece: el difuminado aparece solo al desbordar (ResizeObserver). */
export const ContenidoQueCrece: Story = {
  render: function Crece() {
    const [n, setN] = useState(2);
    return (
      <div className="flex flex-col items-start gap-3">
        <Button size="sm" onClick={() => setN((v) => v + 2)}>
          Agregar filas ({n})
        </Button>
        <FadeScroll aria-label="Lista que crece" className="max-h-60 w-64 space-y-2 overflow-y-auto pb-12">
          {filas(n)}
        </FadeScroll>
      </div>
    );
  },
};

/** Sólo desde `lg`: debajo de ese ancho el panel no scrollea ni difumina. */
export const DesdeLg: Story = {
  render: () => (
    <FadeScroll fadeFrom="lg" className="w-64 space-y-2 pb-12 lg:max-h-72 lg:overflow-y-auto">
      {filas(20)}
    </FadeScroll>
  ),
};
