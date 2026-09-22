import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Guardar' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Link: Story = { args: { variant: 'link', children: 'Limpiar filtros' } };
export const LinkInline: Story = {
  render: () => (
    <p className="text-sm text-muted">
      Mostrando 6 de 22 marcas.{' '}
      <Button variant="link" size="inline">Ver todas (22)</Button>
    </p>
  ),
};
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Volver a comprar
      </>
    ),
  },
};
export const ComoEnlace: Story = {
  args: { href: '/mi-cuenta/pedidos/1', variant: 'outline', size: 'sm', children: 'Ver detalle →' },
};
export const Loading: Story = { args: { loading: true } };
export const IconRound: Story = {
  args: {
    size: 'icon-lg',
    shape: 'round',
    'aria-label': 'Agregar al carrito',
    children: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
};
export const Icon: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    'aria-label': 'Editar',
    children: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
};
