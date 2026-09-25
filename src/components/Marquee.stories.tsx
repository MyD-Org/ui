import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee } from './Marquee';
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

const meta: Meta<typeof Marquee> = {
  title: 'Components/Marquee',
  component: Marquee,
  args: { items: ['Más de 5.000 productos', 'Despacho en 24 h', 'Asesoramiento en iluminación', 'Puerto Iguazú, Misiones'] },
};
export default meta;
type Story = StoryObj<typeof Marquee>;

export const Default: Story = {};

const logo = (texto: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="48"><text x="0" y="38" font-family="Arial" font-weight="700" font-size="40" fill="${color}">${texto}</text></svg>`,
  )}`;

export const Logos: Story = {
  args: {
    items: [
      { src: logo('ACME', '#e4572e'), alt: 'Acme' },
      { src: logo('Lumina', '#3584b8'), alt: 'Lumina' },
      { src: logo('VOLTEX', '#111'), alt: 'Voltex' },
    ],
  },
};

export const LogosConRenderImage: Story = {
  name: 'Logos con renderImage (next/image)',
  args: { ...Logos.args, renderImage: imagenDeFramework },
};
