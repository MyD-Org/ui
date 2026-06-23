import type { Meta, StoryObj } from '@storybook/react-vite';
import { PriceTier } from './PriceTier';

const meta: Meta<typeof PriceTier> = {
  title: 'Components/PriceTier',
  component: PriceTier,
};
export default meta;
type Story = StoryObj<typeof PriceTier>;

export const Default: Story = {
  args: {
    tiers: [
      { label: '1 – 9 u.', price: 14990 },
      { label: '10 – 49 u.', price: 14240, discount: '-5%' },
      { label: '50+ u.', price: 13490, discount: '-10%' },
    ],
  },
};
