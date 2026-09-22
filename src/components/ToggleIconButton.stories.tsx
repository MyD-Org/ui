import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ToggleIconButton, type ToggleIconButtonTone } from './ToggleIconButton';

const meta: Meta<typeof ToggleIconButton> = {
  title: 'Components/ToggleIconButton',
  component: ToggleIconButton,
};
export default meta;
type Story = StoryObj<typeof ToggleIconButton>;

const Corazon = ({ lleno }: { lleno: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={lleno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const Estrella = ({ llena }: { llena: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={llena ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z" />
  </svg>
);

function Demo({ tone, size, loading, inicial = false }: { tone?: ToggleIconButtonTone; size?: 'sm' | 'md'; loading?: boolean; inicial?: boolean }) {
  const [pressed, setPressed] = useState(inicial);
  const Icono = tone === 'danger' ? <Corazon lleno={pressed} /> : <Estrella llena={pressed} />;
  return (
    <ToggleIconButton
      pressed={pressed}
      onPressedChange={setPressed}
      tone={tone}
      size={size}
      loading={loading}
      aria-label={tone === 'danger' ? (pressed ? 'Quitar de favoritos' : 'Guardar en favoritos') : pressed ? 'Quitar destacado' : 'Destacar'}
      icon={Icono}
    />
  );
}

export const Favorito: Story = { render: () => <Demo tone="danger" /> };
export const FavoritoGuardado: Story = { render: () => <Demo tone="danger" inicial /> };
export const Primario: Story = { render: () => <Demo /> };
export const Chico: Story = { render: () => <Demo tone="danger" size="sm" /> };
export const Cargando: Story = { render: () => <Demo tone="danger" loading inicial /> };
