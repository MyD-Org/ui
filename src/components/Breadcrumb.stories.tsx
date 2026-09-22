import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const TresItems: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Catálogo', href: '/catalogo' },
      { label: 'Iluminación' },
    ],
  },
};

export const DosItems: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Catálogo' },
    ],
  },
};

export const SeparadorCustom: Story = {
  args: {
    separator: '›',
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Catálogo', href: '/catalogo' },
      { label: 'Resultados' },
    ],
  },
};
