import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChipRow } from './ChipRow';

const meta: Meta<typeof ChipRow> = {
  title: 'Components/ChipRow',
  component: ChipRow,
  args: {
    chips: [
      { label: 'Apliques de pared', href: '/catalogo' },
      { label: 'Faroles solares', href: '/catalogo' },
      { label: 'Smart / Wi-Fi' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof ChipRow>;

export const Default: Story = {};
