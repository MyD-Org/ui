import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

function Demo() {
  const [value, setValue] = useState('');
  return <SearchInput value={value} onValueChange={setValue} className="w-72" />;
}

export const Default: Story = { render: () => <Demo /> };
