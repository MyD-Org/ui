import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Utilities/Alert',
  component: Alert,
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Neutral: Story = { args: { tone: 'neutral', title: 'Neutral', children: 'Mensaje de ejemplo.' } };
export const Success: Story = { args: { tone: 'success', title: 'Success', children: 'Mensaje de ejemplo.' } };
export const Warning: Story = { args: { tone: 'warning', title: 'Warning', children: 'Mensaje de ejemplo.' } };
export const Danger: Story = { args: { tone: 'danger', title: 'Danger', children: 'Mensaje de ejemplo.' } };
