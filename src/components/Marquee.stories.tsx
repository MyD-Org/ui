import type { Meta, StoryObj } from '@storybook/react-vite';
import { Marquee } from './Marquee';

const meta: Meta<typeof Marquee> = {
  title: 'Components/Marquee',
  component: Marquee,
  args: { items: ['Más de 5.000 productos', 'Despacho en 24 h', 'Asesoramiento en iluminación', 'Puerto Iguazú, Misiones'] },
};
export default meta;
type Story = StoryObj<typeof Marquee>;

export const Default: Story = {};
