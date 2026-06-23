import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoryTile } from './CategoryTile';

const meta: Meta<typeof CategoryTile> = {
  title: 'Components/CategoryTile',
  component: CategoryTile,
};
export default meta;
type Story = StoryObj<typeof CategoryTile>;

export const Default: Story = {
  args: { label: 'Iluminación LED', count: 1240, icon: '💡' },
};

export const NoCount: Story = {
  args: { label: 'Cables y conductores' },
};
