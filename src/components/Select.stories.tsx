import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    options: [
      { label: 'Sonnet', value: 'claude-sonnet-4-6' },
      { label: 'Haiku', value: 'claude-haiku-4-5' },
    ],
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const WithPlaceholder: Story = { args: { placeholder: 'Elegí un modelo' } };
