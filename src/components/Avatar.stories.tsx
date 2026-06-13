import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Utilities/Avatar',
  component: Avatar,
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = { args: { name: 'Central Led' } };
export const WithImage: Story = { args: { name: 'Soporte', src: 'https://i.pravatar.cc/100' } };
export const Large: Story = { args: { name: 'Central Led', size: 'lg' } };
