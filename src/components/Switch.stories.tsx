import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch, type SwitchProps } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof Switch>;

function Demo(props: Omit<SwitchProps, 'checked' | 'onCheckedChange'> & { initial?: boolean }) {
  const { initial = false, ...rest } = props;
  const [checked, setChecked] = useState(initial);
  return <Switch {...rest} checked={checked} onCheckedChange={setChecked} />;
}

export const Default: Story = { render: () => <Demo label="Solo con stock" /> };
export const Activo: Story = { render: () => <Demo label="Solo con stock" initial /> };
export const Small: Story = { render: () => <Demo label="Notificaciones" size="sm" /> };
export const Disabled: Story = { render: () => <Demo label="Solo con stock" disabled initial /> };
export const SinLabel: Story = { render: () => <Demo aria-label="Modo oscuro" /> };
