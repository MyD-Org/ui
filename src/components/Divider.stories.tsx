import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Utilities/Divider',
  component: Divider,
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <p className="text-sm">Contenido de arriba</p>
      <Divider />
      <p className="text-sm">Contenido de abajo</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-3">
      <span>A</span>
      <Divider orientation="vertical" />
      <span>B</span>
    </div>
  ),
};
