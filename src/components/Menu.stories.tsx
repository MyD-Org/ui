import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Menu } from './Menu';

const items = [
  { value: 'inbox', label: 'Inbox', badge: '12' },
  { value: 'sent', label: 'Enviados' },
  { value: 'drafts', label: 'Borradores' },
  { value: 'spam', label: 'Spam', disabled: true },
];

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Menu>;

function Demo() {
  const [value, setValue] = useState('inbox');
  return <Menu items={items} value={value} onValueChange={setValue} ariaLabel="Sidebar" className="w-56" />;
}

export const Default: Story = { render: () => <Demo /> };
