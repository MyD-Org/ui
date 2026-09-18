import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromoBanner } from './PromoBanner';

const meta: Meta<typeof PromoBanner> = {
  title: 'Components/PromoBanner',
  component: PromoBanner,
  args: {
    eyebrow: 'Línea decorativa · Nuevo',
    title: 'Ambientá tus noches con',
    accent: 'luz cálida',
    lead: 'Guirnaldas, neones, veladores y colgantes para transformar cualquier espacio.',
    cta: { label: 'Descubrir la línea →', href: '/deco' },
    imageSrc: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
    imageAlt: 'Patio con guirnaldas al atardecer',
  },
};
export default meta;
type Story = StoryObj<typeof PromoBanner>;

export const Default: Story = {};
