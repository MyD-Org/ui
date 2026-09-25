import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromoBanner } from './PromoBanner';
import type { RenderImage } from '../lib/renderImage';

/**
 * Renderer de ejemplo: en una app Next se enchufa `next/image`. Acá deja un
 * `<img>` con el `sizes` a la vista (pase el mouse) para ver qué recibe.
 */
const imagenDeFramework: RenderImage = ({ src, alt, className, sizes, fit, priority, ...data }) => (
  <img
    src={src}
    alt={alt}
    className={className}
    title={`sizes: ${sizes} · fit: ${fit}${priority ? ' · priority' : ''}`}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    {...data}
  />
);

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

export const ConRenderImage: Story = {
  name: 'Con renderImage (next/image)',
  args: { renderImage: imagenDeFramework },
};
