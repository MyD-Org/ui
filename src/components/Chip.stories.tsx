import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
};
export default meta;
type Story = StoryObj<typeof Chip>;

export const ToggleDefault: Story = { args: { children: 'Fría 6500K' } };
export const ToggleSelected: Story = { args: { children: 'Cálida 3000K', selected: true } };
export const Removable: Story = { args: { variant: 'removable', children: 'Iluminación LED' } };
