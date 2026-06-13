import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { tone: 'neutral', children: 'neutral' } };
export const Success: Story = { args: { tone: 'success', children: 'success' } };
export const Danger: Story = { args: { tone: 'danger', children: 'danger' } };
export const Warning: Story = { args: { tone: 'warning', children: 'warning' } };
