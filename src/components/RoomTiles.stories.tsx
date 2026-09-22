import type { Meta, StoryObj } from '@storybook/react-vite';
import { RoomTiles } from './RoomTiles';

const items = [
  { eyebrow: 'Interior', title: 'Colgantes y lámparas de diseño', imageSrc: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80', href: '#' },
  { eyebrow: 'Exterior', title: 'Patio y jardín', imageSrc: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', href: '#' },
  { eyebrow: 'Interior', title: 'Dormitorio', imageSrc: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', href: '#' },
];

const meta: Meta<typeof RoomTiles> = {
  title: 'Components/RoomTiles',
  component: RoomTiles,
  args: { items },
};
export default meta;
type Story = StoryObj<typeof RoomTiles>;

export const Mosaic: Story = {};
export const Grid: Story = { args: { variant: 'grid' } };

/**
 * Apiladas (pensada para mobile): cada tarjeta se pega un poco más abajo que la
 * anterior y la siguiente se monta encima, así se despegan al scrollear. Hay
 * que scrollear el canvas para verlo.
 */
export const Stack: Story = {
  args: { variant: 'stack', stackTop: 16 },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[420px]">
        <Story />
        <div className="h-[80vh]" />
      </div>
    ),
  ],
};
