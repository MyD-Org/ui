import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromoBar } from './PromoBar';

const meta: Meta<typeof PromoBar> = {
  title: 'Components/PromoBar',
  component: PromoBar,
  args: {
    items: [
      { eyebrow: 'Hasta', value: '8', title: 'cuotas sin interés', text: 'Con tarjeta de crédito. Desde $ 30.000.' },
      { value: '%', decorativeValue: true, title: 'Grandes descuentos', text: 'Pagando con transferencia.' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof PromoBar>;

export const DosAvisos: Story = {};

export const UnAviso: Story = {
  args: { items: [{ eyebrow: 'Hasta', value: '8', title: 'cuotas sin interés', text: 'Con tarjeta de crédito.' }] },
};
