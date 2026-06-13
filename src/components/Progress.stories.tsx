import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 60, 'aria-label': 'Progreso' },
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Primary: Story = {};
export const Success: Story = { args: { value: 100, tone: 'success' } };
export const Warning: Story = { args: { value: 40, tone: 'warning' } };
export const Danger: Story = { args: { value: 15, tone: 'danger' } };
export const Small: Story = { args: { value: 35, size: 'sm' } };
export const PartialPayment: Story = { args: { value: 150000, max: 500000, size: 'sm' } };
