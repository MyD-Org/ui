import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from './SiteHeader';

const meta: Meta<typeof SiteHeader> = {
  title: 'Components/SiteHeader',
  component: SiteHeader,
  args: {
    brandName: 'Central',
    brandAccent: 'Led',
    brandSub: 'Iluminación · Electricidad',
    search: <input placeholder="¿Qué estás buscando?" aria-label="buscar" className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm" />,
    actions: <a href="/carrito">Carrito</a>,
    nav: [
      { label: 'Novedades', href: '#' },
      { label: 'Iluminación', href: '#' },
      { label: 'Decorativa', href: '#', badge: 'Nuevo' },
      { label: 'Exterior', href: '#' },
      { label: 'Ofertas', href: '#' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {};
