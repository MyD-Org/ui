import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  args: {
    eyebrow: 'Nueva colección 2026',
    title: 'La luz que hace',
    accent: 'hogar',
    lead: 'Lámparas, colgantes, guirnaldas y todo para iluminar tu casa. Stock real, marcas líderes y precios para todos.',
    imageSrc: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80',
    imageAlt: 'Living cálido',
    ctas: [{ label: 'Ver catálogo →', href: '/catalogo' }, { label: 'Línea decorativa', href: '/deco' }],
    usps: [{ label: 'Envíos a todo el país' }, { label: 'Stock en tiempo real' }, { label: 'Asesoramiento por WhatsApp' }],
  },
};
export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {};
