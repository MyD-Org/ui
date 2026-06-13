import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Utilities/Stack',
  component: Stack,
  render: (args) => (
    <Stack {...args}>
      <div className="rounded-sm bg-elevated px-3 py-2">1</div>
      <div className="rounded-sm bg-elevated px-3 py-2">2</div>
      <div className="rounded-sm bg-elevated px-3 py-2">3</div>
    </Stack>
  ),
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const Column: Story = { args: { direction: 'col', gap: 'md' } };
export const Row: Story = { args: { direction: 'row', gap: 'lg' } };
