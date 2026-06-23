import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
};
export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = { args: { value: 4.8, count: 32 } };
export const ThreeStars: Story = { args: { value: 3 } };
export const Full: Story = { args: { value: 5, count: 100 } };
